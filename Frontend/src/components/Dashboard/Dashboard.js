import React from "react";
import Modal from "react-modal";
import ClassBar from "../ClassBar/ClassBar";
import FileUploadForm from "../FileUploadForm/FileUploadForm";
import ResponseTable from "../ResponseTable/ResponseTable";
import ClassDropdown from "../ClassDropdown/ClassDropdown";
import "./Dashboard.css";

Modal.setAppElement("#root");

const MODAL_STYLES = {
  overlay: {
    zIndex: 2,
    background: "rgba(0, 0, 0, 0.5)",
  },

  content: {
    zIndex: 2,
    width: "60vw",
    height: "80vh",
    background: "none",
    border: "none",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModal: "",
      className: "",
      studentFile: null,
      attendanceFile: null,
      threshold_percent: "75",
      lecture_id: undefined,
      responseTable: {
        title: "",
        table: [],
      },
    };
  }

  setActiveModal = (activeModal) => {
    this.setState({
      activeModal,
      className: "",
      studentFile: null,
      attendanceFile: null,
      threshold_percent: "75",
      lecture_id: undefined,
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  setClassName = (className) => {
    this.setState({ className });
  };

  handleFileChange = (event) => {
    this.setState({ [event.target.name]: event.target.files[0] });
  };

  updateResponseTable = (responseTable) => {
    this.setState({ responseTable });
  };

  createNewClass = async () => {
    if (this.state.className.trim() === "") return;

    try {
      const response = await fetch("http://localhost:4000/createNewClass", {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          user: this.props.user,
          className: this.state.className,
        }),
      });

      if (response.ok) {
        const classes = await response.json();
        this.props.user.classes = classes;
        this.props.loadUser(this.props.user);
      } else {
        const error = await response.json();
        console.log(error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setActiveModal("");
    }
  };

  uploadFile = async (fileName) => {
    const { className, threshold_percent } = this.state;
    if (
      this.state[fileName] === null ||
      className.trim() === "" ||
      className === "select class"
    )
      return;

    const formData = new FormData();
    formData.append("className", className);

    if (fileName === "attendanceFile")
      formData.append("threshold_percent", threshold_percent);

    formData.append("user", JSON.stringify(this.props.user));
    formData.append(fileName, this.state[fileName]);

    try {
      const response = await fetch(`http://localhost:4000/upload/${fileName}`, {
        method: "post",
        body: formData,
      });

      if (response.ok) {
        const responseTable = await response.json();
        console.log(responseTable);
        this.updateResponseTable(responseTable);
      } else {
        const error = await response.json();
        console.log(error.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setActiveModal("");
    }
  };

  handleQuery = async (endpoint) => {
    try {
      console.log(`className: ${this.state.className}`);
      const response = await fetch(`http://localhost:4000/${endpoint}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          user: this.props.user,
          className: this.state.className,
          lecture_id: this.state.lecture_id,
          threshold_percent: this.state.threshold_percent,
        }),
      });

      if (response.ok) {
        const responseTable = await response.json();
        console.log(responseTable);
        this.updateResponseTable(responseTable);
      } else {
        const error = await response.json();
        console.log(error.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setActiveModal("");
    }
  };

  render() {
    console.log(this.state);
    const { user } = this.props;

    return (
      <React.Fragment>
        <h1 className="user">
          <i className="fas fa-user-circle"> {user.name}</i>
        </h1>

        <div className="container">
          <ClassBar
            classes={user.classes}
            handleQuery={this.handleQuery}
            setClassName={this.setClassName}
          />

          <div className="nested">
            <div className="options">
              <button
                className="btn"
                onClick={() => this.setActiveModal("newClass")}
              >
                Create New Class
              </button>

              <button
                className="btn"
                onClick={() => this.setActiveModal("studentUpload")}
              >
                Add/Update Students
              </button>

              <button
                className="btn"
                onClick={() => this.setActiveModal("attendanceUpload")}
              >
                Upload Attendance
              </button>

              <button
                className="btn"
                onClick={() => this.setActiveModal("lectureList")}
              >
                Get Lecture List
              </button>

              <button
                className="btn"
                onClick={() => this.setActiveModal("updateThreshold")}
              >
                Update Threshold
              </button>

              <button
                className="btn"
                onClick={() => this.setActiveModal("lectureAttendance")}
              >
                Lecture Attendance
              </button>
            </div>

            <ResponseTable responseTable={this.state.responseTable} />
          </div>
        </div>

        <Modal
          isOpen={this.state.activeModal === "newClass"}
          onRequestClose={() => this.setActiveModal("")}
          style={MODAL_STYLES}
        >
          <div className="form">
            <h1 className="form-title">Create New Class</h1>
            <div className="form-elt">
              <input
                type="text"
                name="className"
                placeholder="Class Name"
                onChange={this.handleChange}
              />
            </div>
            <button className="btn" onClick={this.createNewClass}>
              Create
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.activeModal === "studentUpload"}
          onRequestClose={() => this.setActiveModal("")}
          style={MODAL_STYLES}
        >
          <FileUploadForm
            title="Add Students"
            classes={user.classes}
            fileInputName="studentFile"
            handleFileChange={this.handleFileChange}
            handleInputChange={this.handleChange}
            handleSubmit={this.uploadFile}
            isAttendanceFile={false}
          />
        </Modal>

        <Modal
          isOpen={this.state.activeModal === "attendanceUpload"}
          onRequestClose={() => this.setActiveModal("")}
          style={MODAL_STYLES}
        >
          <FileUploadForm
            title="Upload Attendance"
            classes={user.classes}
            fileInputName="attendanceFile"
            handleFileChange={this.handleFileChange}
            handleInputChange={this.handleChange}
            handleSubmit={this.uploadFile}
            isAttendanceFile={true}
          />
        </Modal>

        <Modal
          isOpen={this.state.activeModal === "lectureList"}
          onRequestClose={() => this.setActiveModal("")}
          style={MODAL_STYLES}
        >
          <div className="form">
            <h1 className="form-title">Get Lecture List</h1>
            <div className="form-elt">
              <ClassDropdown
                classes={user.classes}
                handleClassChange={this.handleChange}
              />
            </div>
            <button
              className="btn"
              onClick={() => this.handleQuery("getLectureList")}
            >
              Get
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.activeModal === "updateThreshold"}
          onRequestClose={() => this.setActiveModal("")}
          style={MODAL_STYLES}
        >
          <div className="form">
            <h1 className="form-title">Update Threshold</h1>
            <div className="form-elt">
              <ClassDropdown
                classes={user.classes}
                handleClassChange={this.handleChange}
              />
            </div>
            <div className="form-elt">
              <input
                type="number"
                name="lecture_id"
                placeholder="Lecture ID"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-elt">
              <input
                type="number"
                name="threshold_percent"
                placeholder="Threshold Percent"
                min="0"
                max="100"
                onChange={this.handleChange}
              />
            </div>
            <button
              className="btn"
              onClick={() => this.handleQuery("updateThreshold")}
            >
              Update
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={this.state.activeModal === "lectureAttendance"}
          onRequestClose={() => this.setActiveModal("")}
          style={MODAL_STYLES}
        >
          <div className="form">
            <h1 className="form-title">Lecture Attendance</h1>
            <div className="form-elt">
              <ClassDropdown
                classes={user.classes}
                handleClassChange={this.handleChange}
              />
            </div>
            <div className="form-elt">
              <input
                type="number"
                name="lecture_id"
                placeholder="Lecture ID"
                onChange={this.handleChange}
              />
            </div>
            <button
              className="btn"
              onClick={() => this.handleQuery("lectureAttendance")}
            >
              Get
            </button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Dashboard;
