"use strict";

const tagString = require("./tagString");
const parse = require("./parse");

module.exports = function tag(...args) {
  return parse(tagString(...args));
};
