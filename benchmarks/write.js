"use strict";

/*
  benchmark the serialization speed of the the supported backends
 */

const benchmark = require("benchmark");
const parsers = require("../lib/parsers");
const fs = require("fs");
const path = require("path");

const XML = fs.readFileSync(path.join(__dirname, "data.xml"), "utf8");

const suite = new benchmark.Suite("backends write");

for (const Parser of parsers) {
  const parser = new Parser();
  parser.write("<r>");
  suite.add(Parser.name.slice(3), () => {
    parser.write(XML);
  });
}

module.exports = suite;
