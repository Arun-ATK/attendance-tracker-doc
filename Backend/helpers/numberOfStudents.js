const numberOfStudents = (db, class_id) => {
  return new Promise((resolve, reject) => {
    db("belongsto")
      .count("student_id AS totalStudents")
      .where({ class_id })
      .then((table) => resolve(table[0].totalStudents))
      .catch(reject);
  });
};

module.exports = { numberOfStudents };
