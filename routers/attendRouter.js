const express = require('express');
const router = express.Router();
const attendController = require('../controllers/attendController.js');

router.post('/generatecode', attendController.generateCode);
router.post('/addAttend', attendController.addAttend);
router.post('/confirmAttend', attendController.confirmAttend);
router.post('/endAttend', attendController.endAttend);
router.post('/updateAttend', attendController.updateAttend);
router.post('/getSessionAttendAdmin', attendController.getSessionAttendAdmin);
router.post('/getSessionAndAttend', attendController.getSessionAndAttend);
router.post('/getCode', attendController.getCode);

module.exports = router;