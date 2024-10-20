const mongoose = require("mongoose");

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
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
/*
[
        {
            "_id": "6710c71b7b7fa154eb87207c",
            "firstName": "John",
            "middleName": "A.",
            "lastName": "Doe",
            "yearLevel": [
                1,
                2
            ],
            "email": "john.doe@example.com",
            "gender": "Male",
            "phoneNumber": "123-456-7890",
            "subjects": [
                "671350efc9ab782cb7638ad4"
            ],
            "classes": [
                "671383ab6ec6b9d374974c83"
            ],
            "active": false
        },
        {
            "_id": "6710c73b7b7fa154eb87207e",
            "firstName": "Jane",
            "middleName": "B.",
            "lastName": "Smith",
            "yearLevel": [
                3,
                4
            ],
            "email": "jane.smith@example.com",
            "gender": "Female",
            "phoneNumber": "234-567-8901",
            "subjects": [
                "671350f6c9ab782cb7638ad6"
            ],
            "classes": [
                "671383b26ec6b9d374974c87"
            ],
            "active": false
        },
        {
            "_id": "6710c7527b7fa154eb872080",
            "firstName": "Emily",
            "middleName": "C.",
            "lastName": "Johnson",
            "yearLevel": [
                5,
                6
            ],
            "email": "emily.johnson@example.com",
            "gender": "Female",
            "phoneNumber": "345-678-9012",
            "subjects": [
                "671350fbc9ab782cb7638ad8"
            ],
            "classes": [
                "671383b96ec6b9d374974c8c"
            ],
            "active": false
        },
        {
            "_id": "6710c7657b7fa154eb872082",
            "firstName": "Michael",
            "middleName": "D.",
            "lastName": "Williams",
            "yearLevel": [
                7,
                8
            ],
            "email": "michael.williams@example.com",
            "gender": "Male",
            "phoneNumber": "456-789-0123",
            "subjects": [
                "67135103c9ab782cb7638ada",
                "671350fbc9ab782cb7638ad8"
            ],
            "classes": [
                "671383c16ec6b9d374974c91"
            ],
            "active": true
        },
        {
            "_id": "6710c7727b7fa154eb872084",
            "firstName": "Sarah",
            "middleName": "E.",
            "lastName": "Brown",
            "yearLevel": [
                9,
                10
            ],
            "email": "sarah.brown@example.com",
            "gender": "Female",
            "phoneNumber": "567-890-1234",
            "subjects": [
                "6713510ec9ab782cb7638ade",
                "67135108c9ab782cb7638adc"
            ],
            "classes": [
                "671383c46ec6b9d374974c93"
            ],
            "active": true
        },
        {
            "_id": "6710c7857b7fa154eb872086",
            "firstName": "David",
            "middleName": "F.",
            "lastName": "Jones",
            "yearLevel": [
                11,
                12
            ],
            "email": "david.jones@example.com",
            "gender": "Male",
            "phoneNumber": "678-901-2345",
            "subjects": [
                "67135115c9ab782cb7638ae0",
                "6713510ec9ab782cb7638ade"
            ],
            "classes": [
                "671383c66ec6b9d374974c95"
            ],
            "active": true
        },
        {
            "_id": "6710c7997b7fa154eb872088",
            "firstName": "Sophia",
            "middleName": "G.",
            "lastName": "Miller",
            "yearLevel": [
                1
            ],
            "email": "sophia.miller@example.com",
            "gender": "Female",
            "phoneNumber": "789-012-3456",
            "subjects": [
                "6713511ac9ab782cb7638ae2",
                "671351237b15f745ede72953"
            ],
            "classes": [
                "671383c66ec6b9d374974c95"
            ],
            "active": true
        },
        {
            "_id": "6710c7a87b7fa154eb87208a",
            "firstName": "James",
            "middleName": "H.",
            "lastName": "Davis",
            "yearLevel": [
                2
            ],
            "email": "james.davis@example.com",
            "gender": "Male",
            "phoneNumber": "890-123-4567",
            "subjects": [
                "6713511ac9ab782cb7638ae2"
            ],
            "classes": [
                "671383c66ec6b9d374974c95"
            ],
            "active": true
        },
        {
            "_id": "6710c7b77b7fa154eb87208c",
            "firstName": "Isabella",
            "middleName": "I.",
            "lastName": "Garcia",
            "yearLevel": [
                3,
                4
            ],
            "email": "isabella.garcia@example.com",
            "gender": "Female",
            "phoneNumber": "901-234-5678",
            "subjects": [
                "671351237b15f745ede72953"
            ],
            "classes": [
                "671383c66ec6b9d374974c95",
                "671383c16ec6b9d374974c91"
            ],
            "active": true
        },
        {
            "_id": "6710c7c57b7fa154eb87208e",
            "firstName": "Ethan",
            "middleName": "J.",
            "lastName": "Martinez",
            "yearLevel": [
                5
            ],
            "email": "ethan.martinez@example.com",
            "gender": "Male",
            "phoneNumber": "012-345-6789",
            "subjects": [
                "671351237b15f745ede72953"
            ],
            "classes": [
                "671383c16ec6b9d374974c91",
                "671383b96ec6b9d374974c8c"
            ],
            "active": true
        }
    ]
*/
