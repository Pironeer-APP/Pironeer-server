const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController.js');

router.get('/generatecode', codeController.generateCode);
router.get('/removecode', codeController.removeCode);
router.get('/', codeController.viewCode);
module.exports = router;