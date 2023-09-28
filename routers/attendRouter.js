const express = require('express');
const router = express.Router();
const attendController = require('../controllers/attendController.js');

router.post('/generatecode', attendController.generateCode);
router.post('/addAttend', attendController.addAttend);
router.post('/confirmAttend', attendController.confirmAttend);
router.post('/endAttend', attendController.endAttend);

module.exports = router;