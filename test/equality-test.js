'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('../index')
var Element = ltx.Element
var nameEqual = ltx.nameEqual
var attrsEqual = ltx.attrsEqual
var childrenEqual = ltx.childrenEqual
var equal = ltx.equal

vows.describe('equality').addBatch({
  'nameEqual': {
    'it returns true if elements name are equal': function () {
      var a = new Element('foo')
      var b = new Element('foo')
      assert.equal(nameEqual(a, b), true)

      var c = new Element('foo:bar')
      var d = new Element('foo:bar')
      assert.equal(nameEqual(c, d), true)
    },
    'it returns false if elements name differ': function () {
      var a = new Element('foo')
      var b = new Element('bar')
      assert.equal(nameEqual(a, b), false)

      var c = new Element('foo:bar')
      var d = new Element('bar:bar')
      assert.equal(nameEqual(c, d), false)

      var e = new Element('foo:bar')
      var f = new Element('foo:foo')
      assert.equal(nameEqual(e, f), false)
    }
  },
  'attrsEqual': {
    'it returns true if elements attributes are equal': function () {
      var a = new Element('foo', {a: 'b', b: 'c'})
      var b = new Element('foo', {a: 'b', b: 'c'})
      assert.equal(attrsEqual(a, b), true)

      var c = new Element('foo', {a: 'b', b: 'c'})
      var d = new Element('foo', {b: 'c', a: 'b'})
      assert.equal(attrsEqual(c, d), true)
    },
    'it returns true if elements attributes are serialized equaly': function () {
      var a = new Element('foo', {foo: 'false'})
      var b = new Element('foo', {foo: false})
      assert.equal(attrsEqual(a, b), true)

      var c = new Element('foo', {foo: '0'})
      var d = new Element('foo', {foo: 0})
      assert.equal(attrsEqual(c, d), true)

      var foo = {toString: function () { return 'hello' }}
      var e = new Element('foo', {foo: foo})
      var f = new Element('foo', {foo: 'hello'})
      assert.equal(attrsEqual(e, f), true)
    },
    'it returns false if elements attributes differ': function () {
      var a = new Element('foo', {a: 'b'})
      var b = new Element('foo')
      assert.equal(attrsEqual(a, b), false)

      var c = new Element('foo')
      var d = new Element('foo', {a: 'b'})
      assert.equal(attrsEqual(c, d), false)

      var e = new Element('foo', {b: 'a'})
      var f = new Element('foo', {a: 'b'})
      assert.equal(attrsEqual(e, f), false)

      var g = new Element('foo', {foo: 'bar'})
      var h = new Element('foo', {bar: 'bar'})
      assert.equal(attrsEqual(g, h), false)
    }
  },
  'childrenEqual': {
    'it returns true if elements children are equal': function () {
      var a = new Element('foo').c('bar').up().c('foo').root()
      assert.equal(childrenEqual(a, a), true)

      var b = new Element('foo').c('bar').up().c('foo').root()
      assert.equal(childrenEqual(a, b), true)
    },
    'it returns false if elements children name differ': function () {
      var a = new Element('foo').c('bar').root()
      var b = new Element('foo').c('foo').root()
      assert.equal(childrenEqual(a, b), false)
    },
    'it returns false if elements children attrs differ': function () {
      var a = new Element('foo').c('foo', {foo: 'bar'}).root()
      var b = new Element('foo').c('foo', {bar: 'foo'}).root()
      assert.equal(childrenEqual(a, b), false)
    },
    'it returns false if elements children order differ': function () {
      var a = new Element('foo').c('foo').up().c('bar').root()
      var b = new Element('foo').c('bar').up().c('foo').root()
      assert.equal(childrenEqual(a, b), false)
    }
  },
  'equal': {
    'it returns true if elements are equal': function () {
      var a = new Element('a', {foo: 'bar'}).c('hello').root()
      assert.equal(equal(a, a), true)
      var b = new Element('a', {foo: 'bar'}).c('hello').root()
      assert.equal(equal(a, b), true)
    },
    'it returns false if elements name differ': function () {
      var a = new Element('foo')
      var b = new Element('bar')
      assert.equal(equal(a, b), false)
    },
    'it returns false if elements attrs differ': function () {
      var a = new Element('foo', {foo: 'bar'})
      var b = new Element('foo')
      assert.equal(equal(a, b), false)
    },
    'it returns false if elements children differ': function () {
      var a = new Element('foo').c('foo').root()
      var b = new Element('foo').c('bar').root()
      assert.equal(equal(a, b), false)
    }
  }
}).export(module)
