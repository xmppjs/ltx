'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var stringify = require('../lib/stringify')

vows.describe('stringify').addBatch({
  'is exported correctly': function () {
    assert.strictEqual(ltx.stringify, stringify)
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
    assert.strictEqual(el.toString(), stringify(el))
  },
  'while having entities in text, return the same result than .toString()': function () {
    const el = ltx`
      <foo bar="foo">
        &gt;text
        <child foo="bar">
          &lt;text
          <self-closing/>
        </child>
      </foo>
    `
    assert.strictEqual(el.toString(), stringify(el))
  },
  'while having entities in attribute, return the same result than .toString()': function () {
    const el = ltx`
      <foo bar="&amp;foo">
        &gt;text
        <child foo="&amp;bar">
          &lt;text
          <self-closing/>
        </child>
      </foo>
    `
    assert.strictEqual(el.toString(), stringify(el))
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

    assert.strictEqual(stringify(el, 2), expected)
    assert.strictEqual(stringify(el, '  '), expected)
  },
  'ignores empty string children': function () {
    const el = {
      name: 'foo',
      attrs: {},
      children: ['', 'bar', '']
    }
    assert.strictEqual(stringify(el), '<foo>bar</foo>')
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
    assert.strictEqual(stringify(el), '<foo><bar></bar></foo>')
  }
}).export(module)
