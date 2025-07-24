const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.send("API is running..."));

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "MongoError") {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;