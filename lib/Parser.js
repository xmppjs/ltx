"use strict";

const { EventEmitter } = require("events");
const inherits = require("inherits");
const Element = require("./Element");
const LtxParser = require("./parsers/ltx");

const Parser = function (options) {
  EventEmitter.call(this);

  const ParserInterface = (this.Parser =
    (options && options.Parser) || this.DefaultParser);
  const ElementInterface = (this.Element =
    (options && options.Element) || this.DefaultElement);

  this.parser = new ParserInterface();

  let el;
  this.parser.on("startElement", (name, attrs) => {
    const child = new ElementInterface(name, attrs);
    el = !el ? child : el.cnode(child);
  });
  this.parser.on("endElement", (name) => {
    if (!el) {
      /* Err */
    } else if (name === el.name) {
      if (el.parent) {
        el = el.parent;
      } else if (!this.tree) {
        this.tree = el;
        el = undefined;
      }
    }
  });
  this.parser.on("text", (str) => {
    if (el) {
      el.t(str);
    }
  });
  this.parser.on("error", (e) => {
    this.error = e;
    this.emit("error", e);
  });
};

inherits(Parser, EventEmitter);

Parser.prototype.DefaultParser = LtxParser;

Parser.prototype.DefaultElement = Element;

Parser.prototype.write = function write(data) {
  this.parser.write(data);
};

Parser.prototype.end = function end(data) {
  this.parser.end(data);

  if (!this.error) {
    if (this.tree) {
      this.emit("tree", this.tree);
    } else {
      this.emit("error", new Error("Incomplete document"));
    }
  }
};

module.exports = Parser;
