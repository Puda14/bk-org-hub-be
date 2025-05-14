const express = require("express");
const connectDB = require("./config/db");
const entityRoutes = require("./routes/entityRoutes");
const cors = require("cors");
const suggestionRoutes = require("./routes/suggestionRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/entities", entityRoutes);
app.use("/api/suggest", suggestionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
