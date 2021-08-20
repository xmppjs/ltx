"use strict";

const vows = require("vows");
const assert = require("assert");
const ltx = require("..");
const { Element } = ltx;
const { createElement } = ltx;

vows
  .describe("createElement")
  .addBatch({
    "create a new element and set children": function () {
      const c = new Element("bar");
      const e = createElement("foo", { foo: "bar" }, "foo", c);
      assert(e instanceof Element);
      assert(e.is("foo"));
      assert.strictEqual(e.attrs.foo, "bar");
      assert.strictEqual(e.children.length, 2);
      assert.strictEqual(e.children[0], "foo");
      assert.strictEqual(e.children[1], c);
    },
    "null and undefined children are discarded": function () {
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
  })
  .export(module);
