"use strict";

const inherits = require("inherits");
const Element = require("./Element");

function DOMElement(name, attrs) {
  Element.call(this, name, attrs);

  this.nodeType = 1;
  this.nodeName = this.localName;
}

inherits(DOMElement, Element);

DOMElement.prototype._getElement = function _getElement(name, attrs) {
  const element = new DOMElement(name, attrs);
  return element;
};

Object.defineProperty(DOMElement.prototype, "localName", {
  get: function () {
    return this.getName();
  },
});

Object.defineProperty(DOMElement.prototype, "namespaceURI", {
  get: function () {
    return this.getNS();
  },
});

Object.defineProperty(DOMElement.prototype, "parentNode", {
  get: function () {
    return this.parent;
  },
});

Object.defineProperty(DOMElement.prototype, "childNodes", {
  get: function () {
    return this.children;
  },
});

Object.defineProperty(DOMElement.prototype, "textContent", {
  get: function () {
    return this.getText();
  },
  set: function (value) {
    this.children.push(value);
  },
});

DOMElement.prototype.getElementsByTagName = function getElementsByTagName(
  name
) {
  return this.getChildren(name);
};

DOMElement.prototype.getAttribute = function getAttribute(name) {
  return this.getAttr(name);
};

DOMElement.prototype.setAttribute = function setAttribute(name, value) {
  this.attr(name, value);
};

DOMElement.prototype.getAttributeNS = function getAttributeNS(ns, name) {
  if (ns === "http://www.w3.org/XML/1998/namespace") {
    return this.getAttr(["xml", name].join(":"));
  }
  return this.getAttr(name, ns);
};

DOMElement.prototype.setAttributeNS = function setAttributeNS(ns, name, value) {
  let prefix;
  if (ns === "http://www.w3.org/XML/1998/namespace") {
    prefix = "xml";
  } else {
    const nss = this.getXmlns();
    prefix = nss[ns] || "";
  }
  if (prefix) {
    this.attr([prefix, name].join(":"), value);
  }
};

DOMElement.prototype.removeAttribute = function removeAttribute(name) {
  this.attr(name, null);
};

DOMElement.prototype.removeAttributeNS = function removeAttributeNS(ns, name) {
  let prefix;
  if (ns === "http://www.w3.org/XML/1998/namespace") {
    prefix = "xml";
  } else {
    const nss = this.getXmlns();
    prefix = nss[ns] || "";
  }
  if (prefix) {
    this.attr([prefix, name].join(":"), null);
  }
};

DOMElement.prototype.appendChild = function appendChild(el) {
  this.cnode(el);
};

DOMElement.prototype.removeChild = function removeChild(el) {
  this.remove(el);
};

DOMElement.createElement = function createElement(name, attrs, ...children) {
  const el = new DOMElement(name, attrs);

  for (const child of children) {
    // eslint-disable-next-line unicorn/prefer-dom-node-append
    el.appendChild(child);
  }
  return el;
};

module.exports = DOMElement;
