const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');

router.post('/addSchedule', sessionController.addSchedule);

module.exports = router;