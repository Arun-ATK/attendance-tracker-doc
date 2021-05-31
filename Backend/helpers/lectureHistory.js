const lectureHistory = (db, class_id, totalStudents) => {
  const hm = `format('%sh %sm', l.duration / 60, l.duration % 60)`;
  const m = `format('%sm', l.duration)`;

  return new Promise((resolve, reject) => {
    db.select(
      "l.lecture_id AS lecture id",
      db.raw(
        `TO_CHAR(l.start_time, 'YYYY-MM-DD,  HH12:MI:SS AM') AS "start time"`
      ),
      db.raw(
        `(CASE WHEN l.duration >= 60 THEN ${hm} ELSE ${m} END)  AS duration`
      ),
      "l.threshold_percent AS threshold percent",
      db.raw(
        `format('%s/${totalStudents}', COUNT(CASE WHEN ispresent=true THEN 1 END)) AS attendance`
      )
    )
      .from("class_lectures AS l")
      .innerJoin("attends AS a", { "l.lecture_id": "a.lecture_id" })
      .where({
        "l.class_id": class_id,
      })
      .groupBy(
        "l.lecture_id",
        "l.start_time",
        "l.duration",
        "l.threshold_percent"
      )
      .orderBy("l.start_time", "desc")
      .then(resolve)
      .catch(reject);
  });
};

module.exports = { lectureHistory };
