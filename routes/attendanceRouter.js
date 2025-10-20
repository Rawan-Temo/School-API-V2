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
  .get(authenticateToken, isTeacher, attendanceController.getAll) // Get all attendance records
  .post(authenticateToken, isTeacher, attendanceController.createOne); // Add a new attendance record

router
  .route("/deactivate-many")
  .patch(authenticateToken, isTeacher, attendanceController.deactivateMany);

router
  .route("/delete-many")
  .patch(authenticateToken, isTeacher, attendanceController.deleteMany);
// Route for specific attendance records by ID
router
  .route("/:id")
  .get(authenticateToken, isTeacher, attendanceController.getOneById) // Get a specific attendance record
  .patch(authenticateToken, isTeacher, attendanceController.updateOne); // Update a specific attendance record

// Route to deactivate an attendance record by ID
router
  .route("/deactivate/:id")
  .patch(authenticateToken, isTeacher, attendanceController.deactivateOne); // Change PATCH to match HTTP conventions

// Route to delete an attendance record by ID

module.exports = router;
