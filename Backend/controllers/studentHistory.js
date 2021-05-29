const getHistory = (db) => async (req, res) => {
    //Get value from front end

    // Temp values
    const student_id = 1
    const class_id = 1;
    const faculty_id = 1;

    try {
        const studentHistory = await db
            .select('rollno', 'name', 'ispresent', 'start_time')
            .from('student_attendance')
            .where({
                student_id: student_id,
                class_id: class_id,
                faculty_id: faculty_id
            });

        if (studentHistory.length == 0) {
            return res.status(500).json({ message: "Student doesn't exist!" });
        }

        return res
            .status(200)
            .json({ title: `Attendance history of ${student_id}`, table: studentHistory });
    }
    catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: `${err.detail || err.message || err}` });
    }
}