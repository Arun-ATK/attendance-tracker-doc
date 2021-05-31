const { getClassId } = require("../helpers/getClassId");
const { getObjectsFromCSV } = require("../helpers/getObjectsFromCSV");
const { numberOfStudents } = require("../helpers/numberOfStudents");

const handleStudentFileUpload = (db) => async (req, res) => {
  if (!req.files) return res.status(404).json({ message: "File Not Found!" });
  if (!req.files.studentFile.name.endsWith(".csv")) {
    return res.status(400).json({ message: "Only CSV files are accepted!" });
  }

  const { className } = req.body;
  const user = JSON.parse(req.body.user);

  try {
    const class_id = await getClassId(db, className, user.faculty_id);
    console.log(`class_id: ${class_id}`);

    const students = await getObjectsFromCSV(req.files.studentFile.data);

    await db.transaction(async (trx) => {
      for (const student of students) {
        const { student_id } = (
          await trx("student")
            .insert(student)
            .onConflict("email")
            .merge()
            .returning(["student_id"])
        )[0];

        await trx("belongsto")
          .insert({ student_id, class_id })
          .onConflict(["student_id", "class_id"])
          .ignore();
      }
    });

    const insertedStudents = await db
      .select("rollno", "name", "email", "year")
      .from("class_students")
      .where({ class_id })
      .orderBy("rollno");

    const totalStudents = await numberOfStudents(db, class_id);

    return res.status(201).json({
      title: `Students of ${className}`,
      subTitle: `Total Students: ${totalStudents}`,
      table: insertedStudents,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: `${err.detail || err.message || err}` });
  }
};

module.exports = { handleStudentFileUpload };
