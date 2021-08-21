import { EventEmitter } from "events";
import xml from "node-xml";
import { unescapeXML } from "../escape.js";

/**
 * This cannot be used as long as node-xml starts parsing only after
 * setTimeout(f, 0)
 */
class SaxNodeXML extends EventEmitter {
  constructor() {
    super();
    this.parser = new xml.SaxParser((handler) => {
      handler.onStartElementNS((elem, attrs, prefix, uri, namespaces) => {
        let i;
        const attrsHash = {};
        if (prefix) {
          elem = prefix + ":" + elem;
        }
        for (i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          attrsHash[attr[0]] = unescapeXML(attr[1]);
        }
        for (i = 0; i < namespaces.length; i++) {
          const namespace = namespaces[i];
          const k = !namespace[0] ? "xmlns" : "xmlns:" + namespace[0];
          attrsHash[k] = unescapeXML(namespace[1]);
        }
        this.emit("startElement", elem, attrsHash);
      });
      handler.onEndElementNS((elem, prefix) => {
        if (prefix) {
          elem = prefix + ":" + elem;
        }
        this.emit("endElement", elem);
      });
      handler.onCharacters((str) => {
        this.emit("text", str);
      });
      handler.onCdata((str) => {
        this.emit("text", str);
      });
      handler.onError((e) => {
        this.emit("error", e);
      });
      // TODO: other events, esp. entityDecl (billion laughs!)
    });
  }

  write(data) {
    this.parser.parseString(data);
  }

  end(data) {
    if (data) {
      this.write(data);
    }
  }
}

export default SaxNodeXML;
