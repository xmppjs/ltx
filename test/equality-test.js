'use strict'

var vows = require('vows')
var assert = require('assert')
var Element = require('../lib/Element')

vows.describe('equality').addBatch({
  'nameEquals': {
    'it returns true if elements name are equal': function () {
      var a = new Element('foo')
      var b = new Element('foo')
      assert.equal(a.nameEquals(b), true)

      var c = new Element('foo:bar')
      var d = new Element('foo:bar')
      assert.equal(c.nameEquals(d), true)
    },
    'it returns false if elements name differ': function () {
      var a = new Element('foo')
      var b = new Element('bar')
      assert.equal(a.nameEquals(b), false)

      var c = new Element('foo:bar')
      var d = new Element('bar:bar')
      assert.equal(c.nameEquals(d), false)

      var e = new Element('foo:bar')
      var f = new Element('foo:foo')
      assert.equal(e.nameEquals(f), false)
    }
  },
  'attrsEquals': {
    'it returns true if elements attributes are equal': function () {
      var a = new Element('foo', {a: 'b', b: 'c'})
      var b = new Element('foo', {a: 'b', b: 'c'})
      assert.equal(a.attrsEquals(b), true)

      var c = new Element('foo', {a: 'b', b: 'c'})
      var d = new Element('foo', {b: 'c', a: 'b'})
      assert.equal(c.attrsEquals(d), true)
    },
    'it returns true if elements attributes are serialized equaly': function () {
      var a = new Element('foo', {foo: 'false'})
      var b = new Element('foo', {foo: false})
      assert.equal(a.attrsEquals(b), true)

      var c = new Element('foo', {foo: '0'})
      var d = new Element('foo', {foo: 0})
      assert.equal(c.attrsEquals(d), true)

      var foo = {toString: function () { return 'hello' }}
      var e = new Element('foo', {foo: foo})
      var f = new Element('foo', {foo: 'hello'})
      assert.equal(e.attrsEquals(f), true)
    },
    'it returns false if elements attributes differ': function () {
      var a = new Element('foo', {a: 'b'})
      var b = new Element('foo')
      assert.equal(a.attrsEquals(b), false)

      var c = new Element('foo')
      var d = new Element('foo', {a: 'b'})
      assert.equal(c.attrsEquals(d), false)

      var e = new Element('foo', {b: 'a'})
      var f = new Element('foo', {a: 'b'})
      assert.equal(e.attrsEquals(f), false)

      var g = new Element('foo', {foo: 'bar'})
      var h = new Element('foo', {bar: 'bar'})
      assert.equal(g.attrsEquals(h), false)
    }
  },
  'childrenEquals': {
    'it returns true if elements children are equal': function () {
      var a = new Element('foo').c('bar').up().c('foo').root()
      assert.equal(a.childrenEquals(a), true)
      var b = new Element('foo').c('bar').up().c('foo').root()
      assert.equal(a.childrenEquals(b), true)
    },
    'it returns false if elements children name differ': function () {
      var a = new Element('foo').c('bar').root()
      var b = new Element('foo').c('foo').root()
      assert.equal(a.childrenEquals(b), false)
    },
    'it returns false if elements children attrs differ': function () {
      var a = new Element('foo').c('foo', {foo: 'bar'}).root()
      var b = new Element('foo').c('foo', {bar: 'foo'}).root()
      assert.equal(a.childrenEquals(b), false)
    },
    'it returns false if elements children order differ': function () {
      var a = new Element('foo').c('foo').up().c('bar').root()
      var b = new Element('foo').c('bar').up().c('foo').root()
      assert.equal(a.childrenEquals(b), false)
    }
  },
  'equals': {
    'it returns true if elements are equal': function () {
      var a = new Element('a', {foo: 'bar'}).c('hello').root()
      assert.equal(a.equals(a), true)
      var b = new Element('a', {foo: 'bar'}).c('hello').root()
      assert.equal(a.equals(b), true)
    },
    'it returns false if elements name differ': function () {
      var a = new Element('foo')
      var b = new Element('bar')
      assert.equal(a.equals(b), false)
    },
    'it returns false if elements attrs differ': function () {
      var a = new Element('foo', {foo: 'bar'})
      var b = new Element('foo')
      assert.equal(a.equals(b), false)
    },
    'it returns false if elements children differ': function () {
      var a = new Element('foo').c('foo').root()
      var b = new Element('foo').c('bar').root()
      assert.equal(a.equals(b), false)
    }
  }
}).export(module)
