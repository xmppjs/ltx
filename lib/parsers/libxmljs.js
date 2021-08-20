"use strict";

const inherits = require("inherits");
const { EventEmitter } = require("events");
const libxmljs = require("libxmljs");

function SaxLibxmljs() {
  EventEmitter.call(this);
  this.parser = new libxmljs.SaxPushParser();

  this.parser.on("startElementNS", (name, attrs, prefix, uri, nss) => {
    const a = {};
    for (const attr of attrs) {
      let name = attr[0];
      if (attr[1]) name = attr[1] + ":" + name;
      a[name] = attr[3];
    }
    for (const ns of nss) {
      let name = "xmlns";
      if (ns[0] !== null) {
        name += ":" + ns[0];
      }
      a[name] = ns[1];
    }
    this.emit("startElement", (prefix ? prefix + ":" : "") + name, a);
  });

  this.parser.on("endElementNS", (name, prefix) => {
    this.emit("endElement", (prefix ? prefix + ":" : "") + name);
  });

  this.parser.on("characters", (str) => {
    this.emit("text", str);
  });

  this.parser.on("cadata", (str) => {
    this.emit("text", str);
  });

  this.parser.on("error", (err) => {
    this.emit("error", err);
  });
}

inherits(SaxLibxmljs, EventEmitter);

SaxLibxmljs.prototype.write = function write(data) {
  if (typeof data !== "string") {
    data = data.toString();
  }
  this.parser.push(data);
};

SaxLibxmljs.prototype.end = function end(data) {
  if (data) {
    this.write(data);
  }
};

module.exports = SaxLibxmljs;
