import express from "express";
import { getDb } from "../db/connection.js";

const router = express.Router();

// GET /leaderboard - Fetch leaderboard data
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    if (!db) {
      return res.status(500).send("Database connection not established.");
    }

    const collection = db.collection("Users");

    // Fetch top 10 users sorted by totalWatts descending
    const leaderboard = await collection
      .find({})
      .sort({ totalWatts: -1 })
      .limit(10)
      .project({ S_ID: 1, totalWatts: 1, _id: 0 }) // ✅ Fix projection key
      .toArray();

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    res.status(500).send("Error fetching leaderboard data");
  }
});

export default router;
