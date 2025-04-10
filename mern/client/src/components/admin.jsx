import { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("userStats");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:5050/api/admin/users");
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Admin fetch error:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const totalTimeSpent = users.reduce((sum, user) => sum + user.duration, 0);
  const averageTimePerUser = totalUsers ? totalTimeSpent / totalUsers : 0;
  const totalCO2Saved = users.reduce((sum, user) => sum + user.totalCO2, 0);
  const averageCO2Saved = totalUsers ? totalCO2Saved / totalUsers : 0;
  const totalWattsGenerated = users.reduce((sum, user) => sum + user.totalWatts, 0);
  const averageWattsGenerated = totalUsers ? totalWattsGenerated / totalUsers : 0;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Tab Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "userStats"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("userStats")}
        >
          User Stats
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "gridFitData"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("gridFitData")}
        >
          GridFit Data
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "userStats" && (
        <div>
          {loading ? (
            <p className="text-center">Loading user stats...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-600">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 border border-gray-700">Student ID</th>
                    <th className="px-4 py-2 border border-gray-700">Total Watts</th>
                    <th className="px-4 py-2 border border-gray-700">Total CO₂</th>
                    <th className="px-4 py-2 border border-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.studentId} className="text-center">
                      <td className="px-4 py-2 border border-gray-700">{user.studentId}</td>
                      <td className="px-4 py-2 border border-gray-700">{user.totalWatts} Wh</td>
                      <td className="px-4 py-2 border border-gray-700">{user.totalCO2.toFixed(4)} kg</td>
                      <td className="px-4 py-2 border border-gray-700">{user.duration} sec</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "gridFitData" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {/* Section: Users */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md col-span-full">
            <h2 className="text-2xl font-semibold mb-4">User Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Total Users</h3>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Total Time Spent</h3>
                <p className="text-2xl font-bold">{totalTimeSpent} sec</p>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Avg Time per User</h3>
                <p className="text-2xl font-bold">{averageTimePerUser.toFixed(2)} sec</p>
              </div>
            </div>
          </div>

          {/* Section: CO₂ */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md col-span-full">
            <h2 className="text-2xl font-semibold mb-4">CO₂ Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Total CO₂ Saved</h3>
                <p className="text-2xl font-bold">{totalCO2Saved.toFixed(4)} kg</p>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Avg CO₂ Saved</h3>
                <p className="text-2xl font-bold">{averageCO2Saved.toFixed(4)} kg</p>
              </div>
            </div>
          </div>

          {/* Section: Energy */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md col-span-full">
            <h2 className="text-2xl font-semibold mb-4">Energy Generated</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Total Watts Generated</h3>
                <p className="text-2xl font-bold">{totalWattsGenerated.toFixed(2)} Wh</p>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <h3 className="text-lg">Avg Watts per User</h3>
                <p className="text-2xl font-bold">{averageWattsGenerated.toFixed(2)} Wh</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
