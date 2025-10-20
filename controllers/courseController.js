const Course = require("../models/course");
const createController = require("../utils/createControllers");
// Get default controllers for
// Course model

const courseController = createController(Course, "course", "name", [
  "teacherId",
]);

const countData = async (req, res) => {
  try {
    const numberOfDocuments = await Course.countDocuments({ active: true });
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
  ...courseController,
  countData,
};
