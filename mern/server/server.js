import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import { connectToDatabase } from "./db/connection.js";

import records from "./routes/record.js";
import loginRoutes from "./routes/login.js";
import leaderboardRoute from "./routes/leaderboard.js";
import adminRoutes from "./routes/admin.js";


const PORT = process.env.PORT || 5050;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use("/api/login", loginRoutes);
app.use("/leaderboard", leaderboardRoute);
app.use("/record", records);
app.use("/api/admin", adminRoutes);
let db;

// Connect to MongoDB
connectToDatabase()
  .then((database) => {
    db = database;
    console.log("Connected to MongoDB successfully!");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Middleware for routes needing DB
const checkDbConnection = (req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: "Database not connected." });
  }
  next();
};

// ✅ GET student stats
app.get("/api/userstats/:id", checkDbConnection, async (req, res) => {
  const { id } = req.params;

  try {
    if (!/^[0-9]{7}$/.test(id)) {
      return res.status(400).json({ error: "Invalid Student ID (must be 7 digits)." });
    }

    const student = await db.collection("Users").findOne({ S_ID: id });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to retrieve student stats." });
  }
});

// ✅ POST: Receive live data from DAQ.py
app.post("/api/student/live-data", (req, res) => {
  const { studentId, voltage, watts, timestamp, total_co2, generation_rate, duration } = req.body;

  if (!studentId || watts === undefined) {
    return res.status(400).json({ error: "Invalid data format." });
  }

  const payload = {
    studentId,
    voltage: voltage || null,
    watts,
    timestamp: timestamp || new Date().toISOString(),
    total_co2: total_co2 || 0,
    generation_rate: generation_rate || 0,
    duration: duration || 0
  };

  console.log("Broadcasting live data:", payload);
  io.emit("liveData", payload);

  res.status(200).json({ message: "Live data received and broadcasted." });
});
