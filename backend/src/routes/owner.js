const express = require('express');
const router = express.Router();
const { missionRegister, verify } = require('../controllers/MissionController'); 

router.post('/missionRegister', missionRegister);

router.post('/verify/:id', verify);

module.exports = router;
