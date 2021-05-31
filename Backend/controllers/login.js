const handleLogin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;

  const error = {
    message: "Auth Failed!",
  };

  try {
    const faculty = await db.select("*").from("faculty").where({ email });

    if (faculty.length === 0) {
      return res.status(401).json(error);
    }
    const authorized = await bcrypt.compare(password, faculty[0].password);
    if (!authorized) return res.status(401).json(error);

    const classes = await db
      .select("class_id", "subject")
      .from("class")
      .where({ faculty_id: faculty[0].faculty_id });

    const user = {
      faculty_id: faculty[0].faculty_id,
      name: faculty[0].name,
      email: faculty[0].email,
      college: faculty[0].college,
      classes: classes,
    };

    console.table(classes);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Error while Logging in!" });
  }
};

module.exports = { handleLogin };
