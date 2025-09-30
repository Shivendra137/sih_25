// controllers/getWalletData.js
const User = require("../models/User");

// GET wallet data for a specific user
const getWalletData = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and select only wallet-related fields
    const user = await User.findById(userId).select(
      "wallet totalEarnedCredits pendingCredits"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      wallet: user.wallet,
      totalEarnedCredits: user.totalEarnedCredits,
      pendingCredits: user.pendingCredits,
    });
  } catch (err) {
    console.error("Error fetching wallet data:", err);
    res.status(500).json({ error: "Failed to fetch wallet data" });
  }
};

module.exports = getWalletData;
