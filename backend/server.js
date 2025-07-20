const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Load environment variables
require('dotenv').config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    mongoStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/papers", require("./routes/paperRoutes"));
app.use("/api/solutions", require("./routes/solutionRoutes"));
app.use("/api/chat",require("./routes/chat"));


// Create uploads folder if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connecting to:', process.env.MONGO_URI);
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
