const express = require('express');
const router = express.Router();
const { missionRegister,verify } = require('../controllers/MissionRegister'); // import your controller

router.post('/missionRegister', missionRegister);


module.exports = router;
