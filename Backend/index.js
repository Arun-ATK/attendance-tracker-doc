const express = require("express");
const knex = require("knex");
const cors = require("cors");
const bcrypt = require("bcrypt");
const expressFileUpload = require("express-fileupload");
const validator = require("email-validator");
const register = require("./controllers/register");
const login = require("./controllers/login");
const newClass = require("./controllers/newClass");
const { handleStudentFileUpload } = require("./controllers/studentFileUpload");
const {
  handleAttendanceFileUpload,
} = require("./controllers/attendanceFileUpload");
const { getLectureList } = require("./controllers/getLectureList");
const { getSummary } = require("./controllers/getSummary");
const { updateThreshold } = require("./controllers/updateThreshold");
const { lectureAttendance } = require("./controllers/lectureAttendance");

const PORT = process.env.PORT || 4000;
const SALT_ROUNDS = 10;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressFileUpload());
app.use(cors());

// Heroku connection
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });

// Localhost connection
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "admin",
    database: "postgres",
  },
});

app.post(
  "/register",
  register.handleRegister(db, bcrypt, SALT_ROUNDS, validator)
);

app.post("/login", login.handleLogin(db, bcrypt));

app.post("/createNewClass", newClass.create(db));

app.post("/upload/studentFile", handleStudentFileUpload(db));

app.post("/upload/attendanceFile", handleAttendanceFileUpload(db));

app.post("/getLectureList", getLectureList(db));

app.post("/getSummary", getSummary(db));

app.post("/updateThreshold", updateThreshold(db));

app.post("/lectureAttendance", lectureAttendance(db));

// If users request route that doesn't exist
app.use((req, res, next) => {
  const error = {
    message: "Not Found",
  };

  return res.status(404).json(error);
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
