// backend/config/db.js

require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("DB connection error:", err);
        process.exit(1); // Exit process on failure
    }
}

module.exports = connectDB;