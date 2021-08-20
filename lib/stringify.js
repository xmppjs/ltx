"use strict";

var escapeXML = require("./escape").escapeXML;

function stringify(el, indent, level) {
  if (typeof indent === "number") indent = " ".repeat(indent);
  if (!level) level = 1;
  var s = "";
  s += "<" + el.name;

  Object.keys(el.attrs).forEach(function (k) {
    s += " " + k + "=" + '"' + escapeXML(el.attrs[k]) + '"';
  });

  if (el.children.length) {
    s += ">";
    el.children.forEach(function (child, i) {
      if (indent) s += "\n" + indent.repeat(level);
      if (typeof child === "string") {
        s += escapeXML(child);
      } else {
        s += stringify(child, indent, level + 1);
      }
    });
    if (indent) s += "\n" + indent.repeat(level - 1);
    s += "</" + el.name + ">";
  } else {
    s += "/>";
  }

  return s;
}

module.exports = stringify;
