import vows from "vows";
import assert from "assert";
import tag from "../src/tag.js";
import stringify from "../src/stringify.js";

vows
  .describe("stringify")
  .addBatch({
    "returns the same result than .toString()": () => {
      const el = tag`
      <foo bar="foo">
        text
        <child foo="bar">
          text
          <self-closing/>
        </child>
      </foo>
    `;
      assert.strictEqual(el.toString(), stringify(el));
    },
    "while having entities in text, return the same result than .toString()":
      () => {
        const el = tag`
      <foo bar="foo">
        &gt;text
        <child foo="bar">
          &lt;text
          <self-closing/>
        </child>
      </foo>
    `;
        assert.strictEqual(el.toString(), stringify(el));
      },
    "while having entities in attribute, return the same result than .toString()":
      () => {
        const el = tag`
      <foo bar="&amp;foo">
        &gt;text
        <child foo="&amp;bar">
          &lt;text
          <self-closing/>
        </child>
      </foo>
    `;
        assert.strictEqual(el.toString(), stringify(el));
      },
    "indents correctly": () => {
      const el = tag`<foo><bar hello="world">text<self/></bar></foo>`;

      const expected = [
        "<foo>",
        '  <bar hello="world">',
        "    text",
        "    <self/>",
        "  </bar>",
        "</foo>",
      ].join("\n");

      assert.strictEqual(stringify(el, 2), expected);
      assert.strictEqual(stringify(el, "  "), expected);
    },
    "ignores empty string children": () => {
      const el = {
        name: "foo",
        attrs: {},
        children: ["", "bar", ""],
      };
      assert.strictEqual(stringify(el), "<foo>bar</foo>");
    },
    "ignores deep empty string children": () => {
      const el = {
        name: "foo",
        attrs: {},
        children: [
          "",
          {
            name: "bar",
            attrs: {},
            children: ["", "", ""],
          },
          "",
        ],
      };
      assert.strictEqual(stringify(el), "<foo><bar></bar></foo>");
    },
  })
  .run();
