const express = require('express');
const router = express.Router();
const attendController = require('../controllers/attendController.js');

router.get('/codegeneration', attendController.codeGeneration);

module.exports = router;