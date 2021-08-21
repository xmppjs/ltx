/*
  benchmark the parsing speed of the supported backends
 */

import fs from "fs";
import benchmark from "benchmark";
import parse from "../lib/parse.js";
import parsers from "../lib/parsers.js";

const XML = fs.readFileSync(new URL("data.xml", import.meta.url), "utf8");

const suite = new benchmark.Suite("backends parse");

for (const Parser of parsers) {
  suite.add(Parser.name.slice(3), () => {
    parse(XML, { Parser: Parser });
  });
}

export default suite;
