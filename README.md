const readmeContent = `# School Management System

This project is a comprehensive Node.js-based school management system designed to handle various essential operations within a school setting. The system includes functionality for managing classes, subjects, teachers, students, exams, timetables, and more. It leverages MongoDB as the primary database with Mongoose for schema-based modeling, and it supports advanced search functionality, including fuzzy search to help users find records even with partial input.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [License](#license)

---

## Features

- **User Management**: Register and manage students, teachers, and administrative staff, with distinct schemas for each role.
- **Class and Subject Management**: Organize classes, assign year levels, and manage subjects including unique indices.
- **Exam and Results Management**: Schedule exams, track results, and analyze results by students and subjects.
- **Timetable Management**: Set up timetables with weekly recurrence support, specified by days and time slots.
- **Attendance Tracking**: Record student attendance across classes, subjects, and days.
- **Admin Controls**: Manage the entire system from an admin perspective, controlling access and activity monitoring.
- **Advanced Search Functionality**: Flexible and advanced search, including fuzzy searching, to allow users to search records even with partial names or details.
- **Data Validation and Error Handling**: Ensures data integrity using Mongoose schema validations, unique indices, and detailed error handling.

---

## Project Structure

\`\`\`plaintext
.
├── controllers
│ ├── adminController.js
│ ├── attendanceController.js
│ ├── classController.js
│ ├── examController.js
│ ├── resultController.js
│ ├── studentController.js
│ ├── subjectController.js
│ ├── teacherController.js
│ ├── timeTableController.js
│ └── userController.js
├── models
│ ├── adminModel.js
│ ├── attendanceModel.js
│ ├── classModel.js
│ ├── examModel.js
│ ├── examResultModel.js
│ ├── studentModel.js
│ ├── subjectModel.js
│ ├── teacherModel.js
│ └── timetableModel.js
├── routes
│ ├── adminRoutes.js
│ ├── attendanceRoutes.js
│ ├── classRoutes.js
│ ├── examRoutes.js
│ ├── examResultRoutes.js
│ ├── studentRoutes.js
│ ├── subjectRoutes.js
│ ├── teacherRoutes.js
│ └── timetableRoutes.js
├── utils
│ └── apiFeatures.js
├── middlewares
│ └── authMiddleware.js
├── index.js
└── db.js
\`\`\`

## Installation

To get the School Management System up and running, follow these steps:

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables**:  
    Create a \`.env\` file at the root directory with the following details:
   \`\`\`plaintext
   PORT=8000
   if the Database is on the cloud{
   DB=your_mongoDB_uri
   DB_PASSWORD=your_mongoDB_password
   }
   else you can use the default MongoDB connection string
   ACCESS_TOKEN_SECRET=your_secret_key
   \`\`\`

3. **Run the Application**:
   Start the application with the following command:
   \`\`\`bash
   npm start
   \`\`\`

4. **Access the API**:
   Once the server is running, access the API at:
   \`\`\`
   http://localhost:8000/api
   \`\`\`

---

## API Documentation

This project provides an extensive set of RESTful APIs that can be used to manage various operations within the school management system. Below are brief descriptions of the key APIs:

- **Teachers API**: Endpoints to manage teacher details, subject assignments, and availability.
- **Students API**: Routes for managing student records, enrollment, and attendance tracking.
- **Exams API**: Endpoints to schedule exams, record scores, and analyze results by student and subject.
- **Subjects API**: Define and manage subjects with year-level restrictions.
- **Timetable API**: Configure weekly schedules for classes and assign teachers to specific class times.
- **Attendance API**: Routes for tracking and updating daily attendance by student, class, and subject.
- **Class API**:This API allows you to create, retrieve, update, and delete class records.
- **Time Table API**:The Time Table API enables users to set up and manage timetables for different classes.
- **User API**:The User API handles user authentication and management, supporting techers, students and administrative users.
- **Admin API**: Administrative routes that provide full control of the system.

---

## Technologies Used

- **Node.js**: JavaScript runtime for building the application.
- **Express.js**: Web framework for Node.js to handle HTTP requests.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **dotenv**: Module to load environment variables from a `.env` file.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **bcryptjs**: Library for hashing passwords.
- **jsonwebtoken**: Library for generating and verifying JSON Web Tokens (JWT).

---

## License
