const MRVSchema = require("../models/MRVResult");
const mongoose = require('mongoose')
// ✅ Get MRV by mission id
const getMRV = async (req, res) => {
  try {
    const { id } = req.params; // mission id
    const mrv = await MRVSchema.findOne({ mission: id }).populate("mission");

    if (!mrv) {
      return res.status(404).json({ error: "No MRV found for this mission" });
    }

    res.json(mrv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = getMRV ;
