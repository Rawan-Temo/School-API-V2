const ExamResult = require("../models/examResult");
const createController = require("../utils/createControllers");

// default controllers for ExamResult model

const examResultController = createController(ExamResult, "examResult", "", [
  { path: "examId", populate: "courseId" },
  { path: "studentId" },
]);

// Add a new exam result

/// Update a specific exam result by ID

const countData = async (req, res) => {
  try {
    const numberOfDocuments = await ExamResult.countDocuments({ active: true });
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
  ...examResultController,
  countData,
};
