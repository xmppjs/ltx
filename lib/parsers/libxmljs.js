import { EventEmitter } from "events";
import libxmljs from "libxmljs";

class SaxLibxmljs extends EventEmitter {
  constructor() {
    super();
    this.parser = new libxmljs.SaxPushParser();

    this.parser.on("startElementNS", (name, attrs, prefix, uri, nss) => {
      const a = {};
      for (const attr of attrs) {
        let name = attr[0];
        if (attr[1]) name = attr[1] + ":" + name;
        a[name] = attr[3];
      }
      for (const ns of nss) {
        let name = "xmlns";
        if (ns[0] !== null) {
          name += ":" + ns[0];
        }
        a[name] = ns[1];
      }
      this.emit("startElement", (prefix ? prefix + ":" : "") + name, a);
    });

    this.parser.on("endElementNS", (name, prefix) => {
      this.emit("endElement", (prefix ? prefix + ":" : "") + name);
    });

    this.parser.on("characters", (str) => {
      this.emit("text", str);
    });

    this.parser.on("cadata", (str) => {
      this.emit("text", str);
    });

    this.parser.on("error", (err) => {
      this.emit("error", err);
    });
  }

  write(data) {
    if (typeof data !== "string") {
      data = data.toString();
    }
    this.parser.push(data);
  }

  end(data) {
    if (data) {
      this.write(data);
    }
  }
}

export default SaxLibxmljs;
