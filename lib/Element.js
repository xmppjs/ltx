"use strict";

const escape = require("./escape");
const { escapeXML } = escape;
const { escapeXMLText } = escape;

const equality = require("./equal");
const {
  equal,
  name: nameEqual,
  attrs: attrsEqual,
  children: childrenEqual,
} = equality;

const _clone = require("./clone");

/**
 * Element
 *
 * Attributes are in the element.attrs object. Children is a list of
 * either other Elements or Strings for text content.
 **/
function Element(name, attrs) {
  this.name = name;
  this.parent = null;
  this.children = [];
  this.attrs = {};
  this.setAttrs(attrs);
}

/* Accessors */

/**
 * if (element.is('message', 'jabber:client')) ...
 **/
Element.prototype.is = function is(name, xmlns) {
  return this.getName() === name && (!xmlns || this.getNS() === xmlns);
};

/* without prefix */
Element.prototype.getName = function getName() {
  return this.name.includes(":")
    ? this.name.slice(this.name.indexOf(":") + 1)
    : this.name;
};

/**
 * retrieves the namespace of the current element, upwards recursively
 **/
Element.prototype.getNS = function getNS() {
  if (this.name.includes(":")) {
    const prefix = this.name.slice(0, Math.max(0, this.name.indexOf(":")));
    return this.findNS(prefix);
  }
  return this.findNS();
};

/**
 * find the namespace to the given prefix, upwards recursively
 **/
Element.prototype.findNS = function findNS(prefix) {
  if (!prefix) {
    /* default namespace */
    if (this.attrs.xmlns) {
      return this.attrs.xmlns;
    } else if (this.parent) {
      return this.parent.findNS();
    }
  } else {
    /* prefixed namespace */
    const attr = "xmlns:" + prefix;
    if (this.attrs[attr]) {
      return this.attrs[attr];
    } else if (this.parent) {
      return this.parent.findNS(prefix);
    }
  }
};

/**
 * Recursiverly gets all xmlns defined, in the form of {url:prefix}
 **/
Element.prototype.getXmlns = function getXmlns() {
  let namespaces = {};

  if (this.parent) {
    namespaces = this.parent.getXmlns();
  }

  for (const attr in this.attrs) {
    const m = attr.match("xmlns:?(.*)");
    // eslint-disable-next-line  no-prototype-builtins
    if (this.attrs.hasOwnProperty(attr) && m) {
      namespaces[this.attrs[attr]] = m[1];
    }
  }
  return namespaces;
};

Element.prototype.setAttrs = function setAttrs(attrs) {
  if (typeof attrs === "string") {
    this.attrs.xmlns = attrs;
  } else if (attrs) {
    Object.assign(this.attrs, attrs);
  }
};

/**
 * xmlns can be null, returns the matching attribute.
 **/
Element.prototype.getAttr = function getAttr(name, xmlns) {
  if (!xmlns) {
    return this.attrs[name];
  }

  const namespaces = this.getXmlns();

  if (!namespaces[xmlns]) {
    return null;
  }

  return this.attrs[[namespaces[xmlns], name].join(":")];
};

/**
 * xmlns can be null
 **/
Element.prototype.getChild = function getChild(name, xmlns) {
  return this.getChildren(name, xmlns)[0];
};

/**
 * xmlns can be null
 **/
Element.prototype.getChildren = function getChildren(name, xmlns) {
  const result = [];
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i];
    if (
      child.getName &&
      child.getName() === name &&
      (!xmlns || child.getNS() === xmlns)
    ) {
      result.push(child);
    }
  }
  return result;
};

/**
 * xmlns and recursive can be null
 **/
Element.prototype.getChildByAttr = function getChildByAttr(
  attr,
  val,
  xmlns,
  recursive
) {
  return this.getChildrenByAttr(attr, val, xmlns, recursive)[0];
};

/**
 * xmlns and recursive can be null
 **/
Element.prototype.getChildrenByAttr = function getChildrenByAttr(
  attr,
  val,
  xmlns,
  recursive
) {
  let result = [];
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i];
    if (
      child.attrs &&
      child.attrs[attr] === val &&
      (!xmlns || child.getNS() === xmlns)
    ) {
      result.push(child);
    }
    if (recursive && child.getChildrenByAttr) {
      result.push(child.getChildrenByAttr(attr, val, xmlns, true));
    }
  }
  if (recursive) {
    result = result.flat();
  }
  return result;
};

