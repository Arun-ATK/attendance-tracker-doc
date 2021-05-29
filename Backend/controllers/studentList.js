const getList = (db) => async (req, res) => {
    // const { user, className } = req.body;

    var faculty_id = 1; // Temp value
    var class_id = 1;   // Temp value

    try {
        const totalLectures = await db
        .count("* AS value")
        .from("class_lectures")
        .where({
            faculty_id: 1,
            class_id: 1
        });

        const studentList = await db
            .select('student_id', 'rollno', 'name', db.raw('COUNT(CASE WHEN ispresent=true THEN 1 END) AS attendance'))
            .from('student_attendance')
            .where({
                class_id: 1,
                faculty_id: 1
            })
            .groupBy('student_id', 'rollno', 'name');

        console.table(totalLectures);
        console.table(studentList);

        var output = {
            lecNum: { title: `Lecture Count for ${className}`, table: totalLectures },
            studentList: { title: `Student Attendance for ${className}`, table: studentList}
        };

        return res.status(200).json(output);
    }

    catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: `${err.detail || err.message || err}` });
      }
}