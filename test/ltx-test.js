"use strict";

var vows = require("vows");
var assert = require("assert");
var ltx = require("..");
var tag = require("../lib/tag");

vows
  .describe("ltx")
  .addBatch({
    "returns same result as tag": function () {
      var a = tag(["<foo>", "</foo>"], "bar");
      var b = ltx(["<foo>", "</foo>"], "bar");
      assert.strictEqual(a.toString(), b.toString());
    },
  })
  .export(module);
