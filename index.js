require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet"); // For security enhancements
const app = express();
const port = process.env.PORT || 8000;

// Import routers
const teacherRouter = require("./routes/teacherRouter.js");
const subjectRouter = require("./routes/subjectRouter.js");
const classRouter = require("./routes/classRouter.js");
const studentRouter = require("./routes/studentRouter.js");
const attendanceRouter = require("./routes/attendanceRouter.js");
const examRouter = require("./routes/examRouter.js");
const examResultsRouter = require("./routes/examResultRouter.js");
const timeTableRouter = require("./routes/timeTableRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const userRouter = require("./routes/userRouter.js");
// Import and initialize database connection
const connection = require("./db.js");
connection();

// Middleware
app.use(express.json()); // Built-in JSON parser
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet()); // Security middleware

// API Routes
// 404 Handler
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/classes", classRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/attendances", attendanceRouter);
app.use("/api/exams", examRouter);
app.use("/api/exam-results", examResultsRouter);
app.use("/api/time-table", timeTableRouter);
app.use("/api/admins", adminRouter);
app.use("/api/users", userRouter);
app.use((req, res, next) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({ status: "error", message: "Something went wrong" });
});

// Start the server
app.listen(port, () => {
  console.log("Listening on port:", port);
});
