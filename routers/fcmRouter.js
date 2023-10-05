const express = require('express');
const router = express.Router();
const fcmController = require('../controllers/fcmController.js');

router.post('/push', fcmController.push);
router.post('/saveToken', fcmController.saveToken);

module.exports = router;