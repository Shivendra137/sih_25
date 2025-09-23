const express = require('express');
const router = express.Router();
const { missionRegister, uploadMiddleware } = require('../controllers/MissionRegister');

router.post('/missionRegister', uploadMiddleware, missionRegister);

module.exports = router;
