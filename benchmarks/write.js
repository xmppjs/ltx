'use strict'

var benchmark = require('benchmark')
var parsers = require('../lib/parsers')

var XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  '<body>Where there is love there is life.</body>',
  '</message>'
].join('')

var suite = new benchmark.Suite('write')

parsers.forEach(function (Parser) {
  var parser = new Parser()
  parser.write('<r>')
  suite.add(Parser.name, function () {
    parser.write(XML)
  })
})

suite.on('cycle', function (event) {
  console.log(event.target.toString())
})
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'))
  })
  .run({'async': true})
