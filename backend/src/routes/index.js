// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/projects', require('./projects'));
router.use('/plots', require('./plots'));
router.use('/missions', require('./missions'));
router.use('/mrv', require('./mrv'));

module.exports = router;
