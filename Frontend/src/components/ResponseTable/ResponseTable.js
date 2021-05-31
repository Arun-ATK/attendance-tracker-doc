import React from "react";

const ResposeTable = (props) => {
  const { responseTable } = props;
  if (responseTable.table.length === 0) return null;

  return (
    <div>
      <h2 className="table-title">
        {responseTable.title}
        <span className="table-sub-title">{responseTable.subTitle}</span>
      </h2>
      <table>
        <thead>
          <tr>
            {Object.keys(responseTable.table[0]).map((key, ind) => {
              return <th key={ind}>{key}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {responseTable.table.map((row, ind) => {
            return (
              <tr key={ind}>
                {Object.values(row).map((data, ind) => {
                  if (typeof data === "boolean") {
                    if (data)
                      return (
                        <td key={ind}>
                          <i className="fas fa-check"></i>
                        </td>
                      );
                    else
                      return (
                        <td key={ind}>
                          <i className="fas fa-times"></i>
                        </td>
                      );
                  } else return <td key={ind}>{data}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResposeTable;
