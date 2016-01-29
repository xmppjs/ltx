'use strict'

/*
  benchmark the speed of the different methods to create elements
  Not all tests are equally functional but it gives a good idea of what to expect from
  the different techniques.
 */

var benchmark = require('benchmark')
var ltx = require('../index')
var createElement = ltx.createElement
var tag = ltx.tag
var Element = ltx.Element
var parse = ltx.parse

var XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  '<body>Where there is love there is life.</body>',
  '</message>'
].join('')
var el = parse(XML)

var suite = new benchmark.Suite('ltx')

suite.add('tag with template literal', function () {
  tag`
    <message to="${'foo@bar'}" from="${'bar@foo'}" type="${'chat'}" id="${'foobar'}">
      <body>${'Where there is love there is life.'}</body>
    </message>
  `
})

suite.add('tag with direct call', function () {
  tag(
    [
      '\n  <message to="',
      '" from="',
      '" type="',
      '" id="',
      '">\n    <body>',
      '</body>\n  </message>\n'
    ],
    'foo@bar',
    'bar@foo',
    'chat',
    'foobar',
    'Where there is love there is life.'
  )
})

suite.add('serialize and parse', function () {
  parse(el.toString())
})

suite.add('parse', function () {
  parse(XML)
})

suite.add('serialize', function () {
  el.toString()
})

suite.add('createElement (jsx)', function () {
  createElement(
    'message', {to: 'foo@bar', from: 'bar@foo', type: 'chat', id: 'foobar'},
    createElement('body', null, 'Where there is love there is life.')
  )
})

suite.add('clone', function () {
  el.clone()
})

suite.add('Element', function () {
  new Element('message', {to: 'foo@bar', from: 'bar@foo', type: 'chat', id: 'foobar'})
    .c('body').t('Where there is love there is life.').root()
})

module.exports = suite
