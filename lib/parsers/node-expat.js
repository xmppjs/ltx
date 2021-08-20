"use strict";

const inherits = require("inherits");
const { EventEmitter } = require("events");
const expat = require("node-expat");

const SaxExpat = (module.exports = function SaxExpat() {
  EventEmitter.call(this);
  this.parser = new expat.Parser("UTF-8");

  this.parser.on("startElement", (name, attrs) => {
    this.emit("startElement", name, attrs);
  });
  this.parser.on("endElement", (name) => {
    this.emit("endElement", name);
  });
  this.parser.on("text", (str) => {
    this.emit("text", str);
  });
  // TODO: other events, esp. entityDecl (billion laughs!)
});

inherits(SaxExpat, EventEmitter);

SaxExpat.prototype.write = function write(data) {
  if (!this.parser.parse(data, false)) {
    this.emit("error", new Error(this.parser.getError()));

    // Premature error thrown,
    // disable all functionality:
    this.write = function write() {};
    this.end = function end() {};
  }
};

SaxExpat.prototype.end = function end() {
  if (!this.parser.parse("", true)) {
    this.emit("error", new Error(this.parser.getError()));
  } else {
    this.emit("end");
  }
};
