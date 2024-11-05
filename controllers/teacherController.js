const Teacher = require("../models/teacher");
const apiFeatures = require("../utils/apiFeatures");
const Timetable = require("../models/timeTable");
const User = require("../models/user");

// Get all teachers with optional filtering, sorting, and pagination
const getAllTeachers = async (req, res) => {
  try {
    const features = new apiFeatures(
      Teacher.find().populate("classes subjects"),
      req.query
    )
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
    const countQuery = Teacher.countDocuments(parsedQuery);

    // Fetch teachers and the count in one go
    const [teachers, numberOfActiveTeachers] = await Promise.all([
      features.query,
      countQuery.exec(),
    ]);

    res.status(200).json({
      status: "success",
      numberOfActiveTeachers,
      teachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const getAllTeachersWithDetails = async (req, res) => {
  try {
    // Initialize apiFeatures with the Teacher model query
    const features = new apiFeatures(
      Teacher.find().populate("subjects").populate("classes"), // Populate subjects and classes
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // Fetch teachers and the count in one go
    const [teachers, numberOfActiveTeachers] = await Promise.all([
      features.query,
      Teacher.countDocuments({ active: true }), // counts all documents in collection
    ]);

    res.status(200).json({
      status: "success",
      results: teachers.length,
      numberOfActiveTeachers,
      data: teachers, // Return the populated teachers directly
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Add a new teacher
const addTeacher = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Teacher created successfully",
      teacher: newTeacher,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get a specific teacher by ID
const getATeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId).populate({
      path: "classes subjects",
      select: "name _id", // Include only 'name' and '_id' fields
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ status: "fail", message: "Teacher not found" });
    }

    res.status(200).json({
      status: "success",
      teacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// Update a specific teacher by ID
const updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    const existingTeacher = await Teacher.findById(teacherId);
    if (!existingTeacher) {
      return res
        .status(404)
        .json({ status: "fail", message: "Teacher not found" });
    }

    // Using destructuring to extract add/remove subjects and classes
    const {
      addSubjects,
      removeSubjects,
      addClasses,
      removeClasses,
      ...otherUpdates
    } = req.body;

    // Update other fields directly
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      otherUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    // Update subjects and classes
    if (addSubjects) {
      updatedTeacher.subjects.push(...addSubjects);
    }
    if (removeSubjects) {
      updatedTeacher.subjects = updatedTeacher.subjects.filter(
        (sub) => !removeSubjects.includes(sub.toString())
      );
    }
    if (addClasses) {
      updatedTeacher.classes.push(...addClasses);
    }
    if (removeClasses) {
      updatedTeacher.classes = updatedTeacher.classes.filter(
        (cls) => !removeClasses.includes(cls.toString())
      );
    }

    // Save the updated teacher
    await updatedTeacher.save();

    res.status(200).json({
      status: "success",
      data: {
        teacher: updatedTeacher,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Deactivate a specific teacher by ID
const deactivateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacherUser = await User.findOne({ profileId: teacherId });
    if (teacherUser) {
      await User.findByIdAndDelete(teacherUser._id);
    }
    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ status: "fail", message: "Teacher not found" });
    }
    if (!teacher.active) {
      // Return a success message
      res.status(200).json({
        status: "success",
        message: "Teacher allready deactivated ",
        data: null, // No content for successful deactivation
      });
    } else {
      // Create a full teacher name string
      const teacherName = `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`;

      // Update all timetable entries that reference this teacher ID
      await Timetable.updateMany(
        { teacher: teacherId }, // Find all timetables with this teacher's ID
        { $set: { teacher: teacherName } } // Update to set teacher field to the full name
      );

      // Mark the teacher as inactive
      teacher.active = false;
      await teacher.save(); // Save the changes and await the result

      // Return a success message
      res.status(200).json({
        status: "success",
        message: "Teacher deactivated successfully",
        data: null, // No content for successful deactivation
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// // Delete a specific teacher by ID
// const deleteTeacherFinally = async (req, res) => {
//   try {
//     const teacherId = req.params.id;
//     const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

//     if (!deletedTeacher) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Teacher not found" });
//     }

//     res.status(204).json({
//       status: "success",
//       message: "Teacher deleted finally",
//       data: null, // No content for successful deletion
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };
const deActivateManyTeachers = async (req, res) => {
  try {
    const teacherIds = req.body.teacherIds;

    // Validate input
    if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of teacher IDs.",
      });
    }

    // Step 1: Soft delete the teachers by updating the 'active' status
    const result = await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $set: { active: false } } // Set active to false for soft deletion
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No teachers found or already deactivated.",
      });
    }
    // Step 2: Delete corresponding user accounts for each teacher
    for (const teacherId of teacherIds) {
      const teacherUser = await User.findOne({ profileId: teacherId });
      if (teacherUser) {
        await User.findByIdAndDelete(teacherUser._id);
      }
    }
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      message: "Teachers deactivated successfully.",
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await Teacher.countDocuments({ active: true });
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfDocuments,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const countGender = async (req, res) => {
  try {
    const counts = await Teacher.aggregate([
      {
        $match: { active: true }, // Filter only active students
      },
      {
        $group: {
          _id: "$gender", // Group by the gender field
          count: { $sum: 1 }, // Count the number of documents for each gender
        },
      },
    ]);

    // Extract counts from the aggregation result
    const numberOfMaleTeachers =
      counts.find((c) => c._id === "Male")?.count || 0;
    const numberOfFemaleTeachers =
      counts.find((c) => c._id === "Female")?.count || 0;
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfMaleTeachers,
      numberOfFemaleTeachers,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const search = async (req, res) => {
  try {
    // Extract search parameters
    const searchText = req.params.id || "";
    const regex = new RegExp(searchText.split("").join(".*"), "i");

    // Define the base query for direct matching
    const baseQuery = {
      $or: [{ firstName: regex }, { middleName: regex }, { lastName: regex }],
    };

    // Count total documents matching the base query

    let features = new apiFeatures(
      Teacher.find(baseQuery).populate("subjects").populate("classes"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query to get paginated results
    // Fetch teachers and the count in one go
    let [results, totalResults] = await Promise.all([
      features.query,
      Teacher.countDocuments(baseQuery), // counts all documents in collection
    ]);

    // If no results found with direct match, attempt fuzzy search
    if (results.length < 1) {
      features = new apiFeatures(
        Teacher.fuzzySearch(searchText)
          .populate("subjects")
          .populate("classes"), // Adjust this to match your fuzzy search implementation
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      [results, totalResults] = await Promise.all([
        features.query,
        Teacher.fuzzySearch(searchText).countDocuments(), // counts all documents in collection
      ]);
    }

    // Return the results with total count for pagination
    res.status(200).json({
      status: "success",
      totalResults,
      results: results.length,
      data: results,
    });
  } catch (error) {
    // Log the error for server debugging
    console.error("Error performing search:", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
module.exports = {
  getAllTeachers,
  addTeacher,
  getATeacher,
  updateTeacher,
  deactivateTeacher,
  getAllTeachersWithDetails,
  deActivateManyTeachers,
  countData,
  countGender,
  search,
};
