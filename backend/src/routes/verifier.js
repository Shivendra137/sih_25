const express = require('express');
const router = express.Router();
const { verify } = require('../controllers/missionVerifier'); // import your controller

// Route for verifying a mission
router.post('/verify/:id', verify);

module.exports= router