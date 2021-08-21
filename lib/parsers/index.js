"use strict";

module.exports = [
  // "libxmljs",
  "ltx",
  "node-expat",
  "node-xml",
  "sax-js",
  "saxes",
].map((name) => {
  return require("./" + name);
});
