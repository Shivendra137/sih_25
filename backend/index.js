
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ownerRoutes = require("./src/routes/owner");

const app = express();

// Middleware
app.use(express.json()); // to parse JSON requests
// app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // <--- for form data

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.send("API is running...");
});
// Routes

app.use("/api/owner", ownerRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
