const Mission = require('../models/Mission');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });

    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// This will be used as middleware in your route
const uploadMiddleware = upload.array('files', 50); // max 50 files

// Mission register handler
// Mission register handler
async function missionRegister(req, res) {
  try {
    const { project, plot, missionId, avgCanopyFraction, notes } = req.body;
    if (!project || !missionId) {
      return res.status(400).json({ error: "Project ID and Mission ID are required" });
    }

    // Number of uploaded files
    const numImages = req.files ? req.files.length : 0;
    const fileNames = req.files ? req.files.map(f => f.filename) : [];

    // Create new Mission document
    const newMission = new Mission({
      project,
      plot: plot || null,
      missionId,
      numImages,
      files: fileNames,   // ✅ <-- save file names here
      avgCanopyFraction: avgCanopyFraction || 0.0,
      notes: notes || '',
      status: 'pending',
      created_at: new Date()
    });

    await newMission.save();

    return res.status(201).json({
      success: true,
      message: "Mission registered successfully",
      mission: newMission,
      filesUploaded: fileNames
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}


module.exports = { missionRegister, uploadMiddleware };
