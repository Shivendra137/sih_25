const express = require('express');
const router = express.Router();


const { missionRegister, uploadMiddleware } = require('../controllers/MissionRegister');
const { runMRV }  = require( "../controllers/MRVController")
const fetchMissionData = require('../controllers/fetchMissionData')
const getMRV = require('../controllers/getMRV')


router.post('/missionRegister/:id', uploadMiddleware, missionRegister);
router.post('/missionMRV/:id', runMRV);
router.get('/missions/:id', fetchMissionData)
router.get('/getMRV/:id', getMRV);

// router.post('/missionMRV/:id', runMRV);
// router.post('/missionMRV/:id', runMRV); 

module.exports = router;






