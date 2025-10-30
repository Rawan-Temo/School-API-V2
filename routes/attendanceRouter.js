const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController.js");
const {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
  attachTeacherQuery,
  attachTeacherBody,
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
  .get(authenticateToken, isTeacher, attendanceController.getAll) // Get all attendance records
  .post(authenticateToken, isTeacher, attendanceController.createAttendance); // Add a new attendance record

router
  .route("/filtered")
  .get(authenticateToken, isTeacher, attendanceController.allAttendances);

router
  .route("/delete-many")
  .patch(authenticateToken, isAdmin, attendanceController.deleteMany);
// Route for specific attendance records by ID
router
  .route("/:id")
  .patch(authenticateToken, isTeacher, attendanceController.updateAttendance); // Update a specific attendance record

// Route to deactivate an attendance record by ID

// Route to delete an attendance record by ID

module.exports = router;
