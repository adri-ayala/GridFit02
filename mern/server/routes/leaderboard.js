import express from "express";
import { getDb } from "../db/connection.js"; // Import the database connection

const router = express.Router();

// GET /leaderboard - Fetch leaderboard data
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    if (!db) {
      return res.status(500).send("Database connection not established.");
    }

    const collection = db.collection("UserStats");

    // Fetch top 10 users sorted by watts in descending order
    const leaderboard = await collection
      .find({})
      .sort({ totalWatts: -1 }) // Sort by watts as a number
      .limit(10)
      .project({ studentId: 1, totalWatts: 1, _id: 0 })
      .toArray();

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    res.status(500).send("Error fetching leaderboard data");
  }
});

export default router;
