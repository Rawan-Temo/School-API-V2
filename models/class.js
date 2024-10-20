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
/* {
            "_id": "6710c573e3104cb80dfa3297",
            "name": "Room 101",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c57de3104cb80dfa3299",
            "name": "Room 102",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c584e3104cb80dfa329b",
            "name": "Room 103",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c58ae3104cb80dfa329d",
            "name": "Room 104",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c590e3104cb80dfa329f",
            "name": "Room 105",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c595e3104cb80dfa32a1",
            "name": "Room 106",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c59ce3104cb80dfa32a3",
            "name": "Room 107",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c5a0e3104cb80dfa32a5",
            "name": "Room 108",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c5a3e3104cb80dfa32a7",
            "name": "Room 109",
            "yearLevel": 1,
            "active": true
        },
        {
            "_id": "6710c5a7e3104cb80dfa32a9",
            "name": "Room 110",
            "yearLevel": 1,
            "active": true
        }*/
