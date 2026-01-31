const express = require('express');
const connectDB = require("./config/db");
const userApi = require("./API/userApi");
const app = express()
require("dotenv").config()

app.use(express.json())
connectDB();

app.use("/users",userApi)
app.listen(process.env.PORT,() =>{
    console.log("server is running on ",3000)
})