const express = require('express');
const router = express.Router();

const { missionRegister, uploadMiddleware } = require('../controllers/MissionRegister');
const runMRV  = require( "../controllers/MRVController")
const fetchMissionData = require('../controllers/fetchMissionData')
router.post('/missionRegister', uploadMiddleware, missionRegister);



router.post('/missionMRV/:id', runMRV);
router.get('/missions/:id', fetchMissionData)

module.exports = router;
