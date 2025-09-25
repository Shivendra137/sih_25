const express = require('express');
const router = express.Router();
const { verify } = require('../controllers/missionVerifier'); 
router.post('/verify/:id', verify);

module.exports= router