"use strict";

/*
  benchmark the parsing speed of the supported backends
 */

var benchmark = require("benchmark");
var ltx = require("../index");
var parsers = require("../lib/parsers");
var fs = require("fs");
var path = require("path");

var XML = fs.readFileSync(path.join(__dirname, "data.xml"), "utf8");

var suite = new benchmark.Suite("backends parse");

parsers.forEach(function (Parser) {
  suite.add(Parser.name.slice(3), function () {
    ltx.parse(XML, { Parser: Parser });
  });
});

module.exports = suite;
