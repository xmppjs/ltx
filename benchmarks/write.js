/*
  benchmark the serialization speed of the the supported backends
 */

import benchmark from "benchmark";
import parsers from "../lib/parsers.js";
import fs from "fs";

const XML = fs.readFileSync(new URL("data.xml", import.meta.url), "utf8");

const suite = new benchmark.Suite("backends write");

for (const Parser of parsers) {
  const parser = new Parser();
  parser.write("<r>");
  suite.add(Parser.name.slice(3), () => {
    parser.write(XML);
  });
}

export default suite;
