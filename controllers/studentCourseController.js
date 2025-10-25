const StudentCourse = require("../models/studentCourse");

const createControllers = require("../utils/createControllers");

const studentCourseController = createControllers(
  StudentCourse,
  "StudentCourse",
  [],
  ["studentId", "courseId"]
);

module.exports = studentCourseController;
