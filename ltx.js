import parse from "./lib/parse.js";
import Parser from "./lib/Parser.js";
import {
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
} from "./lib/escape.js";
import Element from "./lib/Element.js";
import equal, { nameEqual, attrsEqual, childrenEqual } from "./lib/equal.js";
import createElement from "./lib/createElement.js";
import tag from "./lib/tag.js";
import tagString from "./lib/tagString.js";
import { isNode, isElement, isText } from "./lib/is.js";
import clone from "./lib/clone.js";
import stringify from "./lib/stringify.js";

export default function ltx(...args) {
  return tag(...args);
}

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
};
