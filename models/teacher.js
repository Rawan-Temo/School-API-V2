const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  yearLevel: [
    {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year levels from 1 to 12
    },
  ],
  email: {
    type: String,
    required: true,
  }, // Unique email for each teacher
  gender: {
    type: String,
    enum: ["Male", "Female"], // Options for gender
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});
// Pre-save hook to remove duplicates from subjects and classes
teacherSchema.pre("save", function (next) {
  // Remove duplicates using Set
  this.subjects = [
    ...new Set(this.subjects.map((subject) => subject.toString())),
  ];
  this.classes = [
    ...new Set(this.classes.map((classItem) => classItem.toString())),
  ];

  // Proceed to save the document
  next();
});
// Create the Teacher model
teacherSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);
teacherSchema.index({ firstName: "text", lastName: "text" });
teacherSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["firstName", "middleName", "lastName"],
});
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
