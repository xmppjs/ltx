import vows from "vows";
import assert from "assert";
import parsers from "../src/parsers.js";
import DOMElement from "../src/DOMElement.js";
import _parse from "../src/parse.js";

for (const Parser of parsers) {
  function parse(s) {
    return _parse(s, { Parser: Parser, Element: DOMElement });
  }
  vows
    .describe("Parsing returns DOMElement's")
    .addBatch({
      DOMElement: {
        "Returns DOMElement on parse": () => {
          const stanza =
            '<message><body xmlns="http://www.w3.org/1999/xhtml">' +
            "<p>DOM</p></body></message>";
          const el = parse(stanza);

          assert(el.getChild("body") instanceof DOMElement);
          assert.strictEqual(
            el.getChild("body").constructor.name,
            "DOMElement"
          );
          const body = el.getChild("body");
          assert.isDefined(body.localName);
          assert.strictEqual(body.localName, "body");

          assert.isDefined(body.namespaceURI);
          assert.strictEqual(body.namespaceURI, "http://www.w3.org/1999/xhtml");

          assert.isDefined(body.parentNode);
          assert.strictEqual(body.parentNode.getName(), "message");

          assert.isDefined(body.childNodes);
          assert.isArray(body.childNodes);
          assert.strictEqual(body.childNodes.length, 1);

          assert.isDefined(body.textContent);
          assert.strictEqual(body.textContent, "");

          assert.strictEqual(body.getChild("p").textContent, "DOM");
        },
      },
      createElement: {
        "create a new element and set children": () => {
          const c = new DOMElement("bar");
          const e = DOMElement.createElement("foo", { foo: "bar" }, "foo", c);
          assert(e instanceof DOMElement);
          assert.strictEqual(e.localName, "foo");
          assert.strictEqual(e.getAttribute("foo"), "bar");
          assert.strictEqual(e.childNodes.length, 2);
          assert.strictEqual(e.childNodes[0], "foo");
          assert.strictEqual(e.childNodes[1], c);
        },
      },
    })
    .run();
}
