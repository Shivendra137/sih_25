const Issuance = require("../models/Issuance");
const Mission = require("../models/Mission");

// Fetch issuance history by ownerId
const getIssuanceByOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;

    // Find all issuances linked to missions owned by this user
    const issuances = await Issuance.find({ ownerId })
    //   .populate({
    //     path: "mission",
    //     select: "name slug",
    //   })
    //   .populate({
    //     path: "mrv",
    //     select: "status results",
    //   })

    //   .sort({ createdAt: -1 }); // newest first

    res.json(issuances);
  } catch (err) {
    console.error("Error fetching issuance history:", err);
    res.status(500).json({ error: "Failed to fetch issuance history" });
  }
};

module.exports = getIssuanceByOwner;
