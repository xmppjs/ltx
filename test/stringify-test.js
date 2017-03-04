'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var stringify = require('../lib/stringify')

vows.describe('stringify').addBatch({
  'is exported correctly': function () {
    assert.equal(ltx.stringify, stringify)
  },
  'returns the same result than .toString()': function () {
    const el = ltx`
      <foo bar="foo">
        text
        <child foo="bar">
          text
          <self-closing/>
        </child>
      </foo>
    `
    assert.equal(el.toString(), stringify(el))
  },
  'indents correctly': function () {
    const el = ltx`<foo><bar hello="world">text<self/></bar></foo>`

    const expected = [
      '<foo>',
      '  <bar hello="world">',
      '    text',
      '    <self/>',
      '  </bar>',
      '</foo>'
    ].join('\n')

    assert.equal(stringify(el, 2), expected)
    assert.equal(stringify(el, '  '), expected)
  },
  'ignores empty string children': function () {
    const el = {
      name: 'foo',
      attrs: {},
      children: ['', 'bar', '']
    }
    assert.equal(stringify(el), '<foo>bar</foo>')
  },
  'ignores deep empty string children': function () {
    const el = {
      name: 'foo',
      attrs: {},
      children: [
        '',
        {
          name: 'bar',
          attrs: {},
          children: [
            '', '', ''
          ]
        },
        ''
      ]
    }
    assert.equal(stringify(el), '<foo><bar></bar></foo>')
  }
}).export(module)
