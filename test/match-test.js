'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('../index')
var Element = ltx.Element
var match = require('../lib/match')

vows.describe('match').addBatch({
  'exported correctly': function () {
    assert.strictEqual(ltx.match, match)
  },
  'it returns true if elements name are equal': function () {
    var a = new Element('foo')
    var b = new Element('foo')
    assert.equal(match(a, b), true)
  },
  'it returns false if elements name differ': function () {
    var a = new Element('foo')
    var b = new Element('bar')
    assert.equal(match(a, b), false)
  },
  'it returns true if element attributes match': function () {
    var a = new Element('foo', {bar: 'hello'})
    var b = new Element('foo', {bar: 'hello'})
    assert.equal(match(a, b), true)

    var c = new Element('foo', {bar: 'hello', 'foo': 'baz'})
    assert.equal(match(a, c), true)
  },
  'it returns false if element attributes do not match': function () {
    var a = new Element('foo', {bar: 'hello'})
    var b = new Element('foo')
    assert.equal(match(a, b), false)
  }
}).export(module)
