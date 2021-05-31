import React from "react";

const ClassDropdown = (props) => {
  const { classes, handleClassChange } = props;

  return (
    <select name="className" onChange={handleClassChange}>
      <option value="select class">Select Class</option>
      {classes.map((_class) => {
        return (
          <option value={_class.subject} key={_class.class_id}>
            {_class.subject}
          </option>
        );
      })}
    </select>
  );
};

export default ClassDropdown;
