'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var Element = ltx.Element
var toJSON = ltx.toJSON
var fromJSON = ltx.fromJSON

vows.describe('JSON').addBatch({
  'toJSON': function () {
    var e = new Element('e', {foo: 23, bar: 0, nil: null}).c('f').t(1000).up()
    assert.deepEqual(toJSON(e), [
      'e',
      { foo: 23, bar: 0, nil: null },
      [
        ['f', {}, [1000]]
      ]
    ])
  },
  'fromJSON': function () {
    var j = [
      'e',
      { foo: 23, bar: 0, nil: null },
      [
        ['f', {}, [1000]]
      ]
    ]
    assert.equal(fromJSON(j).toString(), new Element('e', {foo: 23, bar: 0, nil: null}).c('f').t(1000).up().toString())
  },
  'JSON.stringify(element) returns serialized XML': function () {
    var el = new Element('e', {'foo': 'bar'})
    assert.equal(JSON.stringify(el), '<e foo="bar"/>')
  }
})
