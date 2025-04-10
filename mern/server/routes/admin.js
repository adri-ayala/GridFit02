// routes/admin.js
import express from "express";
const router = express.Router();
import { getDb } from "../db/connection.js";


router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "Admin" && password === "gridfit") {
    return res.status(200).json({ message: "Admin login successful" });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
        console.log("❌ DB not initialized");
        return res.status(500).json({ error: "Database not connected." });
      }
  
      const users = await db.collection("UserStats").find().toArray();
      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching admin users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  

export default router;
