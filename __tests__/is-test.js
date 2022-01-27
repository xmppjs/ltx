import assert from "assert";
import { isNode, isElement, isText } from "../src/is.js";
import Element from "../src/Element.js";

describe("isNode", () => {
  describe("isNode", () => {
    it("returns true for Element", () => {
      assert.strictEqual(isNode(new Element()), true);
    });
    it("returns true for strings", () => {
      assert.strictEqual(isNode("string"), true);
    });
    it("returns false for anything else", () => {
      for (const value of [123, null, undefined, {}, [], true]) {
        assert.strictEqual(isNode(value), false);
      }
    });
  });
  describe("isElement", () => {
    it("returns true for Element", () => {
      assert.strictEqual(isElement(new Element()), true);
    });
    it("returns false for anything else", () => {
      for (const value of [123, null, undefined, {}, "string", [], true]) {
        assert.strictEqual(isElement(value), false);
      }
    });
  });
  describe("isText", () => {
    it("returns true for strings", () => {
      assert.strictEqual(isText("foo"), true);
    });
    it("returns false for anything else", () => {
      for (const value of [123, null, undefined, {}, Element, [], true]) {
        assert.strictEqual(isText(value), false);
      }
    });
  });
});
