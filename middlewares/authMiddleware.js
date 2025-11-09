const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Course = require("../models/course");
const Exam = require("../models/exam");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Assuming Bearer token
  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(401); // Invalid token

    const foundUser = await User.findById(user.id);
    if (!foundUser) return res.sendStatus(404); // User not found

    req.user = foundUser; // Attach user to request object
    next();
  });
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied." });
};
const isTeacher = async (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "Teacher")) {
    return next();
  }
  res.status(403).json({ message: "Access denied." });
};
const isStudent = async (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "Admin" ||
      req.user.role === "Teacher" ||
      req.user.role === "Student")
  ) {
    return next();
  }
  res.status(403).json({ message: "Access denied." });
};

const attachStudentQuery = async (req, res, next) => {
  try {
    if (req.user.role === "Student") {
      req.query.studentId = req.user.profileId;
    }
    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const attachStudentBody = async (req, res, next) => {
  try {
    if (req.user.role === "Student") {
      req.body.studentId = req.user.profileId;
    }

    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const attachTeacherQuery = async (req, res, next) => {
  try {
    if (req.user.role === "Teacher") {
      req.query.teacherId = req.user.profileId;
    }

    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const attachTeacherBody = async (req, res, next) => {
  try {
    if (req.user.role === "Teacher") {
      req.body.teacherId = req.user.profileId;
    }

    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTeacherExamAuth = async (req, res, next) => {
  try {
    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;
      const { courseId } = req.body;

      // verify course exists and teacher belongs to it
      const course = await Course.findOne({ _id: courseId, teacherId });
      if (!course) {
        return res.status(403).json({
          message: "Course not found or unautherized to create an exam for it ",
        });
      }
    }
    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateTeacherExamAuth = async (req, res, next) => {
  try {
    const examId = req.params.id;
    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;
      const { courseId } = req.query;
      let course;

      // find attendance
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: "exam not found" });
      }

      if (courseId) {
        course = await Course.findOne({
          $or: [{ _id: exam.courseId }, { _id: courseId }],
          teacherId,
        });
      } else {
        course = await Course.findOne({
          _id: exam.courseId,
          teacherId,
        });
      }
      // find its course
      if (!course) {
        return res.status(403).json({
          message: "Course not found or not autherized to add an exam to",
        });
      }
    }
    return next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteTeacherExamAuth = async (req, res, next) => {
  try {
    const ids = req.body.ids;

    if (req.user.role === "Teacher") {
      const teacherId = req.user.profileId;

      // Get exams to delete
      const exams = await Exam.find({ _id: { $in: ids } });

      if (!exams.length) {
        return res.status(404).json({ message: "Exams not found" });
      }

      // Get courseIds from exams
      const courseIds = [...new Set(exams.map((e) => e.courseId))];

      // Check teacher owns all courseIds
      const courses = await Course.find({
        _id: { $in: courseIds },
        teacherId,
      });

      if (courses.length !== courseIds.length) {
        return res.status(403).json({
          message: "Not authorized to delete one or more of these exams",
        });
      }
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isTeacher,
  isStudent,
  attachStudentQuery,
  attachStudentBody,
  attachTeacherQuery,
  attachTeacherBody,
  createTeacherExamAuth,
  updateTeacherExamAuth,
  deleteTeacherExamAuth,
};
