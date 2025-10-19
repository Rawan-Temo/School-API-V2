const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
} = require("../middlewares/authMiddleware.js");
router.get(
  "/count",
  authenticateToken,
  isTeacher,
  attendanceController.countData
);

// Route for all attendance records
router
  .route("/")
  .get(authenticateToken, isTeacher, attendanceController.getAllAttendances) // Get all attendance records
  .post(authenticateToken, isTeacher, attendanceController.addAttendance); // Add a new attendance record
router
  .route("/time-filter")
  .get(authenticateToken, isTeacher, attendanceController.timeResults);

router
  .route("/deleteAttendances")
  .delete(
    authenticateToken,
    isTeacher,
    attendanceController.deactivateManyAttendances
  ); // Delete a specific attendance record
// Route for specific attendance records by ID
router
  .route("/:id")
  .get(authenticateToken, isTeacher, attendanceController.getAttendance) // Get a specific attendance record
  .patch(authenticateToken, isTeacher, attendanceController.updateAttendance); // Update a specific attendance record

// Route to deactivate an attendance record by ID
router
  .route("/deactivate/:id")
  .patch(
    authenticateToken,
    isTeacher,
    attendanceController.deactivateAttendance
  ); // Change PATCH to match HTTP conventions

// Route to delete an attendance record by ID

module.exports = router;
