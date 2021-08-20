"use strict";

/*
  benchmark the serialization speed of the the supported backends
 */

var benchmark = require("benchmark");
var parsers = require("../lib/parsers");
var fs = require("fs");
var path = require("path");

var XML = fs.readFileSync(path.join(__dirname, "data.xml"), "utf8");

var suite = new benchmark.Suite("backends write");

parsers.forEach(function (Parser) {
  var parser = new Parser();
  parser.write("<r>");
  suite.add(Parser.name.slice(3), function () {
    parser.write(XML);
  });
});

module.exports = suite;
