import { escapeXML, escapeXMLText } from "./escape.js";

/**
 * Element
 *
 * Attributes are in the element.attrs object. Children is a list of
 * either other Elements or Strings for text content.
 **/
class Element {
  constructor(name, attrs) {
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
  is(name, xmlns) {
    return this.getName() === name && (!xmlns || this.getNS() === xmlns);
  }

  /* without prefix */
  getName() {
    const idx = this.name.indexOf(":");
    return idx >= 0 ? this.name.slice(idx + 1) : this.name;
  }

  /**
   * retrieves the namespace of the current element, upwards recursively
   **/
  getNS() {
    const idx = this.name.indexOf(":");
    if (idx >= 0) {
      const prefix = this.name.slice(0, idx);
      return this.findNS(prefix);
    }
    return this.findNS();
  }

  /**
   * find the namespace to the given prefix, upwards recursively
   **/
  findNS(prefix) {
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
  }

  /**
   * Recursiverly gets all xmlns defined, in the form of {url:prefix}
   **/
  getXmlns() {
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
  }

  setAttrs(attrs) {
    if (typeof attrs === "string") {
      this.attrs.xmlns = attrs;
    } else if (attrs) {
      Object.assign(this.attrs, attrs);
    }
  }

  /**
   * xmlns can be null, returns the matching attribute.
   **/
  getAttr(name, xmlns) {
    if (!xmlns) {
      return this.attrs[name];
    }

    const namespaces = this.getXmlns();

    if (!namespaces[xmlns]) {
      return null;
    }

    return this.attrs[[namespaces[xmlns], name].join(":")];
  }

  /**
   * xmlns can be null
   **/
  getChild(name, xmlns) {
    return this.getChildren(name, xmlns)[0];
  }

  /**
   * xmlns can be null
   **/
  getChildren(name, xmlns) {
    const result = [];
    for (const child of this.children) {
      if (
        child.getName &&
        child.getName() === name &&
        (!xmlns || child.getNS() === xmlns)
      ) {
        result.push(child);
      }
    }
    return result;
  }

  /**
   * xmlns and recursive can be null
   **/
  getChildByAttr(attr, val, xmlns, recursive) {
    return this.getChildrenByAttr(attr, val, xmlns, recursive)[0];
  }

  /**
   * xmlns and recursive can be null
   **/
  getChildrenByAttr(attr, val, xmlns, recursive) {
    let result = [];
    for (const child of this.children) {
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
  }

  getChildrenByFilter(filter, recursive) {
    let result = [];
    for (const child of this.children) {
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
  }

  getText() {
    let text = "";
    for (const child of this.children) {
      if (typeof child === "string" || typeof child === "number") {
        text += child;
      }
    }
    return text;
  }

  getChildText(name, xmlns) {
    const child = this.getChild(name, xmlns);
    return child ? child.getText() : null;
  }

  /**
   * Return all direct descendents that are Elements.
   * This differs from `getChildren` in that it will exclude text nodes,
   * processing instructions, etc.
   */
  getChildElements() {
    return this.getChildrenByFilter((child) => {
      return child instanceof Element;
    });
  }

  /* Builder */

  /** returns uppermost parent */
  root() {
    if (this.parent) {
      return this.parent.root();
    }
    return this;
  }

  /** just parent or itself */
  up() {
    if (this.parent) {
      return this.parent;
    }
    return this;
  }

  /** create child node and return it */
  c(name, attrs) {
    return this.cnode(new Element(name, attrs));
  }

  cnode(child) {
    this.children.push(child);
    if (typeof child === "object") {
      child.parent = this;
    }
    return child;
  }

  append(...nodes) {
    for (const node of nodes) {
      this.children.push(node);
      if (typeof node === "object") {
        node.parent = this;
      }
    }
  }

  prepend(...nodes) {
    for (const node of nodes) {
      this.children.unshift(node);
      if (typeof node === "object") {
        node.parent = this;
      }
    }
  }

  /** add text node and return element */
  t(text) {
    this.children.push(text);
    return this;
  }

  /* Manipulation */

  /**
   * Either:
   *   el.remove(childEl)
   *   el.remove('author', 'urn:...')
   */
  remove(el, xmlns) {
    const filter =
      typeof el === "string"
        ? (child) => {
            /* 1st parameter is tag name */
            return !(child.is && child.is(el, xmlns));
          }
        : (child) => {
            /* 1st parameter is element */
            return child !== el;
          };

    this.children = this.children.filter(filter);

    return this;
  }

  text(val) {
    if (val && this.children.length === 1) {
      this.children[0] = val;
      return this;
    }
    return this.getText();
  }

  attr(attr, val) {
    if (typeof val !== "undefined" || val === null) {
      if (!this.attrs) {
        this.attrs = {};
      }
      this.attrs[attr] = val;
      return this;
    }
    return this.attrs[attr];
  }

  /* Serialization */

  toString() {
    let s = "";
    this.write((c) => {
      s += c;
    });
    return s;
  }

  _addChildren(writer) {
    writer(">");
    for (const child of this.children) {
      /* Skip null/undefined */
      if (child != null) {
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
  }

  write(writer) {
    writer("<");
    writer(this.name);
    for (const k in this.attrs) {
      const v = this.attrs[k];
      // === null || undefined
      if (v != null) {
        writer(" ");
        writer(k);
        writer('="');
        writer(escapeXML(typeof v === "string" ? v : v.toString(10)));
        writer('"');
      }
    }
    if (this.children.length === 0) {
      writer("/>");
    } else {
      this._addChildren(writer);
    }
  }
}

Element.prototype.tree = Element.prototype.root;

export default Element;
