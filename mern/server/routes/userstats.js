import express from "express";
import { getDb } from "../db/connection.js";

const router = express.Router();

/**
 * @route GET /userstats/:id
 * @desc Fetch weekly or basic user data (from Users collection)
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9]{7}$/.test(id)) {
    return res.status(400).json({ error: "Invalid Student ID." });
  }

  const db = getDb();
  const userCollection = db.collection("Users");

  try {
    const user = await userCollection.findOne({ S_ID: id });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

/**
 * @route GET /userstats/summary/:studentId
 * @desc Fetch cumulative user stats (from UserStats collection)
 */
router.get("/summary/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const db = getDb();
  const statsCollection = db.collection("UserStats");

  try {
    const stats = await statsCollection.findOne({ studentId });
    if (!stats) return res.status(404).json({ message: "No stats found." });
    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching summary stats:", err);
    res.status(500).json({ error: "Failed to retrieve stats." });
  }
});

/**
 * @route GET /userstats/sessions/:studentId
 * @desc Fetch session history (from Session collection)
 */
router.get("/sessions/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const db = getDb();
  const sessionCollection = db.collection("Session");

  try {
    const sessions = await sessionCollection
      .find({ studentId })
      .sort({ timestamp: -1 })
      .toArray();
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Failed to retrieve sessions." });
  }
});

export default router;
