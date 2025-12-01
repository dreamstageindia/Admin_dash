// backend/index.js

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const router = require("./routes");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Error connecting to DB:", err);
});