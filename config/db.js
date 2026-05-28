require("dotenv").config();
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    console.log("DB URL:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("Database Connection Error:");
    console.log(err);
  }
};