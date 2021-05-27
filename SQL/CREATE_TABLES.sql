CREATE TABLE FACULTY (
    FACULTY_ID  SERIAL PRIMARY KEY,
    EMAIL       VARCHAR(50) NOT NULL UNIQUE,
    PASSWORD    VARCHAR(100) NOT NULL,
    NAME        VARCHAR(60) NOT NULL,
    COLLEGE     VARCHAR(50) NOT NULL
);

CREATE TABLE STUDENT (
    STUDENT_ID  SERIAL PRIMARY KEY,
    EMAIL       VARCHAR(50) NOT NULL UNIQUE,
    COLLEGE     VARCHAR(50) NOT NULL,
    ROLLNO      VARCHAR(20) NOT NULL,
    NAME        VARCHAR(60) NOT NULL,
    DOB         DATE NOT NULL,
    MAJOR       VARCHAR(20) NOT NULL,
    YEAR        INT NOT NULL CHECK(YEAR  > 0),
    CONSTRAINT UN_ROLLNO UNIQUE(ROLLNO, COLLEGE)
);

CREATE TABLE CLASS (
    CLASS_ID    SERIAL PRIMARY KEY,
    SUBJECT     VARCHAR(40) NOT NULL,
    FACULTY_ID  INT NOT NULL,
    CONSTRAINT FK_ClassFaculty FOREIGN KEY(FACULTY_ID) REFERENCES FACULTY(FACULTY_ID),
    CONSTRAINT UN_FacultySub UNIQUE(SUBJECT, FACULTY_ID)   
);

-- Storing duration as minutes
CREATE TABLE LECTURE (
    LECTURE_ID          SERIAL PRIMARY KEY,
    CLASS_ID            INT NOT NULL,
    DURATION            INT NOT NULL CHECK (DURATION > 0),
    START_TIME          TIMESTAMP NOT NULL,
    THRESHOLD_PERCENT   INT NOT NULL CHECK(THRESHOLD_PERCENT > 0 AND THRESHOLD_PERCENT <= 100),
    CONSTRAINT UN_Lec UNIQUE(START_TIME, CLASS_ID),
    CONSTRAINT FK_LectureClass FOREIGN KEY(CLASS_ID) REFERENCES CLASS(CLASS_ID)
);

CREATE TABLE ATTENDS (
    STUDENT_ID  INT NOT NULL,
    LECTURE_ID  INT NOT NULL,
    ISPRESENT   BOOLEAN NOT NULL,
    DURATION    INT NOT NULL,
    CONSTRAINT PK_StudentLec PRIMARY KEY(STUDENT_ID, LECTURE_ID),
    CONSTRAINT FK_AttStudent FOREIGN KEY(STUDENT_ID) REFERENCES STUDENT(STUDENT_ID),
    CONSTRAINT FK_AttLecture FOREIGN KEY(LECTURE_ID) REFERENCES LECTURE(LECTURE_ID)
);

CREATE TABLE BELONGSTO (
    STUDENT_ID  INT NOT NULL,
    CLASS_ID    INT NOT NULL,
    CONSTRAINT PK_StudentClass PRIMARY KEY(STUDENT_ID, CLASS_ID),
    CONSTRAINT FK_BelStudent FOREIGN KEY(STUDENT_ID) REFERENCES STUDENT(STUDENT_ID),
    CONSTRAINT FK_BelClass FOREIGN KEY(CLASS_ID) REFERENCES CLASS(CLASS_ID)
);