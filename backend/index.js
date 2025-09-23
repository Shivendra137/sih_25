require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const ownerRoutes = require("./src/routes/owner");
const verifier = require("./src/routes/verifier")
const authRoutes = require("./src/routes/auth");
const { uploadJsonToPinata } = require("./src/utils/cid_form");
const app = express();

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
app.post('/upload', async (req, res) => {
  try {
    const cid = await uploadJsonToPinata(req.body);
    console.log("CID:", cid);
    res.json({ cid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
