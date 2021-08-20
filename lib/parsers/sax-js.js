"use strict";

const inherits = require("inherits");
const { EventEmitter } = require("events");
const sax = require("sax");

const SaxSaxjs = (module.exports = function SaxSaxjs() {
  EventEmitter.call(this);
  this.parser = sax.parser(true);

  this.parser.onopentag = (a) => {
    this.emit("startElement", a.name, a.attributes);
  };
  this.parser.onclosetag = (name) => {
    this.emit("endElement", name);
  };
  this.parser.ontext = (str) => {
    this.emit("text", str);
  };
  this.parser.onend = () => {
    this.emit("end");
  };
  this.parser.onerror = (e) => {
    this.emit("error", e);
  };
});

inherits(SaxSaxjs, EventEmitter);

SaxSaxjs.prototype.write = function write(data) {
  if (typeof data !== "string") {
    data = data.toString();
  }
  this.parser.write(data);
};

SaxSaxjs.prototype.end = function end(data) {
  if (data) {
    this.parser.write(data);
  }
  this.parser.close();
};
