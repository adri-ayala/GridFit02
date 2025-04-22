import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import logo from "../assets/GridFitLogo.PNG"; // Import the logo image

export default function Navbar() {
  const { user, setUser } = useUser(); // Access the logged-in user's S_ID and the logout function
  const isLoggedIn = !!user; // Check if a valid Student ID exists
  const isAdmin = user?.role === "admin"; // Check if the user is an admin
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Check if user is logged in and has a valid S_ID
    if (!user || !user.S_ID) {
      console.warn("No valid user found for logout.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/login/end-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ S_ID: user.S_ID }), // Send S_ID to the server
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setUser(null); // Clear context
      navigate("/login"); // Navigate to login
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // render navbar component
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center h-[80px] px-6 bg-[#333333] bg-opacity-30 shadow-lg z-50">
      {/* Logo */}
      <NavLink to="/">
        <img
          src={logo}
          alt="GridFit Logo"
          className="h-20"
          style={{ filter: "brightness(1.2) saturate(1.3)" }} // Adjust brightness and saturation
        />
      </NavLink>

      {/* Navigation Links */}
      <div className="flex space-x-4">
        <NavLink to="/home" className="text-white hover:text-green-500">
          Home
        </NavLink>
        <NavLink to="/about" className="text-white hover:text-green-500">
          About
        </NavLink>
        <NavLink to="/leaderboard" className="text-white hover:text-green-500">
          Leaderboard
        </NavLink>
        {isLoggedIn && (
          <NavLink
            to={`/stats/${user.S_ID}`}
            className="text-white hover:text-green-500"
          >
            User Stats
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/admin/dashboard"
            className="text-white hover:text-blue-500"
          >
            Admin Dashboard
          </NavLink>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-red-500"
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="text-white hover:text-green-500">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
