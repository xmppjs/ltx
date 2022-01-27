import assert from "assert";
import {
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
} from "../src/escape.js";

describe("escape", () => {
  describe("escapeXML", () => {
    it("escapes &", () => {
      assert.strictEqual(escapeXML("&"), "&amp;");
    });
    it("escapes <", () => {
      assert.strictEqual(escapeXML("<"), "&lt;");
    });
    it("escapes >", () => {
      assert.strictEqual(escapeXML(">"), "&gt;");
    });
    it('escapes "', () => {
      assert.strictEqual(escapeXML('"'), "&quot;");
    });
    it("escapes '", () => {
      assert.strictEqual(escapeXML("'"), "&apos;");
    });
  });
  describe("unescapeXML", () => {
    it("unescapes &", () => {
      assert.strictEqual(unescapeXML("&amp;"), "&");
    });
    it("unescapes <", () => {
      assert.strictEqual(unescapeXML("&lt;"), "<");
    });
    it("unescapes >", () => {
      assert.strictEqual(unescapeXML("&gt;"), ">");
    });
    it("unescapes ", () => {
      assert.strictEqual(unescapeXML("&quot;"), '"');
    });
    it("unescapes '", () => {
      assert.strictEqual(unescapeXML("&apos;"), "'");
    });
    it("throws on invalid entities", () => {
      assert.throws(
        () => unescapeXML("&foobar;"),
        Error,
        "Illegal XML entity &foobar;"
      );
    });
    it("unescapes numeric entities", () => {
      assert.strictEqual(unescapeXML("&#64;"), "@");
    });
    it("throws on invalid characters", () => {
      assert.throws(
        () => unescapeXML("&#0;"),
        Error,
        "Illegal XML character 0x0"
      );
    });
    it("unescapes hexadecimal entities", () => {
      assert.strictEqual(unescapeXML("&#x40;"), "@");
    });
    it("unescapes multibyte hex entities", () => {
      assert.strictEqual(unescapeXML("&#x1f40d;"), "\uD83D\uDC0D");
    });
    it("unescapes multibyte uppercase hex entities", () => {
      assert.strictEqual(unescapeXML("&#x1F40D;"), "\uD83D\uDC0D");
    });
    it("unescapes multibyte decimal entities", () => {
      assert.strictEqual(unescapeXML("&#128013;"), "\uD83D\uDC0D");
    });
  });
  describe("escapeXMLText", () => {
    it("escapes &", () => {
      assert.strictEqual(escapeXMLText("&"), "&amp;");
    });
    it("escapes <", () => {
      assert.strictEqual(escapeXMLText("<"), "&lt;");
    });
    it("escapes >", () => {
      assert.strictEqual(escapeXMLText(">"), "&gt;");
    });
  });
  describe("unescapeXMLText", () => {
    it("unescapes &", () => {
      assert.strictEqual(unescapeXMLText("&amp;"), "&");
    });
    it("unescapes <", () => {
      assert.strictEqual(unescapeXMLText("&lt;"), "<");
    });
    it("unescapes >", () => {
      assert.strictEqual(unescapeXMLText("&gt;"), ">");
    });
  });
});
