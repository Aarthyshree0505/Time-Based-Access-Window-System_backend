const express = require("express");
const connectDB = require("./config/db");
const userApi = require("./API/userApi");
const requestApi = require("./API/requsetApi");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin:
      "https://time-based-access-window-s-git-2011a6-aarthyshree0505s-projects.vercel.app",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/user", userApi);
app.use("/request", requestApi);

// Default Route
app.get("/", (req, res) => {
  res.json({
    message: "Time Based Access Window System API running",
  });
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});