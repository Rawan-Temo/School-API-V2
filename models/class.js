const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // e.g., "Room 101"
  yearLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  }, // 1-12
  active: {
    type: Boolean,
    default: true,
  },
});

classSchema.index(
  { yearLevel: 1, name: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);
const Class = mongoose.model("Class", classSchema);

module.exports = Class;
