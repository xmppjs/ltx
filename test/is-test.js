import vows from "vows";
import assert from "assert";
import { isNode, isElement, isText } from "../src/is.js";
import Element from "../src/Element.js";

vows.describe("isNode").addBatch({
  isNode: {
    "returns true for Element": () => {
      assert.strictEqual(isNode(new Element()), true);
    },
    "returns true for strings": () => {
      assert.strictEqual(isNode("string"), true);
    },
    "returns false for anything else": () => {
      for (const value of [123, null, undefined, {}, [], true]) {
        assert.strictEqual(isNode(value), false);
      }
    },
  },
  isElement: {
    "returns true for Element": () => {
      assert.strictEqual(isElement(new Element()), true);
    },
    "returns false for anything else": () => {
      for (const value of [123, null, undefined, {}, "string", [], true]) {
        assert.strictEqual(isElement(value), false);
      }
    },
  },
  isText: {
    "returns true for strings": () => {
      assert.strictEqual(isText("foo"), true);
    },
    "returns false for anything else": () => {
      for (const value of [123, null, undefined, {}, Element, [], true]) {
        assert.strictEqual(isText(value), false);
      }
    },
  },
}).run;
