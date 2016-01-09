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
      assert.equal(ltx.escapeXML, escapeXML)
    },
    'escapes &': function () {
      assert.equal(escapeXML('&'), '&amp;')
    },
    'escapes <': function () {
      assert.equal(escapeXML('<'), '&lt;')
    },
    'escapes >': function () {
      assert.equal(escapeXML('>'), '&gt;')
    },
    'escapes "': function () {
      assert.equal(escapeXML('"'), '&quot;')
    },
    'escapes \'': function () {
      assert.equal(escapeXML('\''), '&apos;')
    }
  },
  'unescapeXML': {
    'exported correctly': function () {
      assert.equal(ltx.unescapeXML, unescapeXML)
    },
    'unescapes &': function () {
      assert.equal(unescapeXML('&amp;'), '&')
    },
    'unescapes <': function () {
      assert.equal(unescapeXML('&lt;'), '<')
    },
    'unescapes >': function () {
      assert.equal(unescapeXML('&gt;'), '>')
    },
    'unescapes "': function () {
      assert.equal(unescapeXML('&quot;'), '"')
    },
    'unescapes \'': function () {
      assert.equal(unescapeXML('&apos;'), '\'')
    }
  },
  'escapeXMLText': {
    'exported correctly': function () {
      assert.equal(ltx.escapeXMLText, escapeXMLText)
    },
    'escapes &': function () {
      assert.equal(escapeXMLText('&'), '&amp;')
    },
    'escapes <': function () {
      assert.equal(escapeXMLText('<'), '&lt;')
    },
    'escapes >': function () {
      assert.equal(escapeXMLText('>'), '&gt;')
    }
  },
  'unescapeXMLText': {
    'exported correctly': function () {
      assert.equal(ltx.unescapeXMLText, unescapeXMLText)
    },
    'unescapes &': function () {
      assert.equal(unescapeXMLText('&amp;'), '&')
    },
    'unescapes <': function () {
      assert.equal(unescapeXMLText('&lt;'), '<')
    },
    'unescapes >': function () {
      assert.equal(unescapeXMLText('&gt;'), '>')
    }
  }
}).export(module)
