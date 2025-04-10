import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Login() {
  const [studentID, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (studentID.toLowerCase() === "admin") {
        // Admin login
        if (!password) {
          setError("Please enter the admin password.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5050/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "Admin", password }),
        });

        const result = await res.json();

        if (res.ok) {
          setUser({ S_ID: "Admin" });
          navigate("/admin");
        } else {
          setError(result.error || "Admin login failed.");
        }

      } else if (/^[0-9]{7}$/.test(studentID)) {
        // Student login
        const response = await fetch("http://localhost:5050/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ S_ID: studentID }),
        });

        if (!response.ok) throw new Error("Student login failed.");

        const userData = await response.json();
        setUser(userData);

        navigate(`/stats/${studentID}`);
      } else {
        setError("Enter a valid 7-digit Student ID or 'Admin'");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setStudentID(value);
    setShowPassword(value.toLowerCase() === "admin");
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-[#333333] bg-opacity-30 p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Login</h1>

        <input
          type="text"
          placeholder="Enter Student ID or Admin"
          value={studentID}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          disabled={loading}
          autoComplete="username"
          id="studentID"
          name="studentID"
        />

        {showPassword && (
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            disabled={loading}
            autoComplete="current-password"
            id="adminPassword"
            name="adminPassword"
          />
        )}

        <button
          type="submit"
          className={`bg-green-500 px-4 py-2 rounded text-white ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
