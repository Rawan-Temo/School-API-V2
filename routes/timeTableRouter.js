const express = require("express");
const router = express.Router();
const timeTableController = require("../controllers/timeTableController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");

router.get("/count", authenticateToken, isAdmin, timeTableController.countData);

router
  .route("/")
  .get(authenticateToken, isStudent, timeTableController.allTimeTables)
  .post(authenticateToken, isAdmin, timeTableController.addTimeTable);

router
  .route("/time-filter")
  .get(authenticateToken, isStudent, timeTableController.timeResults);
router
  .route("/deactivate-many")
  .patch(
    authenticateToken,
    isAdmin,
    timeTableController.deactivateManyTimeTables
  );

router
  .route("/deactivate/:id")
  .patch(authenticateToken, isAdmin, timeTableController.deactivateTimeTable);

router
  .route("/:id")
  .get(authenticateToken, isStudent, timeTableController.aTimeTable)
  .patch(authenticateToken, isAdmin, timeTableController.updateTimeTable);

module.exports = router;
