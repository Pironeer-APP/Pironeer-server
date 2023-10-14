const express = require('express');
const router = express.Router();
const attendController = require('../controllers/attendController.js');

router.post('/generatecode', attendController.generateCode);

router.post('/addAttend', attendController.addAttend);
router.post('/deleteTempAttend', attendController.deleteTempAttend);
router.post('/endAttend', attendController.endAttend);
router.post('/cancelAttend', attendController.cancelAttend);

router.post('/getSessionAttendAdmin', attendController.getSessionAttendAdmin);
router.post('/getSessionAndAttend', attendController.getSessionAndAttend);
router.post('/getCode', attendController.getCode);

module.exports = router;