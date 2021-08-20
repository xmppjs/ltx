"use strict";

var vows = require("vows");
var assert = require("assert");
var ltx = require("..");
var parsers = require("../lib/parsers");
var h = ltx.createElement;

var LTXParser = parsers.find(function (parser) {
  return parser.name === "SaxLtx";
});

var parse = function (s) {
  return ltx.parse(s, { Parser: LTXParser });
};

var Parser = require("../lib/Parser");

var parseChunks = function (chunks) {
  var p = new Parser();

  var result = null;
  var error = null;

  p.on("tree", function (tree) {
    result = tree;
  });
  p.on("error", function (e) {
    error = e;
  });

  for (var chunk of chunks) {
    p.write(chunk);
  }
  p.end();

  if (error) {
    throw error;
  } else {
    return result;
  }
};

vows
  .describe("sax_ltx")
  .addBatch({
    "CDATA parsing": {
      "issue-19: parse CDATA content as text": function () {
        var el = parse("<root><![CDATA[Content]]></root>");
        assert.strictEqual(el.name, "root");
        assert.strictEqual(el.getText(), "Content");
      },
      "do not unescape CDATA content": function () {
        var el = parse(
          '<root><![CDATA[Content &amp; "more content&quot;]]></root>'
        );
        assert.strictEqual(el.name, "root");
        assert.strictEqual(el.getText(), 'Content &amp; "more content&quot;');
      },
      "issue-132": () => {
        var el = parse(
          "<a><b><![CDATA[]]></b><b><![CDATA[--><c>&d;]]></b></a>"
        );
        assert.deepStrictEqual(
          el,
          h("a", null, h("b", null, ""), h("b", null, "--><c>&d;"))
        );
      },
      "split CDATA between chunks": () => {
        var el1 = parseChunks(["<root><![CDA", "TA[Content]]></root>"]);
        assert.strictEqual(el1.getText(), "Content");
        var el2 = parseChunks(["<root><![CDATA[Con", "tent]]></root>"]);
        assert.strictEqual(el2.getText(), "Content");
        var el3 = parseChunks(["<root><![CDATA[Content]]", "></root>"]);
        assert.strictEqual(el3.getText(), "Content");

        var str = "<root><![CDATA[Content]]></root>";
        for (var i = 0; i < str.length; i++) {
          var chunks = [str.substr(0, i) || "", str.substring(i) || ""];
          assert.strictEqual(
            parseChunks(chunks).toString(),
            "<root>Content</root>"
          );
        }
      },
    },
  })
  .export(module);
