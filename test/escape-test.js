'use strict'

var vows = require('vows')
var assert = require('assert')
var ltx = require('..')
var escape = require('../lib/escape')
var escapeXML = escape.escapeXML
var unescapeXML = escape.unescapeXML
var escapeXMLText = escape.escapeXMLText
var unescapeXMLText = escape.unescapeXMLText

vows.describe('escape').addBatch({
  'escapeXML': {
    'exported correctly': function () {
      assert.strictEqual(ltx.escapeXML, escapeXML)
    },
    'escapes &': function () {
      assert.strictEqual(escapeXML('&'), '&amp;')
    },
    'escapes <': function () {
      assert.strictEqual(escapeXML('<'), '&lt;')
    },
    'escapes >': function () {
      assert.strictEqual(escapeXML('>'), '&gt;')
    },
    'escapes "': function () {
      assert.strictEqual(escapeXML('"'), '&quot;')
    },
    'escapes \'': function () {
      assert.strictEqual(escapeXML('\''), '&apos;')
    }
  },
  'unescapeXML': {
    'exported correctly': function () {
      assert.strictEqual(ltx.unescapeXML, unescapeXML)
    },
    'unescapes &': function () {
      assert.strictEqual(unescapeXML('&amp;'), '&')
    },
    'unescapes <': function () {
      assert.strictEqual(unescapeXML('&lt;'), '<')
    },
    'unescapes >': function () {
      assert.strictEqual(unescapeXML('&gt;'), '>')
    },
    'unescapes "': function () {
      assert.strictEqual(unescapeXML('&quot;'), '"')
    },
    'unescapes \'': function () {
      assert.strictEqual(unescapeXML('&apos;'), '\'')
    }
  },
  'escapeXMLText': {
    'exported correctly': function () {
      assert.strictEqual(ltx.escapeXMLText, escapeXMLText)
    },
    'escapes &': function () {
      assert.strictEqual(escapeXMLText('&'), '&amp;')
    },
    'escapes <': function () {
      assert.strictEqual(escapeXMLText('<'), '&lt;')
    },
    'escapes >': function () {
      assert.strictEqual(escapeXMLText('>'), '&gt;')
    }
  },
  'unescapeXMLText': {
    'exported correctly': function () {
      assert.strictEqual(ltx.unescapeXMLText, unescapeXMLText)
    },
    'unescapes &': function () {
      assert.strictEqual(unescapeXMLText('&amp;'), '&')
    },
    'unescapes <': function () {
      assert.strictEqual(unescapeXMLText('&lt;'), '<')
    },
    'unescapes >': function () {
      assert.strictEqual(unescapeXMLText('&gt;'), '>')
    }
  }
}).export(module)
