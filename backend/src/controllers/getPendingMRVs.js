const MRVSchema = require("../models/MRVResult");

// ✅ Get all pending MRVs
const getPendingMRVs = async (req, res) => {
  try {
    // Find all MRV documents where status is "pending"
    const pendingMRVs = await MRVSchema.find({ status: "pending" }).populate("mission");

    // If no pending MRVs found, return empty array
    if (!pendingMRVs || pendingMRVs.length === 0) {
      return res.status(200).json({ pendingMRVs: [] });
    }

    // Return pending MRVs
    res.json({ pendingMRVs });
  } catch (err) {
    console.error("Error fetching pending MRVs:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = getPendingMRVs;
