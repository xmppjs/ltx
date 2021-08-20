"use strict";

const vows = require("vows");
const assert = require("assert");
const ltx = require("../index");
const { Element } = ltx;
const { nameEqual } = ltx;
const { attrsEqual } = ltx;
const { childrenEqual } = ltx;
const { equal } = ltx;

vows
  .describe("equality")
  .addBatch({
    nameEqual: {
      "it returns true if elements name are equal": function () {
        const a = new Element("foo");
        const b = new Element("foo");
        assert.strictEqual(nameEqual(a, b), true);

        const c = new Element("foo:bar");
        const d = new Element("foo:bar");
        assert.strictEqual(nameEqual(c, d), true);
      },
      "it returns false if elements name differ": function () {
        const a = new Element("foo");
        const b = new Element("bar");
        assert.strictEqual(nameEqual(a, b), false);

        const c = new Element("foo:bar");
        const d = new Element("bar:bar");
        assert.strictEqual(nameEqual(c, d), false);

        const e = new Element("foo:bar");
        const f = new Element("foo:foo");
        assert.strictEqual(nameEqual(e, f), false);
      },
    },
    attrsEqual: {
      "it returns true if elements attributes are equal": function () {
        const a = new Element("foo", { a: "b", b: "c" });
        const b = new Element("foo", { a: "b", b: "c" });
        assert.strictEqual(attrsEqual(a, b), true);

        const c = new Element("foo", { a: "b", b: "c" });
        const d = new Element("foo", { b: "c", a: "b" });
        assert.strictEqual(attrsEqual(c, d), true);
      },
      "it returns true if elements attributes are serialized equaly":
        function () {
          const a = new Element("foo", { foo: "false" });
          const b = new Element("foo", { foo: false });
          assert.strictEqual(attrsEqual(a, b), true);

          const c = new Element("foo", { foo: "0" });
          const d = new Element("foo", { foo: 0 });
          assert.strictEqual(attrsEqual(c, d), true);

          const foo = {
            toString: function () {
              return "hello";
            },
          };
          const e = new Element("foo", { foo: foo });
          const f = new Element("foo", { foo: "hello" });
          assert.strictEqual(attrsEqual(e, f), true);
        },
      "it returns false if elements attributes differ": function () {
        const a = new Element("foo", { a: "b" });
        const b = new Element("foo");
        assert.strictEqual(attrsEqual(a, b), false);

        const c = new Element("foo");
        const d = new Element("foo", { a: "b" });
        assert.strictEqual(attrsEqual(c, d), false);

        const e = new Element("foo", { b: "a" });
        const f = new Element("foo", { a: "b" });
        assert.strictEqual(attrsEqual(e, f), false);

        const g = new Element("foo", { foo: "bar" });
        const h = new Element("foo", { bar: "bar" });
        assert.strictEqual(attrsEqual(g, h), false);
      },
    },
    childrenEqual: {
      "it returns true if elements children are equal": function () {
        const a = new Element("foo").c("bar").up().c("foo").root();
        assert.strictEqual(childrenEqual(a, a), true);

        const b = new Element("foo").c("bar").up().c("foo").root();
        assert.strictEqual(childrenEqual(a, b), true);
      },
      "it returns false if elements children name differ": function () {
        const a = new Element("foo").c("bar").root();
        const b = new Element("foo").c("foo").root();
        assert.strictEqual(childrenEqual(a, b), false);
      },
      "it returns false if elements children attrs differ": function () {
        const a = new Element("foo").c("foo", { foo: "bar" }).root();
        const b = new Element("foo").c("foo", { bar: "foo" }).root();
        assert.strictEqual(childrenEqual(a, b), false);
      },
      "it returns false if elements children order differ": function () {
        const a = new Element("foo").c("foo").up().c("bar").root();
        const b = new Element("foo").c("bar").up().c("foo").root();
        assert.strictEqual(childrenEqual(a, b), false);
      },
    },
    equal: {
      "it returns true if elements are equal": function () {
        const a = new Element("a", { foo: "bar" }).c("hello").root();
        assert.strictEqual(equal(a, a), true);
        const b = new Element("a", { foo: "bar" }).c("hello").root();
        assert.strictEqual(equal(a, b), true);
      },
      "it returns false if elements name differ": function () {
        const a = new Element("foo");
        const b = new Element("bar");
        assert.strictEqual(equal(a, b), false);
      },
      "it returns false if elements attrs differ": function () {
        const a = new Element("foo", { foo: "bar" });
        const b = new Element("foo");
        assert.strictEqual(equal(a, b), false);
      },
      "it returns false if elements children differ": function () {
        const a = new Element("foo").c("foo").root();
        const b = new Element("foo").c("bar").root();
        assert.strictEqual(equal(a, b), false);
      },
    },
  })
  .export(module);
