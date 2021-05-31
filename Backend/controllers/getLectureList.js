const { getClassId } = require("../helpers/getClassId");
const { lectureHistory } = require("../helpers/lectureHistory");
const { numberOfStudents } = require("../helpers/numberOfStudents");

const getLectureList = (db) => async (req, res) => {
  const { className, user } = req.body;
  const class_id = await getClassId(db, className, user.faculty_id);

  const totalStudents = await numberOfStudents(db, class_id);
  console.log(totalStudents);

  try {
    const lectureList = await lectureHistory(db, class_id, totalStudents);

    if (lectureList.length == 0) {
      return res.status(404).json({ message: "No lectures for this class!" });
    }

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

module.exports = { getLectureList };
