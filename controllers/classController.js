const ClassModel = require("../models/class");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const apiFeatures = require("../utils/apiFeatures");
const Attendance = require("../models/attendance.js");
const Exam = require("../models/exam.js");
const Timetable = require("../models/timeTable");
const allClasses = async (req, res) => {
  try {
    const features = new apiFeatures(ClassModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // Fetch teachers and the count in one go
    const [classes, numberOfActiveClasses] = await Promise.all([
      features.query,
      ClassModel.countDocuments({ active: true }), // counts all documents in collection
    ]);
    res.status(200).json({
      status: "success",
      numberOfActiveClasses,
      data: classes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
const addClass = async (req, res) => {
  try {
    const newClass = await ClassModel.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const aClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const singleClass = await ClassModel.findById(classId);
    // Find the existing project
    if (!singleClass) {
      res.status(404).json({ message: "no class found " });
    }

    res.status(200).json({
      status: "success",
      data: singleClass,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
const updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const updatedClass = await ClassModel.findByIdAndUpdate(classId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update
    });
    if (!updatedClass) {
      res.status(404).json({ message: "no class found " });
    }
    res.status(200).json({
      status: "success",
      data: updatedClass,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ status: "fail", message: error.message });
  }
};
const deactivateClass = async (req, res) => {
  try {
    const classId = req.params.id;

    // Check if the class exists
    const existingClass = await ClassModel.findById(classId);
    if (!existingClass) {
      return res
        .status(404)
        .json({ status: "fail", message: "Class not found" });
    }
    // Mark the subject as inactive instead of deleting it
    if (!existingClass.active) {
      res.status(200).json({
        status: "success",
        message: "Subject allready deactivated ",
        data: null, // No content for successful deletion
      });
    } else {
      // Perform updates concurrently
      const updatePromises = [
        // // Nullify the class reference for all students associated with this class
        // Student.updateMany({ class: classId }, { $set: { class: null } }),
        // // Nullify the class reference for all attendance records associated with this class
        // Attendance.updateMany(
        //   { classId: classId },
        //   { $set: { classId: null } }
        // ),
        // // Nullify the class reference for all timetables associated with this class
        // Timetable.updateMany({ classId: classId }, { $set: { classId: null } }),
        // // Nullify the class reference for all exams associated with this class
        // Exam.updateMany({ classId: classId }, { $set: { classId: null } }),
        // Remove the class from all teachers' class lists
        Teacher.updateMany(
          { classes: classId },
          { $pull: { classes: classId } }
        ),
      ];

      // Execute all update promises
      await Promise.all(updatePromises);

      // Soft delete the class by setting 'active' to false
      existingClass.active = false;
      await existingClass.save();

      // Return a success message with no content
      res.status(200).json({
        status: "success",
        message: "Class deactivated successfully",
        data: null, // No content for successful deactivation
      });
    }
  } catch (error) {
    // Return an error response
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// const deleteClassFinal = async (req, res) => {
//   try {
//     const classId = req.params.id;
//     // Check if the class exists
//     const existingClass = await ClassModel.findById(classId);
//     if (!existingClass) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Class not found" });
//     }
//     const deletedClass = await ClassModel.findByIdAndDelete(classId);
//     // Return a success message with no content
//     res.status(200).json({
//       status: "success",
//       message: "Class deleted successfully",
//       data: null, // No content for successful deactivation
//     });
//   } catch (error) {
//     // Return an error response
//     console.error(error); // Log the error for debugging purposes
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await ClassModel.countDocuments({ active: true });
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
  allClasses,
  addClass,
  aClass,
  updateClass,
  deactivateClass,
  countData,
};
