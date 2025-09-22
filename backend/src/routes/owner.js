const express = require('express');
const router = express.Router();
const { missionRegister, verify } = require('../controllers/MissionController'); // import your controller

// Route for registering a mission
router.post('/missionRegister', missionRegister);

// Route for verifying a mission
router.post('/verify/:id', verify);

module.exports = router;
