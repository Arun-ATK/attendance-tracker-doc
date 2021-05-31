const create = (db) => async (req, res) => {
  const { user, className } = req.body;

  if (className.trim() == "") {
    return res.status(400).json({ message: "Class Name Cannot Be Empty!" });
  }

  try {
    await db("class").insert({
      faculty_id: user.faculty_id,
      subject: className,
    });

    const classes = await db
      .select("*")
      .from("class")
      .where({ faculty_id: user.faculty_id });

    res.status(201).json(classes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while Creating New Class!" });
  }
};

module.exports = { create };
