const Attendance = require("../models/attendance");
const apiFeatures = require("../utils/apiFeatures");
// Get all attendance records
const getAllAttendances = async (req, res) => {
  try {
    const features = new apiFeatures(Attendance.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const [attendances, numberOfActiveAttendances] = await Promise.all([
      features.query,
      Attendance.countDocuments({ active: true }),
    ]);
    res.status(200).json({
      status: "success",
      numberOfActiveAttendances,
      results: attendances.length,
      data: attendances,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Get a specific attendance record by ID
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res
        .status(404)
        .json({ status: "fail", message: "Attendance record not found" });
    }
    res.status(200).json({
      status: "success",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
const timeResults = async (req, res) => {
  try {
    const { startDate, endDate, studentId } = req.query;
    let filter = {};

    // Add date range filtering if startDate or endDate is provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    if (studentId) {
      filter.studentId = studentId;
    }
    filter.active = true;

    // Query the TimeTable model with the filter
    const timeResults = await Attendance.find(filter);

    res.status(200).json({
      status: "success",
      results: timeResults.length,
      data: timeResults,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Add a new attendance record
const addAttendance = async (req, res) => {
  try {
    const newAttendance = await Attendance.create(req.body);
    res.status(201).json({
      status: "success",
      data: newAttendance,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Update a specific attendance record by ID
const updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAttendance) {
      return res
        .status(404)
        .json({ status: "fail", message: "Attendance record not found" });
    }
    res.status(200).json({
      status: "success",
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate an attendance record by ID
const deactivateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res
        .status(404)
        .json({ status: "fail", message: "Attendance record not found" });
    }
    if (!attendance.active) {
      res.status(200).json({
        status: "success",
        message: "Attendance allready deactivated",
        data: null,
      });
    } else {
      attendance.active = false; // Deactivate the attendance record
      await attendance.save();
      res.status(200).json({
        status: "success",
        message: "Attendance record deactivated successfully",
        data: null,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Delete an attendance record by ID
const deactivateManyAttendances = async (req, res) => {
  try {
    const attendanceIds = req.body.ids; // Expecting an array of attendance IDs

    // Validate input
    if (!attendanceIds || !Array.isArray(attendanceIds)) {
      return res.status(400).json({ status: "fail", message: "Invalid input" });
    }
    console.log(1);
    // Step 1: Soft delete the attendance records by updating the 'active' status
    const result = await Attendance.updateMany(
      { _id: { $in: attendanceIds } },
      { $set: { active: false } } // Set active to false for soft deletion
    );

    // Check if any documents were modified
    if (result.nModified === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No attendance records found or already deactivated.",
      });
    }

    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      message: "Attendance records deactivated successfully.",
      data: null,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
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
  getAllAttendances,
  getAttendance,
  addAttendance,
  updateAttendance,
  deactivateAttendance,
  deactivateManyAttendances,
  timeResults,
  countData,
};
