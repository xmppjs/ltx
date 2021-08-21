import { EventEmitter } from "events";
import saxes from "saxes";

class SaxSaxesjs extends EventEmitter {
  constructor() {
    super();
    this.parser = new saxes.SaxesParser({ fragment: true });

    this.parser.on("opentag", (a) => {
      this.emit("startElement", a.name, a.attributes);
    });
    this.parser.on("closetag", (el) => {
      this.emit("endElement", el.name);
    });
    this.parser.on("text", (str) => {
      this.emit("text", str);
    });
    this.parser.on("end", () => {
      this.emit("end");
    });
    this.parser.on("error", (e) => {
      this.emit("error", e);
    });
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

export default SaxSaxesjs;
