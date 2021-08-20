"use strict";

const parse = require("./lib/parse");
const Parser = require("./lib/Parser");
const escape = require("./lib/escape");
const Element = require("./lib/Element");
const equal = require("./lib/equal");
const createElement = require("./lib/createElement");
const tag = require("./lib/tag");
const tagString = require("./lib/tagString");
const is = require("./lib/is");
const clone = require("./lib/clone");
const stringify = require("./lib/stringify");

exports = module.exports = function ltx(...args) {
  return tag(...args);
};

exports.Element = Element;

exports.equal = equal.equal;
exports.nameEqual = equal.name;
exports.attrsEqual = equal.attrs;
exports.childrenEqual = equal.children;

exports.isNode = is.isNode;
exports.isElement = is.isElement;
exports.isText = is.isText;

exports.clone = clone;
exports.createElement = createElement;

exports.escapeXML = escape.escapeXML;
exports.unescapeXML = escape.unescapeXML;
exports.escapeXMLText = escape.escapeXMLText;
exports.unescapeXMLText = escape.unescapeXMLText;

exports.Parser = Parser;
exports.parse = parse;

exports.tag = tag;
exports.tagString = tagString;

exports.stringify = stringify;
