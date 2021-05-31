const { getClassId } = require("../helpers/getClassId");
const { numberOfStudents } = require("../helpers/numberOfStudents");
const { lectureHistory } = require("../helpers/lectureHistory");
const { lectureExists } = require("../helpers/lectureExists");

const updateThreshold = (db) => async (req, res) => {
  const { className, lecture_id, threshold_percent, user } = req.body;

  try {
    const class_id = await getClassId(db, className, user.faculty_id);
    const lecExists = await lectureExists(db, lecture_id, class_id);

    if (!lecExists)
      return res.status(404).json({ message: "Lecture doesn't exist" });

    await db("lecture").update({ threshold_percent }).where({ lecture_id });

    const totalStudents = await numberOfStudents(db, class_id);

    const lectureList = await lectureHistory(db, class_id, totalStudents);

    console.table(lectureList);

    return res.status(200).json({
      title: `Lecture history of ${className}`,
      subTitle: `Total Students: ${totalStudents}`,
      table: lectureList,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: `${err.detail || err.message || err}` });
  }
};

module.exports = { updateThreshold };
