const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, // e.g., "Room 101"

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

classSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);
const Class = mongoose.model("Class", classSchema);

module.exports = Class;
