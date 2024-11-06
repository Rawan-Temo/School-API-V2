const User = require("../models/user");
const apiFeatures = require("../utils/apiFeatures"); // For filtering, sorting, etc.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Admin = require("../models/admin");
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const features = new apiFeatures(User.find(), req.query)
      .sort()
      .filter()
      .limitFields()
      .paginate();

    const users = await features.query;

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get a single user by ID
const getAUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, role, profileId } = req.body;

    const existingUserOrProfile = await User.findOne({
      $or: [{ username }, { profileId }],
    });

    if (existingUserOrProfile) {
      let message;
      if (existingUserOrProfile.username === username) {
        message = "Username already exists.";
      } else {
        message = "Profile ID already exists.";
      }
      return res.status(400).json({ message });
    }
    // Check if the profile exists in the corresponding model based on the role
    let profileExists = false;

    if (role === "teacher") {
      profileExists = await Teacher.findOne({ _id: profileId, active: true });
      console.log();
    } else if (role === "student") {
      profileExists = await Student.findOne({ _id: profileId, active: true });
    } else if (role === "admin") {
      profileExists = await Admin.findOne({ _id: profileId, active: true });
    }

    // If the profile doesn't exist or isn't active, return an error
    if (!profileExists) {
      return res
        .status(400)
        .json({ message: "Profile does not exist or is not active" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with role and profileId
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user", // Default to 'user' role if no role is provided
      profileId,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the created user (excluding the password)
    const userResponse = {
      username: newUser.username,
      role: newUser.role,
      profileId: newUser.profileId,
    };

    res.status(201).json({ status: "success", data: userResponse });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: "An error occurred while creating the user.",
    });
  }
};

// Delete a user by ID
const deleteAUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user by username
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
      expiresIn: "2d",
    });
    // Respond with token
    res.status(200).json({ token, userRole: existingUser.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const countData = async (req, res) => {
  try {
    const numberOfDocuments = await User.countDocuments({ active: true });
    // Step 2: Return success response
    res.status(200).json({
      status: "success",
      numberOfDocuments,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
const userProfile = async (req, res) => {
  try {
    // Populate the profileId field
    const user = await req.user.populate("profileId").execPopulate();

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  getAUser,
  createUser,
  deleteAUser,
  login,
  countData,
  userProfile,
};
