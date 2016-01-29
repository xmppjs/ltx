'use strict'

/*
  benchmark the serialization speed of the the supported backends
 */

var benchmark = require('benchmark')
var parsers = require('../lib/parsers')

var XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  '<body>Where there is love there is life.</body>',
  '</message>'
].join('')

var suite = new benchmark.Suite('backends write')

parsers.forEach(function (Parser) {
  var parser = new Parser()
  parser.write('<r>')
  suite.add(Parser.name.slice(3), function () {
    parser.write(XML)
  })
})

module.exports = suite
