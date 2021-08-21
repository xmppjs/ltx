import { EventEmitter } from "events";
import expat from "node-expat";

class SaxExpat extends EventEmitter {
  constructor() {
    super();

    this.parser = new expat.Parser("UTF-8");

    this.parser.on("startElement", (name, attrs) => {
      this.emit("startElement", name, attrs);
    });
    this.parser.on("endElement", (name) => {
      this.emit("endElement", name);
    });
    this.parser.on("text", (str) => {
      this.emit("text", str);
    });

    // TODO: other events, esp. entityDecl (billion laughs!)
  }

  write(data) {
    if (!this.parser.parse(data, false)) {
      this.emit("error", new Error(this.parser.getError()));

      // Premature error thrown,
      // disable all functionality:
      this.write = function write() {};
      this.end = function end() {};
    }
  }

  end() {
    if (!this.parser.parse("", true)) {
      this.emit("error", new Error(this.parser.getError()));
    } else {
      this.emit("end");
    }
  }
}

export default SaxExpat;
