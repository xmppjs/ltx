import parse from "./parse.js";
import Parser from "./Parser.js";
import {
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
} from "./escape.js";
import Element from "./Element.js";
import equal, { nameEqual, attrsEqual, childrenEqual } from "./equal.js";
import createElement from "./createElement.js";
import tag from "./tag.js";
import tagString from "./tagString.js";
import { isNode, isElement, isText } from "./is.js";
import clone from "./clone.js";
import stringify from "./stringify.js";
import JSONify from "./JSONify.js";

export {
  Element,
  equal,
  nameEqual,
  attrsEqual,
  childrenEqual,
  isNode,
  isElement,
  isText,
  clone,
  createElement,
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
  Parser,
  parse,
  tag,
  tagString,
  stringify,
  JSONify,
};
