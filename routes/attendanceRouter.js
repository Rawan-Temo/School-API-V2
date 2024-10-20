const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController.js");
router.get("/count", attendanceController.countData);

// Route for all attendance records
router
  .route("/")
  .get(attendanceController.getAllAttendances) // Get all attendance records
  .post(attendanceController.addAttendance); // Add a new attendance record
router.route("/time-filter").get(attendanceController.timeResults);

// Route for specific attendance records by ID
router
  .route("/:id")
  .get(attendanceController.getAttendance) // Get a specific attendance record
  .patch(attendanceController.updateAttendance); // Update a specific attendance record

// Route to deactivate an attendance record by ID
router
  .route("/deactivate/:id")
  .patch(attendanceController.deactivateAttendance); // Change PATCH to match HTTP conventions

// Route to delete an attendance record by ID
router
  .route("/deleteAttendances")
  .delete(attendanceController.deactivateManyAttendances); // Delete a specific attendance record

module.exports = router;
