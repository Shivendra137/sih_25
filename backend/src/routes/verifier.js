const express = require('express');
const router = express.Router();
const { verify, fetchMissions, fetchMissionData } = require('../controllers/missionVerifier'); // import your controller

// Route for verifying a mission
router.post('/verify/:id', verify);
router.get('/missions', fetchMissions);

module.exports= router