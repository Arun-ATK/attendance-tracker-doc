const { Readable } = require("stream");
const csv = require("csv-parser");
const iconv = require("iconv-lite");

const getObjectsFromCSV = (
  buffer,
  encoding = "utf8",
  props = { separator: "," }
) => {
  let result = [];

  return new Promise((resolve, reject) => {
    Readable.from(buffer)
      .pipe(iconv.decodeStream(encoding))
      .pipe(csv(props))
      .on("error", (err) => reject(err))
      .on("data", (data) => {
        if (Object.keys(data).length !== 0) result.push(data);
      })
      .on("end", () => resolve(result));
  });
};

module.exports = { getObjectsFromCSV };
