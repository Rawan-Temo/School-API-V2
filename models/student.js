const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true, // Fixed the typo from requried to required
  },
  lastName: {
    type: String,
    required: true,
  },
  yearLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year levels from 1 to 12
  },
  yearRepeated: [
    {
      yearLevel: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Possible year levels
        unique: true, // Ensure only one entry per year level
      },
      yearCount: {
        type: Number,
        default: 1, // Default to 1 if not specified
        min: 1, // Ensure at least 1 repetition
      },
    },
  ],
  dateOfBirth: {
    type: Date,
    required: true,
  },
  contactInfo: {
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  gender: {
    type: String,
    enum: ["Male", "Female"], // Options for gender
    required: true,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  enrollmentDate: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  guardianContact: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    relationship: {
      type: String,
    },
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Reference to the Class model
  },
  active: {
    type: Boolean,
    default: true,
  },
});
// Pre-save hook to initialize yearRepeated based on yearLevel
studentSchema.pre("save", function (next) {
  if (this.yearLevel) {
    // Ensure yearRepeated exists
    if (!this.yearRepeated) {
      this.yearRepeated = [];
    }

    // Check if yearLevel already exists in yearRepeated
    const existingYear = this.yearRepeated.find(
      (year) => year.yearLevel === this.yearLevel
    );

    if (!existingYear) {
      // Add the new yearLevel if it's not already present
      this.yearRepeated.push({
        yearLevel: this.yearLevel,
        yearCount: 1, // Start with a count of 1 for the first year
      });
    }
  }

  // Ensure uniqueness in yearRepeated before saving
  const seenLevels = new Set();
  for (const entry of this.yearRepeated) {
    if (seenLevels.has(entry.yearLevel)) {
      next();
    }
    seenLevels.add(entry.yearLevel);
  }

  next(); // Proceed to save
});

// Optional: Add compound index for common query patterns
studentSchema.index({ active: 1, yearLevel: 1, classId: 1 }); // Example of a compound index on yearLevel and class
studentSchema.index({ firstName: "text", lastName: "text" });
studentSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "middleName", "lastName"],
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
