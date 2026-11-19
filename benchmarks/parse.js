/*
  benchmark the parsing speed of the supported backends
 */

import fs from "fs";
import benchmark from "benchmark";

import parse from "../src/parse.js";

const XML = fs.readFileSync(new URL("data.xml", import.meta.url), "utf8");

const suite = new benchmark.Suite("parse");

async function tryImport(name) {
  let module
  try {
    module = await import(name);
  } catch (err) {
    if (err.code !== "ERR_MODULE_NOT_FOUND") throw err;
  }
  return module
}

const libxmljs = await tryImport("libxmljs");
if (libxmljs) {
  suite.add("libxmljs", () => {
    libxmljs.parseXml(XML);
  });
}

const expat = await tryImport("node-expat");
if (expat) {
  suite.add("node-expat", () => {
    const parser = new expat.Parser("UTF-8");
    parser.write(
      "<html><head><title>Hello World</title></head><body><p>Foobar</p></body></html>",
    );
  });
}

const xml = await tryImport("node-xml");
if (xml) {
  suite.add("node-xml", () => {
    const parser = new xml.SaxParser(() => {});
    parser.parseString(XML);
  });
}

const sax = await tryImport("sax");
if (sax) {
  suite.add("sax", () => {
    const parser = sax.default.parser(true);
    parser.write(XML).close();
  });
}

const saxes = await tryImport("saxes");
if (saxes) {
  suite.add("saxes", () => {
    const parser = new saxes.SaxesParser();
    parser.write(XML).close();
  });
}

const txml = await tryImport("txml");
if (txml) {
  suite.add("txml", () => {
    txml.parse(XML);
  });
}

const xml2js = await tryImport("xml2js");
if (xml2js) {
  suite.add("xml2js", () => {
    xml2js.parseString(XML);
  });
}

const fastxmlparser = await tryImport("fast-xml-parser");
if (fastxmlparser) {
  suite.add("fast-xml-parser", () => {
    const parser = new fastxmlparser.XMLParser();
    parser.parse(XML);
  });
}

suite.add("ltx", () => {
  parse(XML);
});

export default suite;
