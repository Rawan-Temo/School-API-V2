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
  .get(
    authenticateToken,
    isTeacher,
    attachTeacherQuery,
    attendanceController.getAll
  ) // Get all attendance records
  .post(
    authenticateToken,
    isTeacher,
    attachTeacherBody,
    attendanceController.createOne
  ); // Add a new attendance record

router.route("/delete-many").patch(
  authenticateToken,
  isTeacher,
  attachTeacherQuery,
  //TODO CHeck if teacher can delete these records
  attendanceController.deleteMany
);
// Route for specific attendance records by ID
router
  .route("/:id")
  .get(
    authenticateToken,
    isTeacher,
    attachTeacherQuery,
    attendanceController.getOneById
  ) // Get a specific attendance record
  .patch(
    authenticateToken,
    attachTeacherBody,
    isTeacher,
    attendanceController.updateAttendance
  ); // Update a specific attendance record

// Route to deactivate an attendance record by ID

// Route to delete an attendance record by ID

module.exports = router;
