const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');

router.post('/addSchedule', sessionController.addSchedule);
router.post('/deleteSchedule', sessionController.deleteSchedule);
router.post('/getSessions', sessionController.getSessions);

module.exports = router;