import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("http://localhost:5050/leaderboard");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!Array.isArray(leaderboard)) {
    return <div className="text-white text-center mt-20">Invalid leaderboard data.</div>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(/src/assets/background.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="bg-[#333333] bg-opacity-30 p-10 w-[80%] rounded-2xl shadow-lg text-center"
        style={{
          marginTop: "150px",
          maxWidth: "800px",
        }}
      >
        <h1 className="text-4xl font-bold text-white mb-6">Leaderboard</h1>
        <p className="text-lg text-gray-300 mb-6">
          See how you rank among other users based on energy usage!
        </p>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left text-gray-300">
            <thead>
              <tr className="bg-[#444444]">
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Watts</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr
                  key={user.S_ID || index}
                  className={index % 2 === 0 ? "bg-[#555555]" : "bg-[#444444]"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.S_ID || "N/A"}</td>
                  <td className="px-4 py-2">{user.totalWatts ?? 0} Watts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
