const getClassId = (db, subject, faculty_id) => {
  return new Promise((resolve, reject) => {
    db.select("class_id")
      .from("class")
      .where({ subject, faculty_id })
      .then((table) => {
        if (table.length === 0)
          reject({ message: `Class ${subject} doesn't exist` });
        else resolve(table[0].class_id);
      })
      .catch((err) => reject(err));
  });
};

module.exports = { getClassId };
