'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var is = require('../lib/is')
var Element = ltx.Element

vows.describe('isNode').addBatch({
  isNode: {
    'exported correctly': function () {
      assert.strictEqual(ltx.isNode, is.isNode)
    },
    'returns true for Element': function () {
      assert.strictEqual(is.isNode(new Element()), true)
    },
    'returns true for strings': function () {
      assert.strictEqual(is.isNode('string'), true)
    },
    'returns false for anything else': function () {
      [123, null, undefined, {}, [], true].forEach(function (value) {
        assert.strictEqual(is.isNode(value), false)
      })
    }
  },
  isElement: {
    'exported correctly': function () {
      assert.strictEqual(ltx.isElement, is.isElement)
    },
    'returns true for Element': function () {
      assert.strictEqual(is.isElement(new Element()), true)
    },
    'returns false for anything else': function () {
      [123, null, undefined, {}, 'string', [], true].forEach(function (value) {
        assert.strictEqual(is.isElement(value), false)
      })
    }
  },
  isText: {
    'exported correctly': function () {
      assert.strictEqual(ltx.isText, is.isText)
    },
    'returns true for strings': function () {
      assert.strictEqual(is.isText('foo'), true)
    },
    'returns false for anything else': function () {
      [123, null, undefined, {}, Element, [], true].forEach(function (value) {
        assert.strictEqual(is.isText(value), false)
      })
    }
  }
}).export(module)
