'use strict';

var util = require('util')
  , events = require('events')
  , xml = require('node-xml')

/**
 * This cannot be used as long as node-xml starts parsing only after
 * setTimeout(f, 0)
 */
var SaxNodeXML = module.exports = function SaxNodeXML() {
    events.EventEmitter.call(this)
    var self = this
    this.parser = new xml.SaxParser(function(handler) {
        /* jshint -W072 */
        handler.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
            var i, attrsHash = {}
            if (prefix) {
                elem = prefix + ':' + elem
            }
            for (i = 0; i < attrs.length; i++) {
                var attr = attrs[i]
                attrsHash[attr[0]] = unescapeXml(attr[1])
            }
            for(i = 0; i < namespaces.length; i++) {
                var namespace = namespaces[i]
                var k = !namespace[0] ? 'xmlns' : 'xmlns:' + namespace[0]
                attrsHash[k] = unescapeXml(namespace[1])
            }
            self.emit('startElement', elem, attrsHash)
        })
        handler.onEndElementNS(function(elem, prefix) {
            if (prefix) {
                elem = prefix + ':' + elem
            }
            self.emit('endElement', elem)
        })
        handler.onCharacters(function(str) {
            self.emit('text', str)
        })
        handler.onCdata(function(str) {
            self.emit('text', str)
        })
        handler.onError(function(e) {
            self.emit('error', e)
        })
        // TODO: other events, esp. entityDecl (billion laughs!)
    })
}

util.inherits(SaxNodeXML, events.EventEmitter)

SaxNodeXML.prototype.write = function(data) {
    this.parser.parseString(data)
}

SaxNodeXML.prototype.end = function(data) {
    if (data) {
        this.write(data)
    }
}

function unescapeXml(s) {
    return s.
        replace(/\&amp;/g, '&').
        replace(/\&lt;/g, '<').
        replace(/\&gt;/g, '>').
        replace(/\&quot;/g, '"').
        replace(/\&apos;/g, '\'')
}
