

---

# GridFit 🌱⚡

GRIDFIT is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help users track their energy usage, monitor device charging habits, and compete on a leaderboard. The platform provides an intuitive interface for users to log in, view personalized energy stats, and compare their performance with others.
---

## 📋 Project Description

GridFit is a full-stack web application designed to track power generation sessions from a DAQ (Data Acquisition) device. It allows users to monitor real-time data like voltage, watts generated, total energy (Wh), CO₂ saved, and session duration. Each session is logged, and user statistics are stored and visualized through a web dashboard.

---

## 🚀 Features

- **Live DAQ Data Streaming** (Voltage, Power, CO₂ Saved)
- **Start and End Session Controls**
- **Student Login System** (via 7-digit ID)
- **Session History Logging**
- **Leaderboard** for top energy generators
- **Admin Dashboard** with cumulative metrics
- **MongoDB Integration** for storing sessions and user stats



## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GridFit.git
   cd GridFit
   ```

2. **Install dependencies:**
   - For server:
     ```bash
     cd mern/server
     npm install
     ```
   - For client:
     ```bash
     cd ../client
     npm install
     ```

3. **Configure environment variables:**
   - Create a `.env` file inside `mern/server/`
   - Example:
     ```
     MONGO_URI=your_mongodb_connection_string
     PORT=5050
     ```

4. **Run the application:**
   - Start the backend:
     ```bash
     cd mern/server
     npm run dev
     ```
   - Start the frontend:
     ```bash
     cd ../client
     npm start
     ```

5. **Connect DAQ device:**
   - Make sure the DI-1100 DAQ is connected to the correct COM port.
   - Python script `DAQ.py` will automatically start on session start.

---

## 📈 Live Data

- Frontend receives real-time updates through WebSocket (`socket.io`).
- Displays session metrics like:
  - Current Voltage
  - Power (W)
  - Total Energy (Wh)
  - CO₂ Saved (kg)
  - Duration

---

## 📊 Admin Dashboard

Admins can view:
- Total Watts generated
- Total CO₂ saved
- Average session durations
- Top users via Leaderboard
  

---

## ✨ Future Improvements

- Authentication for Admin accounts
- Weekly and monthly statistics
- User profile pages
- Advanced DAQ device support
- Mobile version of dashboard

---

## 📚 License

This project is licensed under the [MIT License](LICENSE).

---

# 👨‍💻 Made with passion by [Your Name]

---

---
  
Would you also like me to **format it even cooler** with some badges (like `React`, `Node.js`, `MongoDB`, etc.) if you want it to look even more polished? 🚀  
I can also **generate a version with screenshots** if you want to show off your app! 📸  
Want me to? 🎯
