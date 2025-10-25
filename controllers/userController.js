const User = require("../models/user");
const createController = require("../utils/createControllers"); // For filtering, sorting, etc.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Admin = require("../models/admin");
// Get all users
const userController = createController(
  User,
  "user",
  ["username"],
  ["profileId"]
);

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

    if (role === "Teacher") {
      profileExists = await Teacher.findOne({ _id: profileId, active: true });
    } else if (role === "Student") {
      profileExists = await Student.findOne({ _id: profileId, active: true });
    } else if (role === "Admin") {
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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Access token (short-lived)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "15m", // short lifespan
      }
    );

    // Refresh token (long-lived)
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, userRole: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
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

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
module.exports = {
  ...userController,
  createUser,
  refreshToken,
  login,
  logout,
  countData,
  userProfile,
};
