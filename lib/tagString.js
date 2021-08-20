"use strict";

const escape = require("./escape").escapeXML;

module.exports = function tagString(literals, ...substitutions) {
  let str = "";

  for (let i = 0; i < substitutions.length; i++) {
    str += literals[i];
    str += escape(substitutions[i]);
  }
  str += literals[literals.length - 1];

  return str;
};
