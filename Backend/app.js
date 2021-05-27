const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const saltrounds = 10;
const fileUpload = require('express-fileupload');
const csvtojson = require('csvtojson');
const session = require('express-session');
const { ESRCH } = require('constants');

//const cors = require('cors');
//const multer = require('multer');
//const helpers = require('./helpers'); //identify the csv files
//const morgan = require('morgan');
//const _ = require('lodash');
//var formidable = require('formidable');
//const fs = require('fs');

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public/img'));
app.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(morgan('dev'));
//app.use(cors());
//app.use(express.static(__dirname + '/dashboard'));
/*app.use(fileUpload({
    createParentPath: true
}));
*/

app.set('view engine', 'ejs');

app.listen(port, () => console.log(`listening on port ${port}!`));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


//displaying the database
app.get('/FACULTY', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM faculty');
        const faculty = { 'faculty': (result) ? result.rows : null };
        res.render('faculty', faculty);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/STUDENT', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM student');
        const faculty = { 'faculty': (result) ? result.rows : null };
        res.render('student', faculty);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/CLASS', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM class');
        const faculty = { 'faculty': (result) ? result.rows : null };
        res.render('class', faculty);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// app.get('/CLASS', async (req, res) => {
//     try {
//         const client = await pool.connect();
//         const result = await client.query('SELECT * FROM class');
//         const faculty = { 'faculty': (result) ? result.rows : null };
//         res.render('class', faculty);
//         client.release();
//     } catch (err) {
//         console.error(err);
//         res.send("Error " + err);
//     }
// });

app.get('/LECTURE', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM lecture');
        const faculty = { 'faculty': (result) ? result.rows : null };
        res.render('lecture', faculty);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/ATTENDS', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM attends');
        const faculty = { 'faculty': (result) ? result.rows : null };
        res.render('attends', faculty);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/BELONGSTO', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM belongsto');
        const faculty = { 'faculty': (result) ? result.rows : null };
        res.render('belongsto', faculty);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//initial register page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


