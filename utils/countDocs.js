const Admin = require("../models/admin");
const Attendance = require("../models/attendance");
const Class = require("../models/class");
const Course = require("../models/course");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

module.exports.countDocuments = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    const [
      classCount,
      courseCount,
      maleStudentCount,
      maleTeacherCount,
      femaleStudentCount,
      femaleTeacherCount,
    ] = await Promise.all([
      Class.countDocuments({ active: true, ...parsedQuery }),
      Course.countDocuments({ active: true, ...parsedQuery }),
      Student.countDocuments({ active: true, gender: "Male", ...parsedQuery }),
      Teacher.countDocuments({ active: true, gender: "Male", ...parsedQuery }),
      Student.countDocuments({
        active: true,
        gender: "Female",
        ...parsedQuery,
      }),
      Teacher.countDocuments({
        active: true,
        gender: "Female",
        ...parsedQuery,
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        classCount,
        courseCount,
        maleStudentCount,
        maleTeacherCount,
        femaleStudentCount,
        femaleTeacherCount,
      },
    });
  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).send("Internal Server Error");
  }
};
