const Attendance = require("../models/attendance");
const apiFeatures = require("../utils/apiFeatures");
const createController = require("../utils/createControllers");
// create default controllers for Attendance model

const attendanceController = createController(Attendance, "attendance", "", [
  "studentId",
  "courseId",
]);

const countData = async (req, res) => {
  try {
    const numberOfDocuments = await Attendance.countDocuments({ active: true });
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfDocuments,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
module.exports = {
  ...attendanceController,
  countData,
};
