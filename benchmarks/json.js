'use strict'

/*
  benchmark JSON and compare with XML
 */

var benchmark = require('benchmark')
var ltx = require('../index')
var parse = ltx.parse
var toJSON = ltx.toJSON
var fromJSON = ltx.fromJSON

var XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  '<body>Where there is love there is life.</body>',
  '</message>'
].join('')
var el = parse(XML)
var json = toJSON(el)
var serializedjson = JSON.stringify(json)

var suite = new benchmark.Suite('JSON')

suite.add('from JSON', function () {
  fromJSON(json)
})

suite.add('from serialized JSON', function () {
  fromJSON(JSON.parse(serializedjson))
})

suite.add('from XML', function () {
  parse(XML)
})

suite.add('to JSON', function () {
  toJSON(el)
})

suite.add('to serialized JSON', function () {
  JSON.stringify(toJSON(el))
})

suite.add('to XML', function () {
  el.toString()
})

module.exports = suite
