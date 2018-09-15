'use strict'

/*
  benchmark the parsing speed of the supported backends
 */

var benchmark = require('benchmark')
var ltx = require('../index')
var parsers = require('../lib/parsers')

var XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  '<body>Where there is love there is life.</body>',
  '</message>'
].join('')

var suite = new benchmark.Suite('backends parse')

parsers.forEach(function (Parser) {
  suite.add(Parser.name.slice(3), function () {
    ltx.parse(XML, { Parser: Parser })
  })
})

module.exports = suite
