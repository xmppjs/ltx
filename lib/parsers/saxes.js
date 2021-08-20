"use strict";

const inherits = require("inherits");
const { EventEmitter } = require("events");
const saxes = require("saxes");

const SaxSaxesjs = (module.exports = function SaxSaxesjs() {
  EventEmitter.call(this);
  this.parser = new saxes.SaxesParser({ fragment: true });

  this.parser.on("opentag", (a) => {
    this.emit("startElement", a.name, a.attributes);
  });
  this.parser.on("closetag", (el) => {
    this.emit("endElement", el.name);
  });
  this.parser.on("text", (str) => {
    this.emit("text", str);
  });
  this.parser.on("end", () => {
    this.emit("end");
  });
  this.parser.on("error", (e) => {
    this.emit("error", e);
  });
});

inherits(SaxSaxesjs, EventEmitter);

SaxSaxesjs.prototype.write = function write(data) {
  if (typeof data !== "string") {
    data = data.toString();
  }
  this.parser.write(data);
};

SaxSaxesjs.prototype.end = function end(data) {
  if (data) {
    this.parser.write(data);
  }
  this.parser.close();
};
