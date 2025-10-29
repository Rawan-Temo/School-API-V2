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
const updateAttendance = async (req, res) => {
  try {
    // حل مؤقت بعدين اصلحها
    const attendanceId = req.params.id;
    const updateData = req.body;
    const allowedKeys = ["status"];
    let attendance;
    if (req.user.role === "Teacher") {
      attendance = await Attendance.findOne({
        _id: attendanceId,
        teacherId: req.user.profileId,
      });
    } else {
      attendance = await Attendance.findOne({
        _id: attendanceId,
      });
    }
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    Object.keys(updateData).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        delete updateData[key];
      }
    });

    attendance.status = updateData.status || attendance.status;
    await attendance.save();

    res.status(200).json({
      status: "success",
      message: "Attendance record updated successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  ...attendanceController,
  countData,
  updateAttendance,
};
