import { EventEmitter } from "events";
import Element from "./Element.js";
import LtxParser from "./parsers/ltx.js";

class Parser extends EventEmitter {
  constructor(options) {
    super();

    const ParserInterface = (this.Parser =
      (options && options.Parser) || this.DefaultParser);
    const ElementInterface = (this.Element =
      (options && options.Element) || this.DefaultElement);

    this.parser = new ParserInterface();

    let el;
    this.parser.on("startElement", (name, attrs) => {
      const child = new ElementInterface(name, attrs);
      el = !el ? child : el.cnode(child);
    });
    this.parser.on("endElement", (name) => {
      if (!el) {
        /* Err */
      } else if (name === el.name) {
        if (el.parent) {
          el = el.parent;
        } else if (!this.tree) {
          this.tree = el;
          el = undefined;
        }
      }
    });
    this.parser.on("text", (str) => {
      if (el) {
        el.t(str);
      }
    });
    this.parser.on("error", (e) => {
      this.error = e;
      this.emit("error", e);
    });
  }

  write(data) {
    this.parser.write(data);
  }

  end(data) {
    this.parser.end(data);

    if (!this.error) {
      if (this.tree) {
        this.emit("tree", this.tree);
      } else {
        this.emit("error", new Error("Incomplete document"));
      }
    }
  }
}

Parser.prototype.DefaultParser = LtxParser;
Parser.prototype.DefaultElement = Element;

export default Parser;
