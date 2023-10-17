const express = require('express');
const router = express.Router();
const assignController = require('../controllers/assignController.js');

router.post('/', assignController.showAssign);
router.post('/readAssign/all', assignController.readAssignAll); // AdminAssignmentScreen
router.post('/readAssign/detail', assignController.readAssignDetail); // AdminGradingScreen
router.post('/createAssign', assignController.createAssign); // AdminCreateAssignment
router.post('/updateAssign', assignController.updateAssign); // AdminUpdateAssignment
router.post('/deleteAssign', assignController.deleteAssign);
router.post('/createAssignGrade', assignController.createGrade);
router.post('/updateAssignGrade', assignController.updateGrade);
router.post('/getAssigns', assignController.getAssigns);

module.exports = router;