const { getClassId } = require("../helpers/getClassId");
const { lectureExists } = require("../helpers/lectureExists");

const lectureAttendance = (db) => async (req, res) => {
  const { className, lecture_id, user } = req.body;

  try {
    const class_id = await getClassId(db, className, user.faculty_id);
    const lecExists = await lectureExists(db, lecture_id, class_id);

    if (!lecExists)
      return res.status(404).json({ message: "Lecture doesn't exist" });

    const table = await db
      .select("rollno", "name", "email", "ispresent")
      .from("student_attendance")
      .where({ lecture_id })
      .orderBy("rollno");

    return res.status(201).json({
      title: `Lecture Attendance for ${className}`,
      subTitle: `Lecture ID: ${lecture_id}`,
      table,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: `${err.detail || err.message || err}` });
  }
};

module.exports = { lectureAttendance };
