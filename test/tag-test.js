"use strict";

var vows = require("vows");
var assert = require("assert");
var ltx = require("..");
var tag = require("../lib/tag");
var Element = ltx.Element;

vows
  .describe("tag")
  .addBatch({
    "exported correctly": function () {
      assert.strictEqual(ltx.tag, tag);
    },
    "parses the string and return an Element object": function () {
      // var r = tag`<foo>${'bar'}</foo>`
      var r = tag(["<foo>", "</foo>"], "bar");
      assert(r instanceof Element);
      var c = new Element("foo").t("bar");
      assert(c.equals(r));
      assert(r.equals(c));
      assert.strictEqual(r.toString(), c.toString());
    },
    "multiple substitutions": function () {
      // var r = tag`<foo a="${'b'}">${'bar'}</foo>`
      var r = tag(['<foo a="', '">', "</foo>"], "b", "bar");
      assert(r instanceof Element);
      var c = new Element("foo", { a: "b" }).t("bar");
      assert(c.equals(r));
      assert(r.equals(c));
      assert.strictEqual(r.toString(), c.toString());
    },
  })
  .export(module);
