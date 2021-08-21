/*
 * benchmark the parsing speed of the supported backends
 * difference with parse.js benchmark is that this doesn't use ltx at all
 */

import fs from "fs";

import benchmark from "benchmark";

import nodeXml from "node-xml";
import libxml from "libxmljs";
import expat from "node-expat";
import sax from "sax";
import saxes from "saxes";

import LtxSaxParser from "../lib/parsers/ltx.js";

const XML = fs.readFileSync(new URL("data.xml", import.meta.url), "utf8");

function NodeXmlParser() {
  const parser = new nodeXml.SaxParser(() => {});
  this.parse = (s) => {
    parser.parseString(s);
  };
  this.name = "node-xml";
}
function LibXmlJsParser() {
  const parser = new libxml.SaxPushParser(() => {});
  this.parse = (s) => {
    parser.push(s, false);
  };
  this.name = "libxmljs";
}
function SaxParser() {
  const parser = sax.parser();
  this.parse = (s) => {
    parser.write(s).close();
  };
  this.name = "sax";
}
function SaxesParser() {
  const parser = new saxes.SaxesParser({ fragment: true });
  this.parse = (s) => {
    parser.write(s);
  };
  this.name = "saxes";
}
function ExpatParser() {
  const parser = new expat.Parser();
  this.parse = (s) => {
    parser.parse(s, false);
  };
  this.name = "node-expat";
}
function LtxParser() {
  const parser = new LtxSaxParser();
  this.parse = (s) => {
    parser.write(s);
  };
  this.name = "ltx";
}

const parsers = [
  SaxParser,
  SaxesParser,
  NodeXmlParser,
  LibXmlJsParser,
  ExpatParser,
  LtxParser,
].map((Parser) => {
  return new Parser();
});

const suite = new benchmark.Suite("XML parsers comparison");

for (const parser of parsers) {
  parser.parse("<r>");
  suite.add(parser.name, () => {
    parser.parse(XML);
  });
}

export default suite;
