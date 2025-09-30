// controllers/mrvController.js
const MRVResult =require('../models/MRVResult') // replace with your actual model path

// @desc    Get MRV by ID
// @route   GET /api/mrv/:id
// @access  Private (if needed, add auth middleware)
const getMRVById = async (req, res) => {
  const { id } = req.params;

  try {
    const mrv = await MRVResult.findById(id);

    if (!mrv) {
      return res.status(404).json({ error: 'MRV not found' });
    }

    return res.status(200).json(mrv);
  } catch (error) {
    console.error("Error fetching MRV:", error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = 
  getMRVById

