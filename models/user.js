const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin"], // Roles can be student, teacher, or admin
      required: true,
    },
    // Reference to either Student, Teacher, or Admin model based on the role
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role", // Dynamically references either Student, Teacher, or Admin based on the role
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update the updatedAt field on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
