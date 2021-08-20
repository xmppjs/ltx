"use strict";

const vows = require("vows");
const assert = require("assert");
const ltx = require("..");
const { isNode, isElement, isText } = require("../lib/is");
const { Element } = ltx;

vows
  .describe("isNode")
  .addBatch({
    isNode: {
      "exported correctly": function () {
        assert.strictEqual(ltx.isNode, isNode);
      },
      "returns true for Element": function () {
        assert.strictEqual(isNode(new Element()), true);
      },
      "returns true for strings": function () {
        assert.strictEqual(isNode("string"), true);
      },
      "returns false for anything else": function () {
        for (const value of [123, null, undefined, {}, [], true]) {
          assert.strictEqual(isNode(value), false);
        }
      },
    },
    isElement: {
      "exported correctly": function () {
        assert.strictEqual(ltx.isElement, isElement);
      },
      "returns true for Element": function () {
        assert.strictEqual(isElement(new Element()), true);
      },
      "returns false for anything else": function () {
        for (const value of [123, null, undefined, {}, "string", [], true]) {
          assert.strictEqual(isElement(value), false);
        }
      },
    },
    isText: {
      "exported correctly": function () {
        assert.strictEqual(ltx.isText, isText);
      },
      "returns true for strings": function () {
        assert.strictEqual(isText("foo"), true);
      },
      "returns false for anything else": function () {
        for (const value of [123, null, undefined, {}, Element, [], true]) {
          assert.strictEqual(isText(value), false);
        }
      },
    },
  })
  .export(module);
