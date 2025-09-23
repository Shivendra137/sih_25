const express = require('express');
const router = express.Router();
const { missionRegister,verify } = require('../controllers/MissionRegister'); // import your controller

// Route for registering a mission
router.post('/missionRegister', missionRegister);



module.exports = router;