//login page
app.get('/login.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});


// for parsing application/xwww-
//app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));

//success register page
app.post('/faculty', async (req, res) => {
    const name = req.body.name;
    const password = bcrypt.hashSync(req.body.password, saltrounds);
    const email = req.body.email;
    const college = req.body.college;

    console.log(`Name: ${name}, Password: ${password}, Email: ${email}, college: ${college}`);
    //res.send('request received!');

    const obj = {
        'name': name,
        'password': password,
        'email': email,
        'college': college
    };

    //looking for email
    var text = 'SELECT * FROM faculty WHERE email=$1';
    var values = [email];

    try {
        var client = await pool.connect();
        var result = await client.query(text, values);
        var faculty = result.rows;

        if ((typeof faculty[0] != 'undefined') && faculty[0].email == email) {
            return res.render('authenticate', { given: faculty });
        }
        client.release();
    }
    catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

    //if email doesn't exists
    text = 'INSERT INTO faculty(name, password, email, college) VALUES($1, $2, $3, $4) RETURNING *';
    values = [name, password, email, college];

    //res.send(JSON.stringify(obj));
    try {
        const client = await pool.connect();
        const result = await client.query(text, values);
        const faculty = result.rows;
        res.render('register', { given: faculty });
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//successful login
app.post('/dashboard', async (req, res) => {

    try {
        var password = req.body.password;
        var email = req.body.email;

        // console.log(`Email: ${email}, Password: ${password}`);
        //res.send('request received!');

        const given = {
            'email': email,
            'password': password
        };

        var text = 'SELECT * FROM faculty WHERE email=$1';
        var values = [email];

        //res.send(JSON.stringify(obj));
        var client = await pool.connect();
        var result = await client.query(text, values);
        const faculty = result.rows;

        email = faculty[0].email;
        password = faculty[0].password;

        //decrypt the Password
        const ok = bcrypt.compareSync(given.password, password);

        if (email == given.email && ok) {
            req.session.faculty_id = faculty[0].faculty_id;

            res.render('dashboard', { given: faculty });
        }
        else {
            res.send("<b>Invalid Email-id or Password!<b>")
        }

        client.release();

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

//create new class
app.post('/dashboard/new_class', function (req, res) {
    res.render('new-class');
});

app.post('/dashboard/new_class_created', async (req, res) => {
    // var faculty_id = req.body.faculty_id;
    var faculty_id = req.session.faculty_id;
    var subject = req.body.subject;

    // const given = {
    //     'faculty_id': faculty_id,
    //     'subject': subject
    // };

    var text = 'INSERT INTO class (faculty_id,subject) VALUES ($1,$2) RETURNING *';
    var values = [faculty_id, subject];

    try {
        const client = await pool.connect();
        const result = await client.query(text, values);
        const newClass = result.rows;

        req.session.class_id = newClass[0].class_id;

        res.render('new-class-created', { given: newClass });
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

});

//new set of students
app.get('/dashboard/new_class_created/new_student', function (req, res) {
    res.render('new-student');
});

let studdata = "text";

app.post('/dashboard/new_class_created/new_student/information', async (req, res) => {
    // var class_id = req.body.class_id;
    var class_id = req.session.class_id;

    studdata = req.files.csv_file.data.toString('utf8');
    //studdata = csvdata.substring(csvdata.indexOf("\nFull Name") + 1);

    var lines = studdata.split("\r\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }


    for (const obj of result) {
        var values = [];
        if (typeof obj["email"] != 'undefined') {
            Object.entries(obj).forEach(([key, value]) => {
                console.log(`${key} : ${value}`);
                values.push(value);
            });
            console.log('-------------------');

            //populate the student table and belongsto table
            var text1 = 'INSERT INTO student (rollno,name,dob,major,year,college,email) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *';
            var text2 = 'INSERT INTO belongsto (student_id,class_id) VALUES ($2,$1) RETURNING *';
            var text3 = 'SELECT * FROM student WHERE email=$1';

            try {
                const client = await pool.connect();
                var values2 = [class_id];
                var values3 = [values[6]];

                const result1 = await client.query(text3, values3);
                const student_exists = result1.rows;

                //check if student student exists
                ///
                if (typeof student_exists[0] == 'undefined') {
                    const result2 = await client.query(text1, values);
                    const faculty = result2.rows;
                    values2.push(faculty[0].student_id);
                }
                //student doesn't exists
                else {
                    values2.push(student_exists[0].student_id);
                }

                //insert into belongsto table
                const result3 = await client.query(text2, values2);
                client.release();
            }
            catch (err) {
                console.error(err);
                res.send("Error " + err);
            }
        }
    }
    return res.render('student-detail-success');
});

// Get the list of classes the user has created
app.post('/dashboard/classes', async (req, res) => {

    // Save Faculty ID as a session variable

    const query = 'SELECT * FROM CLASS WHERE FACULTY_ID=$1;';
    const values = [req.session.faculty_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);

        res.render('class-list', { title: 'Class list', classes: result.rows });

        client.release();
    }
    catch (err) {
        res.send('ERROR: ' + err);
        console.error(err);
    }
});

//uploading csv files
app.post('/dashboard/classes/upload_csv', function (req, res) {
    req.session.class_id = req.body.class_id;

    console.log(req.session.class_id);
    res.render('upload-csv');
});

let csvdata = "text";

app.post('/dashboard/classes/uploaded_csv', async (req, res) => {
    var threshold_percent = req.body.threshold_percent;

    // var class_id = req.body.class_id;
    var class_id = req.session.class_id;

    csvdata = req.files.csv_file.data.toString('utf16le');
    csvdata = csvdata.substring(csvdata.indexOf("\nFull Name") + 1);

    //converting csv file to json array
    var lines = csvdata.split("\n");
    var result = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("\t");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    //getting lecture duration and start time
    var lecture_duration = "";
    var start_time = "";

    for (var i = 0; i < result.length; i++) {
        if (result[i]["Role"] == "Organizer") {
            //lecture duration
            lecture_duration = result[i]["Duration"];
            lecture_duration = lecture_duration.substring(0, lecture_duration.indexOf("m"));

            //start time
            start_time = result[i]["Join Time"];
            break;
        }
    }

    console.log(lecture_duration + " --- " + start_time);

    //insert into lecture table
    var text = "INSERT INTO lecture (class_id,duration,start_time,threshold_percent) \
        VALUES ($1,$2,TO_TIMESTAMP($3, 'MM/DD/YYYY, HH:MI:SS AM') ,$4) \
        RETURNING *";

    var values = [class_id, lecture_duration, start_time, threshold_percent];
    var lecture_id = "";

    try {
        const client = await pool.connect();
        const ans = await client.query(text, values);
        const faculty = ans.rows;
        lecture_id = faculty[0].lecture_id;
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
        // res.send("Student already exists");
    }

    //insert into attends table
    for (const obj of result) {
        if (obj["Role"] == "Attendee") {

            //get student_id using Email
            var text = 'SELECT * FROM student WHERE email=$1';
            var values = [obj["Email"]];
            console.log(values);

            try {
                const client = await pool.connect();
                const ans = await client.query(text, values);
                const faculty = ans.rows;
                student_id = faculty[0].student_id;
                client.release();
            } catch (err) {
                console.error(err);
                res.send("Error " + err);
            }

            //calculate student duration
            var student_duration = obj["Duration"];
            var s = student_duration;
            var ok = 1;

            if (s.length <= 3 && s.slice(-1) == "s") {
                student_duration = "0";
                ok = 0;
            }
            if (ok) {
                student_duration = student_duration.substring(0, student_duration.indexOf("m"));
            }

            //check if student already exists in attends
            text = 'SELECT * FROM attends WHERE student_id=$1 AND lecture_id=$2';
            values = [student_id, lecture_id];

            var already_exists;
            try {
                const client = await pool.connect();
                const ans = await client.query(text, values);
                already_exists = ans.rows;
                client.release();
            } catch (err) {
                console.error(err);
                res.send("Error " + err);
            }

            ok = 0;
            //student already exists
            if (typeof already_exists[0] != 'undefined') {
                student_duration = +student_duration + +already_exists[0].duration;
                ok = 1;
            }

            var ispresent = 0;
            if (student_duration >= (lecture_duration * threshold_percent / 100)) {
                ispresent = 1;
            }

            if (!ok) {
                //inserting into attends
                text = 'INSERT INTO attends (student_id,lecture_id,ispresent,duration) VALUES ($1,$2,$3,$4)';
                values = [student_id, lecture_id, ispresent, student_duration];

                try {
                    const client = await pool.connect();
                    const ans = await client.query(text, values);
                    console.log(student_id + ' : success!')
                    client.release();
                } catch (err) {
                    var errObj = {
                        student_id: student_id,
                        lecture_id: lecture_id,
                        ispresent: ispresent,
                        student_duration: student_duration
                    };

                    console.error(errObj);
                    console.error(err);
                    // res.send("Error " + err);
                }
            }
            else {
                //update the record in ATTENDS
                text = 'UPDATE attends SET duration=$1, ispresent=$2 WHERE student_id=$3';
                values = [student_duration, ispresent, student_id];
                try {
                    const client = await pool.connect();
                    const ans = await client.query(text, values);
                    console.log(student_id + ' : success!')
                    client.release();
                } catch (err) {
                    console.error(err);
                    res.send("Error " + err);
                }
            }

        }
    }
    return res.render('uploaded-csv', { lecture_id: lecture_id });
});

// Get names of all students in a class and number of lectures attended
app.post('/dashboard/classes/class-details', async (req, res) => {

    // Save Class ID as a session variable when user views details of a class
    req.session.class_id = req.body.class_id;

    // Total number of lectures for the chosen class
    const totLecCountQuery = 'SELECT COUNT(*) AS VALUE \
        FROM CLASS_LECTURES \
        WHERE CLASS_ID=$1 AND FACULTY_ID=$2';

    // Get student details and number of lectures attended
    const AttendanceQuery = 'SELECT STUDENT_ID, ROLLNO, NAME, COUNT(ISPRESENT) FILTER(WHERE ISPRESENT=TRUE) AS ATTENDANCE \
        FROM STUDENT_ATTENDANCE \
        WHERE CLASS_ID=$1 AND FACULTY_ID=$2 \
        GROUP BY STUDENT_ID, ROLLNO, NAME';

    const values = [req.session.class_id, req.session.faculty_id];

    try {
        const client = await pool.connect();
        const totalLectures = await client.query(totLecCountQuery, values);
        const result = await client.query(AttendanceQuery, values);

        // Error checking
        if (totalLectures.rows.length == 0) {
            res.send('No lecture files uploaded for class');
            return;
        }
        if (result.rows.length == 0) {
            res.send('Class does not exist!');
            return;
        }

        // Disp results
        res.render('students', {
            title: 'Student list',
            students: result.rows,
            totalLectures: totalLectures.rows
        });

        client.release();
    }
    catch (err) {
        console.error(err);
        res.send('ERROR: ' + err);
    }

});

// Display the attendance history for a particular student
app.post('/dashboard/classes/class-details/student', async (req, res) => {
    const student_id = req.body.student_id;

    // faculty_ID used to ensure users cannot view other users' class records
    const studentHistoryQuery = 'SELECT ROLLNO, NAME, ISPRESENT, START_TIME \
        FROM STUDENT_ATTENDANCE \
        WHERE STUDENT_ID=$1 \
        AND CLASS_ID=$2 \
        AND FACULTY_ID=$3';

    const values = [student_id, req.session.class_id, req.session.faculty_id];

    try {
        const client = await pool.connect();
        const result = await client.query(studentHistoryQuery, values);

        if (result.rows.length == 0) {
            res.send('Student has no attendace records!');
            return;
        }

        res.render('student-history', {
            title: 'Student history',
            history: result.rows
        });

        client.release();
    }
    catch (err) {
        console.error(err);
        res.send('ERROR: ' + err);
    }
});
