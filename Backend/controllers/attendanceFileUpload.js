const { getClassId } = require("../helpers/getClassId");
const { getObjectsFromCSV } = require("../helpers/getObjectsFromCSV");

const GRACE_TIME = 5; // minutes

const getDurationInMinutes = (str) => {
  let duration = 0;
  if (str.includes("h")) {
    duration += Number(str.split("h")[0]) * 60;
    str = str.split("h")[1].trim();
  }
  if (str.includes("m")) duration += Number(str.split("m")[0]);

  return duration;
};

const getTotalDurationInMinutes = (participant) => {
  let duration = 0;
  participant.forEach((entry) => {
    duration += getDurationInMinutes(entry["Duration"]);
  });

  return duration;
};

const handleAttendanceFileUpload = (db) => async (req, res) => {
  if (!req.files) return res.status(404).json({ message: "File Not Found!" });
  if (!req.files.attendanceFile.name.endsWith(".csv")) {
    return res.status(400).json({ message: "Only CSV files are accepted!" });
  }

  const { className } = req.body;
  const threshold_percent = req.body.threshold_percent || 75;
  const user = JSON.parse(req.body.user);

  try {
    const class_id = await getClassId(db, className, user.faculty_id);

    const participants = await getObjectsFromCSV(
      req.files.attendanceFile.data,
      "utf16-le",
      {
        separator: "\t",
        skipLines: 6,
      }
    );

    const organizer = participants.filter((p) => p["Role"] === "Organizer");
    console.log(organizer);

    const start_time = organizer[0]["Join Time"];
    const lecture_duration = getTotalDurationInMinutes(organizer);

    const threshold_duration =
      (lecture_duration * threshold_percent) / 100 - GRACE_TIME;

    const { lecture_id } = (
      await db("lecture")
        .insert({
          class_id,
          duration: lecture_duration,
          start_time: db.raw(
            `TO_TIMESTAMP('${start_time}', 'MM/DD/YYYY, HH:MI:SS AM')`
          ),
          threshold_percent,
        })
        .returning(["lecture_id"])
    )[0];

    console.log(`lecture_id: ${lecture_id}`);

    const students = await db
      .select("student_id", "email")
      .from("class_students")
      .where({ class_id });

    await db.transaction(async (trx) => {
      for (const student of students) {
        const entries = participants.filter(
          (p) => p["Email"] === student.email
        );

        const student_duration = getTotalDurationInMinutes(entries);
        const ispresent = student_duration >= threshold_duration;

        await trx("attends").insert({
          student_id: student.student_id,
          lecture_id,
          ispresent,
          duration: student_duration,
        });
      }
    });

    const table = await db
      .select("rollno", "name", "email", "ispresent")
      .from("student_attendance")
      .where({ lecture_id })
      .orderBy("rollno");

    return res.status(201).json({
      title: `Lecture Attendance for ${className}`,
      subTitle: `Start Time: ${start_time}`,
      table,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: `${err.detail || err.message || err}` });
  }
};

module.exports = { handleAttendanceFileUpload };
