const updateThreshold = (db) => async (req, res) => {
    
    // Temp values
    const lecture_id = 1;
    const faculty_id = 1;
    const class_id = 1;
    const threshold = 70;

    try {
        const lecExists = await db
            .select("lecture_id")
            .from("class_lectures")
            .where({
                lecture_id: lecture_id,
                faculty_id: faculty_id,
                class_id: class_id
            });

        if (lecExists.length != 0) {
            const updatedLecture = (
                await db("lecture")
                    .where({ lecture_id: lecture_id })
                    .update({ threshold_percent: threshold }, ["lecture_id", "threshold_percent"])
                    .returning(["lecture_id"])
            )[0];

            console.log(updatedLecture.lecture_id);
            if (updatedLecture.lecture_id != lecture_id) {
                return res
                    .status(500)
                    .send('Error while updating lecture!');
            }

            // Same code as in lectureList.js
            // Can call that function instead
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

            return res.status(201).json({ title: `Lecture history of ${class_id}`, table: lectureList });
        }
    }
    catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: `${err.detail || err.message || err}` });
    }
}