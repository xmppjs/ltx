import assert from "assert";
import _parse from "../src/parse.js";
import LtxParser from "../src/parsers/ltx.js";
import h from "../src/createElement.js";
import Parser from "../src/Parser.js";

function parse(s) {
  return _parse(s, { Parser: LtxParser });
}

function parseChunks(chunks) {
  const p = new Parser();

  let result = null;
  let error = null;

  p.on("tree", (tree) => {
    result = tree;
  });
  p.on("error", (e) => {
    error = e;
  });

  for (const chunk of chunks) {
    p.write(chunk);
  }
  p.end();

  if (error) {
    throw error;
  } else {
    return result;
  }
}

describe("sax_ltx", () => {
  describe("CDATA parsing", () => {
    it("issue-19: parse CDATA content as text", () => {
      const el = parse("<root><![CDATA[Content]]></root>");
      assert.strictEqual(el.name, "root");
      assert.strictEqual(el.getText(), "Content");
    });
    it("do not unescape CDATA content", () => {
      const el = parse(
        '<root><![CDATA[Content &amp; "more content&quot;]]></root>'
      );
      assert.strictEqual(el.name, "root");
      assert.strictEqual(el.getText(), 'Content &amp; "more content&quot;');
    });
    it("issue-132", () => {
      const el = parse(
        "<a><b><![CDATA[]]></b><b><![CDATA[--><c>&d;]]></b></a>"
      );
      assert.deepStrictEqual(
        el,
        h("a", null, h("b", null, ""), h("b", null, "--><c>&d;"))
      );
    });
    it("split CDATA between chunks", () => {
      const el1 = parseChunks(["<root><![CDA", "TA[Content]]></root>"]);
      assert.strictEqual(el1.getText(), "Content");
      const el2 = parseChunks(["<root><![CDATA[Con", "tent]]></root>"]);
      assert.strictEqual(el2.getText(), "Content");
      const el3 = parseChunks(["<root><![CDATA[Content]]", "></root>"]);
      assert.strictEqual(el3.getText(), "Content");

      const str = "<root><![CDATA[Content]]></root>";
      for (let i = 0; i < str.length; i++) {
        const chunks = [
          str.slice(0, Math.max(0, i)) || "",
          str.slice(Math.max(0, i)) || "",
        ];
        assert.strictEqual(
          parseChunks(chunks).toString(),
          "<root>Content</root>"
        );
      }
    });
  });
});
