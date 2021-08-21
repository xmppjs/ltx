import vows from "vows";
import assert from "assert";
import tag from "../lib/tag.js";
import Element from "../lib/Element.js";

vows
  .describe("tag")
  .addBatch({
    "parses the string and return an Element object": () => {
      // var r = tag`<foo>${'bar'}</foo>`
      const r = tag(["<foo>", "</foo>"], "bar");
      assert(r instanceof Element);
      const c = new Element("foo").t("bar");
      assert(c.equals(r));
      assert(r.equals(c));
      assert.strictEqual(r.toString(), c.toString());
    },
    "multiple substitutions": () => {
      // var r = tag`<foo a="${'b'}">${'bar'}</foo>`
      const r = tag(['<foo a="', '">', "</foo>"], "b", "bar");
      assert(r instanceof Element);
      const c = new Element("foo", { a: "b" }).t("bar");
      assert(c.equals(r));
      assert(r.equals(c));
      assert.strictEqual(r.toString(), c.toString());
    },
  })
  .run();
