import React from "react";
import ClassDropdown from "../ClassDropdown/ClassDropdown";

const FileUploadForm = (props) => {
  const {
    title,
    classes,
    fileInputName,
    handleFileChange,
    handleInputChange,
    handleSubmit,
    isAttendanceFile,
  } = props;

  return (
    <div className="form">
      <h1 className="form-title">{title}</h1>

      <div className="form-elt">
        <ClassDropdown
          classes={classes}
          handleClassChange={handleInputChange}
        />
      </div>

      <div className="form-elt">
        <input type="file" name={fileInputName} onChange={handleFileChange} />
      </div>

      {isAttendanceFile ? (
        <div className="form-elt">
          <input
            type="number"
            name="threshold_percent"
            placeholder="Threshold Percent"
            min="0"
            max="100"
            onChange={handleInputChange}
          />
        </div>
      ) : null}
      <button className="btn" onClick={() => handleSubmit(fileInputName)}>
        Upload
      </button>
    </div>
  );
};

export default FileUploadForm;
