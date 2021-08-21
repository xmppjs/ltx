import Element from "./Element.js";

class DOMElement extends Element {
  constructor(...args) {
    super(...args);
    this.nodeType = 1;
    this.nodeName = this.localName;
  }

  _getElement(name, attrs) {
    const element = new DOMElement(name, attrs);
    return element;
  }

  get localName() {
    return this.getName();
  }

  get namespaceURI() {
    return this.getNS();
  }

  get parentNode() {
    return this.parent;
  }

  get childNodes() {
    return this.children;
  }

  get textContent() {
    return this.getText();
  }

  set textContent(value) {
    this.children.push(value);
  }

  getElementsByTagName(name) {
    return this.getChildren(name);
  }

  getAttribute(name) {
    return this.getAttr(name);
  }

  setAttribute(name, value) {
    this.attr(name, value);
  }

  getAttributeNS(ns, name) {
    if (ns === "http://www.w3.org/XML/1998/namespace") {
      return this.getAttr(["xml", name].join(":"));
    }
    return this.getAttr(name, ns);
  }

  setAttributeNS(ns, name, value) {
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
  }

  removeAttribute(name) {
    this.attr(name, null);
  }

  removeAttributeNS(ns, name) {
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
  }

  appendChild(el) {
    this.cnode(el);
  }

  removeChild(el) {
    this.remove(el);
  }

  static createElement(name, attrs, ...children) {
    const el = new DOMElement(name, attrs);

    for (const child of children) {
      el.appendChild(child);
    }
    return el;
  }
}

export default DOMElement;
