const Exam = require("../models/exam");
const apiFeatures = require("../utils/apiFeatures");
const allExams = async (req, res) => {
  try {
    const features = new apiFeatures(Exam.find(), req.query)
      .sort()
      .filter()
      .limitFields()
      .paginate();
    const [exams, numberOfActiveExams] = await Promise.all([
      features.query.populate("classId subjectId"), // Populate class and subject
      Exam.countDocuments({ active: true }),
    ]);
    res.status(200).json({
      status: "success",
      numberOfActiveExams,
      data: exams,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific exam by ID
const anExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findById(examId).populate({
      path: "classId subjectId",
      select: "name _id", // Include only 'name' and '_id' fields
    });

    if (!exam) {
      return res
        .status(404)
        .json({ status: "fail", message: "Exam not found" });
    }

    res.status(200).json({
      status: "success",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a new exam
const addExam = async (req, res) => {
  try {
    const { date, classId, yearLevel } = req.body;

    // Check if an exam with the same date, classId, and yearLevel already exists
    const existingExam = await Exam.findOne({
      date,
      classId,
      yearLevel,
      active: true,
    });

    if (existingExam) {
      return res.status(400).json({
        status: "fail",
        message:
          "An exam is already scheduled at this date and time for the specified class and year level.",
      });
    }

    const newExam = await Exam.create(req.body);
    res.status(201).json({
      status: "success",
      data: newExam,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update an existing exam
const updateExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const updatedExam = await Exam.findByIdAndUpdate(examId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExam) {
      return res
        .status(404)
        .json({ status: "fail", message: "Exam not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedExam,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Deactivate an exam (soft delete)
const deactivateExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res
        .status(404)
        .json({ status: "fail", message: "Exam not found" });
    }
    if (!exam.active) {
      res.status(200).json({
        status: "success",
        message: "Exam allready deactivated ",
      });
    } else {
      // Assuming the Exam model has an 'active' field for soft deletion
      exam.active = false; // Soft delete
      await exam.save();

      res.status(200).json({
        status: "success",
        message: "Exam deactivated successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Deactivate multiple exams (soft delete)
const deactivateManyExams = async (req, res) => {
  try {
    const examIds = req.body.ids; // Expecting an array of exam IDs

    // Check if examIds is provided and is an array
    if (!Array.isArray(examIds) || examIds.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid exam IDs provided." });
    }

    // Perform the updates to set active to false for each exam ID
    const updatePromises = examIds.map((id) =>
      Exam.findByIdAndUpdate(id, { active: false }, { new: true })
    );

    const updatedExams = await Promise.all(updatePromises);

    // Filter out null values (if any exams were not found)
    const successfulDeactivations = updatedExams.filter(
      (exam) => exam !== null
    );

    // If no exams were successfully deactivated, return a message
    if (successfulDeactivations.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No exams found for the provided IDs.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Exams deactivated successfully.",
      data: successfulDeactivations,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await Exam.countDocuments({ active: true });
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
  allExams,
  anExam,
  addExam,
  updateExam,
  deactivateExam,
  deactivateManyExams,
  countData,
};
