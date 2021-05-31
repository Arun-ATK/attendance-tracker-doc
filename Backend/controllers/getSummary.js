const { getClassId } = require("../helpers/getClassId");
const { numberOfLectures } = require("../helpers/numberOfLectures");
const { numberOfStudents } = require("../helpers/numberOfStudents");

const getSummary = (db) => async (req, res) => {
  const { className, user } = req.body;

  try {
    const class_id = await getClassId(db, className, user.faculty_id);
    const totalStudents = await numberOfStudents(db, class_id);
    const totalLectures = await numberOfLectures(db, class_id);

    console.log(`Number of Students: ${totalStudents}`);
    console.log(`Number of Lectures: ${totalLectures}`);

    if (totalLectures === 0) {
      return res.status(404).json({ message: "No lectures for this class!" });
    }

    const summary = await db
      .select(
        "rollno",
        "name",
        "email",
        db.raw(
          `format('%s/${totalLectures}', COUNT(CASE WHEN ispresent=true THEN 1 END)) AS attendance`
        )
      )
      .from("student_attendance")
      .where({
        class_id,
      })
      .groupBy("rollno", "name", "email")
      .orderBy("rollno");

    console.table(summary);

    return res.status(200).json({
      title: `Attendance Summary for ${className}`,
      subTitle: `Total Students: ${totalStudents}`,
      table: summary,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: `${err.detail || err.message || err}` });
  }
};

module.exports = { getSummary };
