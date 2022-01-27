import assert from "assert";
import parsers from "../src/parsers.js";
import DOMElement from "../src/DOMElement.js";
import _parse from "../src/parse.js";

for (const Parser of parsers) {
  // eslint-disable-next-line no-inner-declarations
  function parse(s) {
    return _parse(s, { Parser: Parser, Element: DOMElement });
  }
  describe("Parsing returns DOMElement's", () => {
    it("Returns DOMElement on parse", () => {
      const stanza =
        '<message><body xmlns="http://www.w3.org/1999/xhtml">' +
        "<p>DOM</p></body></message>";
      const el = parse(stanza);

      assert(el.getChild("body") instanceof DOMElement);
      assert.strictEqual(el.getChild("body").constructor.name, "DOMElement");
      const body = el.getChild("body");
      expect(body.localName).toBeDefined();
      assert.strictEqual(body.localName, "body");

      expect(body.namespaceURI).toBeDefined();
      assert.strictEqual(body.namespaceURI, "http://www.w3.org/1999/xhtml");

      expect(body.parentNode).toBeDefined();
      assert.strictEqual(body.parentNode.getName(), "message");

      expect(body.childNodes).toBeDefined();
      expect(body.childNodes).toBeInstanceOf(Array);
      assert.strictEqual(body.childNodes.length, 1);

      expect(body.textContent).toBeDefined();
      assert.strictEqual(body.textContent, "");

      assert.strictEqual(body.getChild("p").textContent, "DOM");
    });
    it("createElement:  create a new element and set children", () => {
      const c = new DOMElement("bar");
      const e = DOMElement.createElement("foo", { foo: "bar" }, "foo", c);
      assert(e instanceof DOMElement);
      assert.strictEqual(e.localName, "foo");
      assert.strictEqual(e.getAttribute("foo"), "bar");
      assert.strictEqual(e.childNodes.length, 2);
      assert.strictEqual(e.childNodes[0], "foo");
      assert.strictEqual(e.childNodes[1], c);
    });
  });
}
