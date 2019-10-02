'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var parsers = require('../lib/parsers')
var h = ltx.createElement

var Parser = parsers.find(function (parser) {
  return (parser.name === 'SaxLtx')
})

var parse = function (s) {
  return ltx.parse(s, { Parser: Parser })
}

vows.describe('sax_ltx').addBatch({
  'CDATA parsing': {
    'issue-19: parse CDATA content as text': function () {
      var el = parse('<root><![CDATA[Content]]></root>')
      assert.strictEqual(el.name, 'root')
      assert.strictEqual(el.getText(), 'Content')
    },
    'do not unescape CDATA content': function () {
      var el = parse('<root><![CDATA[Content &amp; "more content&quot;]]></root>')
      assert.strictEqual(el.name, 'root')
      assert.strictEqual(el.getText(), 'Content &amp; "more content&quot;')
    },
    'issue-132': () => {
      var el = parse('<a><b><![CDATA[]]></b><b><![CDATA[--><c>&d;]]></b></a>')
      assert.deepStrictEqual(el, h('a', null, h('b', null, ''), h('b', null, '--><c>&d;')))
    }
  }
}).export(module)
