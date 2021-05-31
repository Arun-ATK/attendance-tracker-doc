const numberOfLectures = (db, class_id) => {
  return new Promise((resolve, reject) => {
    db("lecture")
      .count("lecture_id as totalLectures")
      .where({ class_id })
      .then((table) => resolve(table[0].totalLectures))
      .catch(reject);
  });
};

module.exports = { numberOfLectures };
