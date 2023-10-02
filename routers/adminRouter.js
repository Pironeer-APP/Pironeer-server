const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const assignController = require("../controllers/assignController.js");

router.post("/getUserInfo", adminController.getUserInfo);
router.post("/addCoupon", adminController.addCouponToUser);
router.post("/deleteCoupon", adminController.deleteCoupon);

// admin assign 나중에 분리..?
router.get("/assign/:level", assignController.readAssignAll);
router.post("/assign/:level/:AssignSchedule_id", assignController.readAssignDetail);
router.post("/assign/:level/create", assignController.createAssign);
// router.get("/assign/:level/update", assignController.updateAssign);
router.post("/assign/:level/update", assignController.updatedAssign);
router.post(
  "/assign/:level/:AssignSchedule_id/delete",
  assignController.deleteAssign
);
router.get(
  "/assign/:level/:AssignSchedule_id/:AssignUserId/create",
  assignController.readGrade
);
router.post(
  "/assign/:level/:AssignSchedule_id/:AssignUserId/create",
  assignController.createGrade
);

module.exports = router;
