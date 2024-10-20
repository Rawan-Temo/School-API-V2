const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
    yearLevel: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year levels from 1 to 12
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
subjectSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
/*{
  "_id": "671350efc9ab782cb7638ad4",
  "name": "Mathematics",
  "code": "MATH101",
  "description": "This subject covers basic algebra, geometry, and calculus.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:25:51.901Z",
  "updatedAt": "2024-10-19T06:25:51.901Z"
},
{
  "_id": "671350f6c9ab782cb7638ad6",
  "name": "Physics",
  "code": "PHYS101",
  "description": "Introduction to classical mechanics, thermodynamics, and waves.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:25:58.601Z",
  "updatedAt": "2024-10-19T06:25:58.601Z"
},
{
  "_id": "671350fbc9ab782cb7638ad8",
  "name": "Chemistry",
  "code": "CHEM101",
  "description": "Study of matter, its properties, and chemical reactions.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:03.572Z",
  "updatedAt": "2024-10-19T06:26:03.572Z"
},
{
  "_id": "67135103c9ab782cb7638ada",
  "name": "Biology",
  "code": "BIO101",
  "description": "Fundamentals of biology, including cellular biology and genetics.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:11.092Z",
  "updatedAt": "2024-10-19T06:26:11.092Z"
},
{
  "_id": "67135108c9ab782cb7638adc",
  "name": "English Literature",
  "code": "ENG101",
  "description": "Exploration of classic and contemporary literary works.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:16.601Z",
  "updatedAt": "2024-10-19T06:26:16.601Z"
},
{
  "_id": "6713510ec9ab782cb7638ade",
  "name": "History",
  "code": "HIST101",
  "description": "Overview of world history from ancient to modern times.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:22.937Z",
  "updatedAt": "2024-10-19T06:26:22.937Z"
},
{
  "_id": "67135115c9ab782cb7638ae0",
  "name": "Geography",
  "code": "GEO101",
  "description": "Study of Earth's landscapes, environments, and the relationships between people and their environments.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:29.049Z",
  "updatedAt": "2024-10-19T06:26:29.049Z"
},
{
  "_id": "6713511ac9ab782cb7638ae2",
  "name": "Computer Science",
  "code": "CS101",
  "description": "Introduction to computer programming and software development.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:34.289Z",
  "updatedAt": "2024-10-19T06:26:34.289Z"
},
{
  "_id": "671351237b15f745ede72953",
  "name": "Physical Education",
  "code": "PE101",
  "description": "Focus on fitness, health, and sportsmanship.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T06:26:43.468Z",
  "updatedAt": "2024-10-19T06:26:43.468Z"
},
{
  "_id": "67137af7de7f92b7b09d6499",
  "name": "Physical Education",
  "code": "PE102",
  "description": "Focus on fitness, health, and sportsmanship.",
  "yearLevel": 1,
  "active": true,
  "createdAt": "2024-10-19T09:25:11.483Z",
  "updatedAt": "2024-10-19T09:25:11.483Z"
}*/
