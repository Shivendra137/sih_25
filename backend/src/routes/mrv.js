// src/routes/mrv.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mrvCtrl = require('../controllers/mrvController');

router.get('/pending', auth, mrvCtrl.getPending); // verifier later
router.get('/:id', auth, mrvCtrl.getMRV);

module.exports = router;
