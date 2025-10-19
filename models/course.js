const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    teacherId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
courseSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);
courseSchema.index({ name: "text", description: "text" });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
