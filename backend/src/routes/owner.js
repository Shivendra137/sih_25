const express = require('express');
const router = express.Router();

const { missionRegister, uploadMiddleware } = require('../controllers/MissionRegister');
const runMRV  = require( "../controllers/MRVController")
router.post('/missionRegister', uploadMiddleware, missionRegister);



router.post('/missionMRV/:id', runMRV);

 
module.exports = router;
