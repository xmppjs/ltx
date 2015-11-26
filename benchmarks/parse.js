'use strict'

var benchmark = require('benchmark')
var ltx = require('../index')
var parsers = require('../lib/parsers')

var XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  '<body>Where there is love there is life.</body>',
  '</message>'
].join('')

var suite = new benchmark.Suite('parse')

parsers.forEach(function (Parser) {
  suite.add(Parser.name, function () {
    ltx.parse(XML, {Parser: Parser})
  })
})

suite.on('cycle', function (event) {
  console.log(event.target.toString())
})
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'))
  })
  .run({'async': true})
