require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const ownerRoutes = require("./src/routes/owner");
const verifier = require("./src/routes/verifier")
const authRoutes = require("./src/routes/auth");
const app = express();

const cors = require("cors");

// Add this BEFORE your routes
app.use(cors({
  origin: "http://localhost:8080", // frontend origin
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json()); // to parse JSON requests

app.use(express.urlencoded({ extended: true })); // <--- for form data

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


  
app.use("/api/owner", ownerRoutes);
app.use("/api/verifier", verifier); 
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
