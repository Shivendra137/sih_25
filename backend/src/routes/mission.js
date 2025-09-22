// // src/routes/missions.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const missionCtrl = require('../controllers/missionController');
// const { upload } = require('../middleware/upload');

// // upload images: multipart/form-data 'images[]'
// router.post('/upload', auth, upload.array('images', 50), missionCtrl.createMission);

// // get mission and its images
// router.get('/:id', auth, missionCtrl.getMission);

// // run MRV for a mission
// router.post('/:id/run_mrv', auth, missionCtrl.runMRV); // delegates to MRV controller or service

// module.exports = router;
