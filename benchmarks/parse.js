"use strict";

/*
  benchmark the parsing speed of the supported backends
 */

const benchmark = require("benchmark");
const ltx = require("../index");
const parsers = require("../lib/parsers");
const fs = require("fs");
const path = require("path");

const XML = fs.readFileSync(path.join(__dirname, "data.xml"), "utf8");

const suite = new benchmark.Suite("backends parse");

for (const Parser of parsers) {
  suite.add(Parser.name.slice(3), () => {
    ltx.parse(XML, { Parser: Parser });
  });
}

module.exports = suite;
