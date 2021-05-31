import React from "react";

const ClassBar = (props) => {
  const { classes, handleQuery, setClassName } = props;

  return (
    <div className="class-bar">
      <h1>Classes</h1>
      {classes.map((_class) => {
        return (
          <div className="class-elt" key={_class.class_id}>
            <h3
              onClick={(event) => {
                setClassName(event.target.innerText);
                setTimeout(() => {
                  handleQuery("getSummary");
                }, 10);
              }}
            >
              {_class.subject}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default ClassBar;
