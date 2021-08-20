"use strict";

const vows = require("vows");
const assert = require("assert");
const ltx = require("..");
const tag = require("../lib/tag");

vows
  .describe("ltx")
  .addBatch({
    "returns same result as tag": function () {
      const a = tag(["<foo>", "</foo>"], "bar");
      const b = ltx(["<foo>", "</foo>"], "bar");
      assert.strictEqual(a.toString(), b.toString());
    },
  })
  .export(module);
