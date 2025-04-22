import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { useUser } from "../context/UserContext";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// WebSocket setup
const socket = io("http://localhost:5050", {
  transports: ["websocket"],
  cors: { origin: "http://localhost:5173" },
  reconnection: true,
});

export default function UserStats() {
  const { user } = useUser();
  const { id } = useParams();

  const [weeklyData, setWeeklyData] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liveVoltage, setLiveVoltage] = useState(null);
  const [liveWatts, setLiveWatts] = useState(null);
  const [liveTimestamp, setLiveTimestamp] = useState(null);
  const [totalCO2, setTotalCO2] = useState(0);
  const [generationRate, setGenerationRate] = useState(0);
  const [duration, setDuration] = useState(0);
  const [daqState, setDaqState] = useState("stopped"); // "running" | "stopped"

  useEffect(() => {
    async function fetchWeeklyData() {
      try {
        const res = await axios.get(`http://localhost:5050/api/userstats/${id}`);
        const wattageData = Object.values(res.data.weeklyWattage).map(Number);
        setWeeklyData(wattageData);
        setStudentId(res.data.S_ID);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setError("Unable to fetch user data.");
        setLoading(false);
      }
    }

    if (id) fetchWeeklyData();
  }, [id]);

  useEffect(() => {
    const handleLiveData = (data) => {
      setLiveVoltage(data.voltage || null);
      setLiveWatts(data.watts);
      setLiveTimestamp(new Date().toLocaleTimeString());
      setTotalCO2(data.total_co2 || 0);
      setGenerationRate(data.generation_rate || 0);
      setDuration(data.duration || 0);
      setDaqState("running");
    };

    socket.on("liveData", handleLiveData);
    socket.on("disconnect", () => setDaqState("stopped"));

    return () => {
      socket.off("liveData", handleLiveData);
    };
  }, []);
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/login/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ S_ID: user.S_ID }),
      });
  
      if (res.ok) {
        // Optional: clear user context
        // logout(); <-- from context if using
        window.location.href = "/"; // redirect to login
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  const startDAQ = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ S_ID: user.S_ID }),
      });

      const data = await res.json();
      if (res.ok) {
        setDaqState("running");
      } else {
        alert(`Failed to start DAQ: ${data.error}`);
      }
    } catch (err) {
      console.error("Start DAQ error:", err);
      alert("Error starting DAQ process.");
    }
  };

  const endSession = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/login/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ S_ID: user.S_ID }),
      });
      if (res.ok) {
        setDaqState("stopped");
      } else {
        console.error("Failed to end session");
      }
    } catch (err) {
      console.error("End session error:", err);
    }
  };

  if (loading) return <p className="text-white text-center">Loading...</p>;

  if (error) {
    return (
      <div className="text-white text-center">
        <p className="text-lg font-bold text-red-500">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="flex flex-row justify-between items-center w-4/5">
        <div className="w-2/3">
          <h1 className="text-2xl text-white mb-4">Welcome back, {studentId}</h1>
          <Bar
            data={{
              labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              datasets: [
                {
                  label: "Wattage Generated (Wh)",
                  data: weeklyData,
                  backgroundColor: "rgba(48, 203, 15, 0.7)",
                },
              ],
            }}
            options={{ responsive: true }}
          />

          <div className="mt-6 flex gap-4">
            {daqState === "stopped" && (
              <button onClick={startDAQ} className="bg-green-500 text-white px-4 py-2 rounded">
                Start
              </button>
            )}
            {daqState === "running" && (
              <button onClick={endSession} className="bg-red-600 text-white px-4 py-2 rounded">
                End Session
              </button>
            )}
          </div>
        </div>

        <div className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg text-white text-lg ml-4">
          <h2 className="text-xl mb-4">Live Stats</h2>
          <p>CO₂ Saved: {totalCO2 ? totalCO2.toFixed(4) : "0.0000"} g</p>
          <p>Generation Rate: {generationRate ? generationRate.toFixed(2) : "0.00"} W</p>
          <p>Duration: {Math.floor(duration / 60)}m {Math.floor(duration % 60)}s</p>
          <p>Voltage: {liveVoltage !== null ? `${liveVoltage.toFixed(3)} V` : "N/A"}</p>
          <p>Watts: {liveWatts !== null ? `${liveWatts.toFixed(3)} W` : "N/A"}</p>
          <p>Last Update: {liveTimestamp || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
