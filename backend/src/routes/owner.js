const express = require('express');
const router = express.Router();
const { missionRegister } = require('../controllers/MissionRegister'); // import your controller
const { runMRV } = require('../controllers/MRVController');
router.post('/missionRegister', missionRegister);
router.post('/missionMRV/:id', runMRV);

module.exports = router;
