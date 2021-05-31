const handleRegister =
  (db, bcrypt, SALT_ROUNDS, validator) => async (req, res) => {
    const { name, email, college, password } = req.body;
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      college.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({ message: "Empty fields not allowed!" });
    }

    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Invalid Email!" });
    }

    try {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      const faculty = await db("faculty")
        .insert({ name, email, college, password: hash })
        .returning(["faculty_id", "name", "email", "college"]);

      const user = {
        faculty_id: faculty[0].faculty_id,
        name: faculty[0].name,
        email: faculty[0].email,
        college: faculty[0].college,
        classes: [],
      };

      return res.status(201).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "User Already Exists!" });
    }
  };

module.exports = { handleRegister };
