const Attendance = require("../models/attendance");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Timetable = require("../models/timeTable");
const apiFeatures = require("../utils/apiFeatures");
// Get all subjects
const AllSubjects = async (req, res) => {
  try {
    // Fetch all subjects from the database
    const features = new apiFeatures(Subject.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Fetch teachers and the count in one go
    const [subjects, numberOfActiveSubjects] = await Promise.all([
      features.query,
      Subject.countDocuments({ active: true }), // counts all documents in collection
    ]);
    res.status(200).json({
      status: "success",
      results: subjects.length,
      numberOfActiveSubjects,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Add a new subject
const addSubject = async (req, res) => {
  try {
    // Create a new subject using the request body
    const newSubject = await Subject.create(req.body);

    res.status(201).json({
      status: "success",
      data: newSubject,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get a specific subject by ID
const getASubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Find the subject by its ID
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res
        .status(404)
        .json({ status: "fail", message: "Subject not found" });
    }

    res.status(200).json({
      status: "success",
      data: subject,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Update a specific subject by ID
const updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Find the subject by ID and update it with the request body
    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update
      }
    );

    if (!updatedSubject) {
      return res
        .status(404)
        .json({ status: "fail", message: "Subject not found" });
    }

    res.status(200).json({
      status: "success",
      data: updatedSubject,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Delete a specific subject by ID
const deactivateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ status: "fail", message: "Subject not found" });
    }
    // Mark the subject as inactive instead of deleting it
    if (!subject.active) {
      res.status(200).json({
        status: "success",
        message: "Subject allready deactivated ",
        data: null, // No content for successful deletion
      });
    } else {
      const updatePromises = [
        // Remove the subject reference from all teachers associated with this subject
        Teacher.updateMany(
          { subjects: subjectId },
          { $pull: { subjects: subjectId } } // Use $pull to remove the subject ID from the array
        ),
      ];

      // Execute all update promises concurrently
      await Promise.all(updatePromises);

      subject.active = false;
      await subject.save();

      res.status(200).json({
        status: "success",
        message: "Subject deactivated successfully",
        data: null, // No content for successful deletion
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// const deleteFinall = async (req, res) => {
//   try {
//     const teacherId = req.params.id;
//     // Check if the teacher exists
//     const teacher = await Teacher.findById(teacherId);
//     if (!teacher) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Teacher not found" });
//     }
//     const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
//     res.status(200).json({
//       status: "success",
//       message: "Subject deleted successfully",
//       data: null, // No content for successful deletion
//     });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await Subject.countDocuments({ active: true });
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
  AllSubjects,
  addSubject,
  getASubject,
  updateSubject,
  deactivateSubject,
  countData,
};
