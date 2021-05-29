const getList = (db) => async (req, res) => {

    // Temp values
    const class_id = 1;
    const faculty_id = 1;

    try {
        const lectureList = await db
            .select('l.lecture_id', 'l.duration', 'l.start_time', 'l.threshold_percent',
                db.raw('COUNT(CASE WHEN ispresent=true THEN 1 END) AS attendance'))
            .from('class_lectures AS l')
            .innerJoin('attends AS a', 'l.lecture_id', '=', 'a.lecture_id')
            .where({
                'l.class_id': class_id,
                'l.faculty_id': faculty_id
            })
            .groupBy('l.lecture_id', 'l.duration', 'l.start_time', 'l.threshold_percent');

        if (lectureList.length == 0) {
            return res.status(500).json({ message: "No lectures for this class!" });
        }

        return res.status(200).json({ title: `Lecture history of ${class_id}`, table: lectureList });

    }
    catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: `${err.detail || err.message || err}` });
    }
}