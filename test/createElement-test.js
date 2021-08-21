import vows from "vows";
import assert from "assert";
import Element from "../src/Element.js";
import createElement from "../src/createElement.js";

vows
  .describe("createElement")
  .addBatch({
    "create a new element and set children": () => {
      const c = new Element("bar");
      const e = createElement("foo", { foo: "bar" }, "foo", c);
      assert(e instanceof Element);
      assert(e.is("foo"));
      assert.strictEqual(e.attrs.foo, "bar");
      assert.strictEqual(e.children.length, 2);
      assert.strictEqual(e.children[0], "foo");
      assert.strictEqual(e.children[1], c);
    },
    "null and undefined children are discarded": () => {
      const e = createElement(
        "foo",
        null,
        undefined,
        "bar",
        null,
        createElement("test"),
        "baz"
      );
      const b = new Element("foo").t("bar").c("test").up().t("baz");
      assert.strictEqual(e.root().toString(), b.root().toString());
    },
    "boolean children are discarded": () => {
      assert.deepEqual(
        createElement("foo", null, true, false),
        new Element("foo")
      );
    },
    "falsy numbers": () => {
      assert.deepEqual(
        createElement("foo", null, -1, 0, 1).toString(),
        "<foo>-101</foo>"
      );
    },
    "__source and __self attributes are discarded": () => {
      const e = createElement("foo", {
        __self: "foo",
        __source: "bar",
        foo: "bar",
      });
      assert.equal(e.attrs.__self, undefined);
      assert.equal(e.attrs.__source, undefined);
      assert.equal(e.attrs.foo, "bar");
    },
    "children array": () => {
      assert.deepEqual(
        createElement("bar", null, "foo", [
          "foo",
          ["foo", ["foo"]],
          "foo",
        ]).toString(),
        "<bar>foofoofoofoofoo</bar>"
      );
    },
    "null and undefined attributes are discarded": () => {
      const e = createElement("foo", { foo: null, bar: undefined });
      assert.deepEqual(e.attrs, {});
    },
    "number attribute are converted to string": () => {
      const e = createElement("foo", { foo: 1 });
      assert.deepEqual(e.attrs, { foo: "1" });
    },
  })
  .run();
