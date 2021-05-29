const getDetails = (db) => async (req, res) => {

    // Temp values
    const lecture_id = 1;
    const faculty_id = 1;
    const class_id = 1;

    try {

        const lectureDetails = await db
            .select("start_time", "duration")
            .from("lecture")
            .where({lecture_id: lecture_id});

        if (lectureDetails.length == 0) {
            return res.status(500).json({ message: "Lecture does not exist!" });
        }

        const lectureAttendance = await db
            .select("rollno", "name", "ispresent")
            .from("student_attendance AS s")
            .where({
                lecture_id: lecture_id,
                faculty_id: faculty_id,
                class_id: class_id
            });

        const result = {
            lectureDetails: { title: `Details of lecture ${lecture_id}`, table: lectureDetails },
            lectureAttendance: { title: `Attendance of lecture ${lecture_id}`, table: lectureAttendance}
        };

        return res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: `${err.detail || err.message || err}` });
    }
}