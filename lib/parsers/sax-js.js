import { EventEmitter } from "events";
import sax from "sax";

class SaxSaxjs extends EventEmitter {
  constructor() {
    super();
    this.parser = sax.parser(true);

    this.parser.onopentag = (a) => {
      this.emit("startElement", a.name, a.attributes);
    };
    this.parser.onclosetag = (name) => {
      this.emit("endElement", name);
    };
    this.parser.ontext = (str) => {
      this.emit("text", str);
    };
    this.parser.onend = () => {
      this.emit("end");
    };
    this.parser.onerror = (e) => {
      this.emit("error", e);
    };
  }

  write(data) {
    if (typeof data !== "string") {
      data = data.toString();
    }
    this.parser.write(data);
  }

  end(data) {
    if (data) {
      this.parser.write(data);
    }
    this.parser.close();
  }
}

export default SaxSaxjs;
