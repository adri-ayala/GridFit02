import express from "express";
import { getDb } from "../db/connection.js";
import { spawn } from "child_process";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const daqProcesses = new Map(); // Track DAQ processes per student ID

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ LOGIN / START DAQ
router.post("/", async (req, res) => {
  const { S_ID } = req.body;

  try {
    if (!/^[0-9]{7}$/.test(S_ID)) {
      return res.status(400).json({ error: "Invalid Student ID." });
    }

    const db = getDb();
    const collection = db.collection("Users");

    let student = await collection.findOne({ S_ID });

    if (!student) {
      const newStudent = {
        S_ID,
        watts: 0,
        weeklyWattage: {
          Monday: 0, Tuesday: 0, Wednesday: 0,
          Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0,
        },
      };
      const result = await collection.insertOne(newStudent);
      student = { _id: result.insertedId, ...newStudent };
    }

    // Check if DAQ already running
    if (daqProcesses.has(S_ID)) {
      return res.status(400).json({ error: "DAQ already running." });
    }

    // Clean up old signal files
    const signals = ["stop_signal.txt", "resume_state.json", "pause_signal.txt"];
    signals.forEach((file) => {
      const filePath = path.join(__dirname, "..", file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Start DAQ process
    const scriptPath = path.join(__dirname, "..", "daq.py");
    const pythonProcess = spawn("python", ["-u", scriptPath, S_ID]);

    daqProcesses.set(S_ID, pythonProcess);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`[${S_ID}] ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`[${S_ID} ERROR] ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`[${S_ID}] DAQ exited with code ${code}`);
      daqProcesses.delete(S_ID);
    });

    res.status(200).json(student);
  } catch (err) {
    console.error("Login/DAQ start error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ✅ END SESSION / STOP DAQ
router.post("/end-session", (req, res) => {
  const { S_ID } = req.body;

  try {
    const stopPath = path.join(__dirname, "..", "stop_signal.txt");
    fs.writeFileSync(stopPath, "stop");
    console.log("stop_signal.txt written at:", stopPath);

    const process = daqProcesses.get(S_ID);
    if (process && !process.killed) {
      process.kill();
      console.log(`Stopped DAQ for ${S_ID}`);
    } else {
      console.log(`No running DAQ to stop for ${S_ID}`);
    }

    daqProcesses.delete(S_ID);
    res.status(200).json({ message: "Session ended and DAQ stopped." });
  } catch (err) {
    console.error("End-session error:", err);
    res.status(500).json({ error: "Could not end session." });
  }
});

router.post("/logout", (req, res) => {
  const { S_ID } = req.body;
  const stopPath = path.join(__dirname, "..", "stop_signal.txt");

  try {
    fs.writeFileSync(stopPath, "stop");
    console.log("stop_signal.txt written at:", stopPath);

    const process = daqProcesses.get(S_ID);
    if (process && !process.killed) {
      process.kill();
      daqProcesses.delete(S_ID);
      console.log(`Stopped DAQ for ${S_ID}`);
    }

    res.status(200).json({ message: "Logout and DAQ stop successful." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Failed to log out." });
  }
});


export default router;
