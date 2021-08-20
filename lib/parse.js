"use strict";

const Parser = require("./Parser");

module.exports = function parse(data, options) {
  const p = typeof options === "function" ? new options() : new Parser(options);

  let result = null;
  let error = null;

  p.on("tree", (tree) => {
    result = tree;
  });
  p.on("error", (e) => {
    error = e;
  });

  p.write(data);
  p.end();

  if (error) {
    throw error;
  } else {
    return result;
  }
};
