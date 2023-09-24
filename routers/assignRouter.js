const express = require('express');
const router = express.Router();
const assignController = require('../controllers/assignController.js');

router.get('/assign', assignController.showAssign);

module.exports = router;