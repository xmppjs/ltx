import vows from "vows";
import assert from "assert";
import {
  escapeXML,
  unescapeXML,
  escapeXMLText,
  unescapeXMLText,
} from "../ltx.js";

vows
  .describe("escape")
  .addBatch({
    escapeXML: {
      "escapes &": () => {
        assert.strictEqual(escapeXML("&"), "&amp;");
      },
      "escapes <": () => {
        assert.strictEqual(escapeXML("<"), "&lt;");
      },
      "escapes >": () => {
        assert.strictEqual(escapeXML(">"), "&gt;");
      },
      'escapes "': () => {
        assert.strictEqual(escapeXML('"'), "&quot;");
      },
      "escapes '": () => {
        assert.strictEqual(escapeXML("'"), "&apos;");
      },
    },
    unescapeXML: {
      "unescapes &": () => {
        assert.strictEqual(unescapeXML("&amp;"), "&");
      },
      "unescapes <": () => {
        assert.strictEqual(unescapeXML("&lt;"), "<");
      },
      "unescapes >": () => {
        assert.strictEqual(unescapeXML("&gt;"), ">");
      },
      'unescapes "': () => {
        assert.strictEqual(unescapeXML("&quot;"), '"');
      },
      "unescapes '": () => {
        assert.strictEqual(unescapeXML("&apos;"), "'");
      },
      "throws on invalid entities": () => {
        assert.throws(
          () => unescapeXML("&foobar;"),
          Error,
          "Illegal XML entity &foobar;"
        );
      },
      "unescapes numeric entities": () => {
        assert.strictEqual(unescapeXML("&#64;"), "@");
      },
      "throws on invalid characters": () => {
        assert.throws(
          () => unescapeXML("&#0;"),
          Error,
          "Illegal XML character 0x0"
        );
      },
      "unescapes hexadecimal entities": () => {
        assert.strictEqual(unescapeXML("&#x40;"), "@");
      },
      "unescapes multibyte hex entities": () => {
        assert.strictEqual(unescapeXML("&#x1f40d;"), "\uD83D\uDC0D");
      },
      "unescapes multibyte uppercase hex entities": () => {
        assert.strictEqual(unescapeXML("&#x1F40D;"), "\uD83D\uDC0D");
      },
      "unescapes multibyte decimal entities": () => {
        assert.strictEqual(unescapeXML("&#128013;"), "\uD83D\uDC0D");
      },
    },
    escapeXMLText: {
      "escapes &": () => {
        assert.strictEqual(escapeXMLText("&"), "&amp;");
      },
      "escapes <": () => {
        assert.strictEqual(escapeXMLText("<"), "&lt;");
      },
      "escapes >": () => {
        assert.strictEqual(escapeXMLText(">"), "&gt;");
      },
    },
    unescapeXMLText: {
      "unescapes &": () => {
        assert.strictEqual(unescapeXMLText("&amp;"), "&");
      },
      "unescapes <": () => {
        assert.strictEqual(unescapeXMLText("&lt;"), "<");
      },
      "unescapes >": () => {
        assert.strictEqual(unescapeXMLText("&gt;"), ">");
      },
    },
  })
  .run();
