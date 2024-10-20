const ExamResult = require("../models/examResult");
const Exam = require("../models/exam");
const apiFeatures = require("../utils/apiFeatures");
// Get all exam results with pagination, sorting, and filtering
const allResults = async (req, res) => {
  try {
    const features = new apiFeatures(ExamResult.find(), req.query)
      .sort()
      .filter()
      .limitFields()
      .paginate();

    const [results, numberOfActiveResults] = await Promise.all([
      features.query.populate("student exam"),
      ExamResult.countDocuments({ active: true }),
    ]);
    res.status(200).json({
      status: "success",
      results: results.length,
      numberOfActiveResults, // Total count of documents in the collection
      data: results,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Get a specific exam result by ID
const aResult = async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await ExamResult.findById(resultId).populate("student exam");

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Add a new exam result
const addResult = async (req, res) => {
  try {
    const { student, exam, score, date } = req.body;

    // Check if the exam result already exists
    const existingResult = await ExamResult.findOne({
      student,
      exam,
      active: true,
    });

    if (existingResult) {
      return res.status(400).json({
        status: "fail",
        message: "This student already has a result for this exam.",
      });
    }
    const teagetExam = await Exam.findById(exam);
    const totalMarks = teagetExam.totalMarks;

    if (score > totalMarks) {
      res.status(400).json({
        status: "fail",
        message: "cannot pass the marks limit",
      });
    } else {
      // Create a new exam result if no duplicate found
      const newExamResult = new ExamResult({ student, exam, score, date });
      await newExamResult.save();

      res.status(201).json({
        status: "success",
        data: newExamResult,
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
/// Update a specific exam result by ID
const updateResult = async (req, res) => {
  try {
    const resultId = req.params.id;

    // Fetch the existing exam result first
    const existingResult = await ExamResult.findById(resultId).populate("exam");

    if (!existingResult) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found",
      });
    }

    // Get the total marks from the associated exam
    const totalMarks = existingResult.exam.totalMarks;

    // Check if the score is provided in the request body
    const score = req.body.score;

    // Validate the score against total marks
    if (score > totalMarks) {
      return res.status(400).json({
        status: "fail",
        message: "Cannot exceed the marks limit",
      });
    }

    // Update the exam result, ensuring the exam ID is preserved
    const updatedResult = await ExamResult.findByIdAndUpdate(
      resultId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedResult) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedResult,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate a specific exam result by ID
const deactivateResult = async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await ExamResult.findByIdAndUpdate(
      resultId,
      { active: false },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Result deactivated",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// Deactivate multiple exam results
const deactivateManyResults = async (req, res) => {
  try {
    const resultIds = req.body.resultIds; // Expecting an array of IDs

    if (!Array.isArray(resultIds)) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of result IDs",
      });
    }

    // Create an array of promises to deactivate each result
    const deactivatePromises = resultIds.map((id) => {
      return ExamResult.findByIdAndUpdate(id, { active: false }, { new: true });
    });

    // Execute all promises in parallel
    const results = await Promise.all(deactivatePromises);

    res.status(200).json({
      status: "success",
      message: `${results.length} results deactivated`,
      data: results,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
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
  allResults,
  aResult,
  addResult,
  updateResult,
  deactivateResult,
  deactivateManyResults,
  countData,
};
