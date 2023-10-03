const express = require('express');
const router = express.Router();
const assignController = require('../controllers/assignController.js');

router.post('/', assignController.showAssign);
router.post("/readAssign/all", assignController.readAssignAll); // AdminAssignmentScreen
// 여기서 NewAssignId는 실제 값 X 마감 기한에 따른 정렬 순서 id
router.post("/readAssign/detail", assignController.readAssignDetail); // AdminGradingScreen
router.post("/createAssign", assignController.createAssign); // AdminCreateAssignment
router.post("/updateAssign", assignController.updateAssign); //
router.post("/deleteAssign", assignController.deleteAssign);
// router.post("/createAssignGrade", assignController.createGrade);
router.post('')

module.exports = router;