Element.prototype.getChildrenByFilter = function getChildrenByFilter(
  filter,
  recursive
) {
  let result = [];
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i];
    if (filter(child)) {
      result.push(child);
    }
    if (recursive && child.getChildrenByFilter) {
      result.push(child.getChildrenByFilter(filter, true));
    }
  }
  if (recursive) {
    result = result.flat();
  }
  return result;
};

Element.prototype.getText = function getText() {
  let text = "";
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i];
    if (typeof child === "string" || typeof child === "number") {
      text += child;
    }
  }
  return text;
};

Element.prototype.getChildText = function getChildText(name, xmlns) {
  const child = this.getChild(name, xmlns);
  return child ? child.getText() : null;
};

/**
 * Return all direct descendents that are Elements.
 * This differs from `getChildren` in that it will exclude text nodes,
 * processing instructions, etc.
 */
Element.prototype.getChildElements = function getChildElements() {
  return this.getChildrenByFilter((child) => {
    return child instanceof Element;
  });
};

/* Builder */

/** returns uppermost parent */
Element.prototype.root = function root() {
  if (this.parent) {
    return this.parent.root();
  }
  return this;
};
Element.prototype.tree = Element.prototype.root;

/** just parent or itself */
Element.prototype.up = function up() {
  if (this.parent) {
    return this.parent;
  }
  return this;
};

/** create child node and return it */
Element.prototype.c = function c(name, attrs) {
  return this.cnode(new Element(name, attrs));
};

Element.prototype.cnode = function cnode(child) {
  this.children.push(child);
  if (typeof child === "object") {
    child.parent = this;
  }
  return child;
};

/** add text node and return element */
Element.prototype.t = function t(text) {
  this.children.push(text);
  return this;
};

/* Manipulation */

/**
 * Either:
 *   el.remove(childEl)
 *   el.remove('author', 'urn:...')
 */
Element.prototype.remove = function remove(el, xmlns) {
  const filter =
    typeof el === "string"
      ? (child) => {
          return !(child.is && child.is(el, xmlns));
        }
      : (child) => {
          return child !== el;
        };

  // eslint-disable-next-line unicorn/no-array-callback-reference
  this.children = this.children.filter(filter);

  return this;
};

Element.prototype.clone = function clone() {
  return _clone(this);
};

Element.prototype.text = function text(val) {
  if (val && this.children.length === 1) {
    this.children[0] = val;
    return this;
  }
  return this.getText();
};

Element.prototype.attr = function attr(attr, val) {
  if (typeof val !== "undefined" || val === null) {
    if (!this.attrs) {
      this.attrs = {};
    }
    this.attrs[attr] = val;
    return this;
  }
  return this.attrs[attr];
};

/* Serialization */

Element.prototype.toString = function toString() {
  let s = "";
  this.write((c) => {
    s += c;
  });
  return s;
};

Element.prototype.toJSON = function toJSON() {
  return {
    name: this.name,
    attrs: this.attrs,
    children: this.children.map((child) => {
      return child && child.toJSON ? child.toJSON() : child;
    }),
  };
};

Element.prototype._addChildren = function _addChildren(writer) {
  writer(">");
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i];
    /* Skip null/undefined */
    if (child || child === 0) {
      if (child.write) {
        child.write(writer);
      } else if (typeof child === "string") {
        writer(escapeXMLText(child));
      } else if (child.toString) {
        writer(escapeXMLText(child.toString(10)));
      }
    }
  }
  writer("</");
  writer(this.name);
  writer(">");
};

Element.prototype.write = function write(writer) {
  writer("<");
  writer(this.name);
  for (const k in this.attrs) {
    let v = this.attrs[k];
    if (v != null) {
      // === null || undefined
      writer(" ");
      writer(k);
      writer('="');
      if (typeof v !== "string") {
        v = v.toString();
      }
      writer(escapeXML(v));
      writer('"');
    }
  }
  if (this.children.length === 0) {
    writer("/>");
  } else {
    this._addChildren(writer);
  }
};

Element.prototype.nameEquals = function nameEquals(el) {
  return nameEqual(this, el);
};

Element.prototype.attrsEquals = function attrsEquals(el) {
  return attrsEqual(this, el);
};

Element.prototype.childrenEquals = function childrenEquals(el) {
  return childrenEqual(this, el);
};

Element.prototype.equals = function equals(el) {
  return equal(this, el);
};

module.exports = Element;
