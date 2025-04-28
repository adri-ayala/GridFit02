// routes/admin.js
import express from "express";
import { getDb } from "../db/connection.js";

const router = express.Router();

//  Admin Login Route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "Admin" && password === "gridfit") {
    console.log("Admin logged in");
    return res.status(200).json({ message: "Admin login successful" });
  } else {
    console.warn("Invalid admin login attempt");
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

//  Admin Get All Users
router.get("/users", async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection("Users").find().toArray(); // ← This pulls from Users
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching admin users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


export default router;
