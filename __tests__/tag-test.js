import assert from "assert";
import tag from "../src/tag.js";
import Element from "../src/Element.js";
import equal from "../src/equal.js";

describe("tag", () => {
  it("parses the string and return an Element object", () => {
    // var r = tag`<foo>${'bar'}</foo>`
    const r = tag(["<foo>", "</foo>"], "bar");
    assert(r instanceof Element);
    const c = new Element("foo").t("bar");
    assert(equal(c, r));
    assert(equal(r, c));
    assert.strictEqual(r.toString(), c.toString());
  });
  it("multiple substitutions", () => {
    // var r = tag`<foo a="${'b'}">${'bar'}</foo>`
    const r = tag(['<foo a="', '">', "</foo>"], "b", "bar");
    assert(r instanceof Element);
    const c = new Element("foo", { a: "b" }).t("bar");
    assert(equal(c, r));
    assert(equal(r, c));
    assert.strictEqual(r.toString(), c.toString());
  });
});
