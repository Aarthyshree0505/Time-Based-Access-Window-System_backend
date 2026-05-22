const express = require('express');
const connectDB = require("./config/db");
const userApi = require("./API/userApi");
const requestApi = require("./API/requsetApi");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/user", userApi);        // changed from /users
app.use("/request", requestApi);  // changed from /change_access

app.get("/", (req, res) => {
    res.json({ message: "Time Based Access Window System API running" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on", process.env.PORT || 3000);
});