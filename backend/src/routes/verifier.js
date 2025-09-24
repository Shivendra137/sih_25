const express = require('express');
const router = express.Router();
const { verify, fetchMissions} = require('../controllers/missionVerifier'); // import your controller
const getPendingMRVs = require('../controllers/getPendingMRVs')
const getMRVdata = require('../controllers/getMRVdata')
const fetchMissionData = require('../controllers/fetchMissionData')
// Route for verifying a mission
router.post('/verify/:id', verify);
router.get('/missions', fetchMissions);
router.get('/pendingMRVs', getPendingMRVs)
router.get('/mrv/:id', getMRVdata)
router.get('/mission/:id', fetchMissionData)
module.exports= router