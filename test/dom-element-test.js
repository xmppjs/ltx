'use strict';

var vows = require('vows')
  , assert = require('assert')
  , ltx = require('./../lib/index')

ltx.availableSaxParsers.forEach(function(saxParser) {
    var parse = function(s) {
        return ltx.parse(s, saxParser)
    }
    vows.describe('Parsing returns DOMElement\'s').addBatch({
        'DOMElement': {
            'Returns DOMElement on parse': function() {
                var stanza = '<message><body xmlns="http://www.w3.org/1999/xhtml">' +
                    '<p>DOM</p></body></message>'
                var el = parse(stanza)

                assert.equal(el.getChild('body').constructor.name, 'DOMElement')
                var body = el.getChild('body')
                assert.isDefined(body.localName)
                assert.equal(body.localName, 'body')

                assert.isDefined(body.namespaceURI)
                assert.equal(body.namespaceURI, 'http://www.w3.org/1999/xhtml')

                assert.isDefined(body.parentNode)
                assert.equal(body.parentNode.getName(), 'message')

                assert.isDefined(body.childNodes)
                assert.isArray(body.childNodes)
                assert.equal(body.childNodes.length, 1)

                assert.isDefined(body.textContent)
                assert.equal(body.textContent, '')

                assert.equal(body.getChild('p').textContent, 'DOM')
            }
        },
        'createElement': {
            'create a new element and set children': function() {
                var c = new ltx.DOMElement('bar')
                var e = ltx.createDOMElement('foo', {'foo': 'bar'}, 'foo', c)
                assert(e instanceof ltx.DOMElement)
                assert.equal(e.localName, 'foo')
                assert.equal(e.getAttribute('foo'), 'bar')
                assert.equal(e.childNodes.length, 2)
                assert.equal(e.childNodes[0], 'foo')
                assert.equal(e.childNodes[1], c)
            }
        },
    }).export(module)
})
