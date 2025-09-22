
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const owner =require("./src/routes/owner")

const app = express();

// Middleware
app.use(express.json()); // to parse JSON requests



// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use('/api/owner', owner);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)});


