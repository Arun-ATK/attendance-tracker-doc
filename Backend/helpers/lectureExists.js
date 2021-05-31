const lectureExists = (db, lecture_id, class_id) => {
  return new Promise((resolve, reject) => {
    db.select("lecture_id")
      .from("lecture")
      .where({
        lecture_id,
        class_id,
      })
      .then((table) => resolve(table.length != 0))
      .catch(reject);
  });
};

module.exports = { lectureExists };
