const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
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
    // Construct a separate query object for counting with filters applied
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "month"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Parse the query string to convert query parameters like gte/gt/lte/lt into MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);

    // Apply the parsed filter to count active documents
    const countQuery = Subject.countDocuments(parsedQuery);
    // Fetch teachers and the count in one go
    const [subjects, numberOfActiveSubjects] = await Promise.all([
      features.query,
      countQuery.exec(), // counts all documents in collection
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
const search = async (req, res) => {
  // Extract search parameters
  const searchText = req.params.id || "";

  try {
    // Create a regex pattern to allow partial matches
    const regex = new RegExp(searchText.split("").join(".*"), "i");

    // Initialize apiFeatures for direct match query
    let features = new apiFeatures(
      Subject.find({
        $or: [{ name: regex }, { description: regex }],
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query and count matching documents simultaneously
    let [results, totalResults] = await Promise.all([
      features.query,
      Subject.countDocuments({
        $or: [{ name: regex }, { description: regex }],
      }),
    ]);

    // If no direct matches found, switch to fuzzy search
    if (results.length < 1) {
      // New apiFeatures instance for fuzzy search
      features = new apiFeatures(
        Subject.fuzzySearch(searchText), // Adjust based on fuzzy search implementation
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      // Execute fuzzy search query and count documents
      [results, totalResults] = await Promise.all([
        features.query,
        Subject.fuzzySearch(searchText).countDocuments(),
      ]);
    }

    // Return the response with total count and results
    res.status(200).json({
      status: "success",
      totalResults,
      results: results.length,
      data: results,
    });
  } catch (error) {
    // Log error and send error response
    console.error("Error performing search:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
const deactivateManySubject = async (req, res) => {
  try {
    const subjectIds = req.body.Ids;

    // Validate input
    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of subject IDs.",
      });
    }

    // Step 1: Soft delete the teachers by updating the 'active' status
    const result = await Subject.updateMany(
      { _id: { $in: subjectIds } },
      { $set: { active: false } } // Set active to false for soft deletion
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No subjects found or already deactivated.",
      });
    }

    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      message: "subjects deactivated successfully.",
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
module.exports = {
  AllSubjects,
  addSubject,
  getASubject,
  updateSubject,
  deactivateSubject,
  countData,
  search,
  deactivateManySubject,
};
