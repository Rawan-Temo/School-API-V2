const { default: mongoose } = require("mongoose");
const Attendance = require("../models/attendance");
const Course = require("../models/course");
const StudentCourse = require("../models/studentCourse");
const apiFeatures = require("../utils/apiFeatures");
const createController = require("../utils/createControllers");
const APIFeatures = require("../utils/apiFeatures");
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
    const attendanceId = req.params.id;
    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;

      // find attendance
      const attendance = await Attendance.findById(attendanceId);
      if (!attendance) {
        return res.status(404).json({ message: "Attendance not found" });
      }

      // find its course
      const course = await Course.findById(attendance.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // verify teacher belongs to course
      if (
        !course.teacherId
          .map((t) => t.toString())
          .includes(teacherId.toString())
      ) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    const updated = await Attendance.findByIdAndUpdate(attendanceId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const createAttendance = async (req, res) => {
  try {
    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;
      const { courseId } = req.body;

      // verify course exists and teacher belongs to it
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (
        !course.teacherId
          .map((t) => t.toString())
          .includes(teacherId.toString())
      ) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    const attendance = await Attendance.create(req.body);
    return res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
};

const allAttendances = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;

    // Teacher check
    if (req.user.role === "Teacher") {
      const teacherId = req.user.id;
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
      if (
        !course.teacherId
          .map((t) => t.toString())
          .includes(teacherId.toString())
      )
        return res.status(403).json({ message: "Not allowed" });
    }

    // Get all student IDs for this course
    const students = await StudentCourse.find({ courseId })
      .sort({ date: -1 })
      .select("studentId");
    // Get unique student IDs
    const studentIds = [
      ...new Set(students.map((s) => s.studentId.toString())),
    ];
    const studentObjectIds = studentIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    console.log(studentObjectIds);
    // Build query
    const query = { studentId: { $in: studentObjectIds } };

    // Pagination

    const features = new APIFeatures(
      Attendance.find(query).populate({
        path: "studentId",
        select: "firstName lastName",
      }),
      req.query
    ).filter();
    const attendances = await features.query;

    console.log(studentObjectIds);
    console.log(attendances);

    res.status(200).json({
      status: "success",
      results: attendances.length,
      data: attendances,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  ...attendanceController,
  countData,
  updateAttendance,
  createAttendance,
  allAttendances,
};
