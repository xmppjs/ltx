'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var Element = ltx.Element
var createElement = ltx.createElement

vows.describe('createElement').addBatch({
  'create a new element and set children': function () {
    var c = new Element('bar')
    var e = createElement('foo', {'foo': 'bar'}, 'foo', c)
    assert(e instanceof Element)
    assert(e.is('foo'))
    assert.equal(e.attrs.foo, 'bar')
    assert.equal(e.children.length, 2)
    assert.equal(e.children[0], 'foo')
    assert.equal(e.children[1], c)
  }
}).export(module)
