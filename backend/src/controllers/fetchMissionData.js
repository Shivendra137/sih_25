const Mission = require('../models/Mission'); // adjust path to your Mission model

const fetchMissionData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Mission ID is required" });
    }

    const mission = await Mission.findById(id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    // Send mission data
    res.status(200).json(mission);
  } catch (error) {
    console.error("Error fetching mission:", error);
    res.status(500).json({ message: "Server error while fetching mission" });
  }
};

module.exports = fetchMissionData;
