'use strict';

var events = require('events')
  , util = require('util')
  , DOMElement = require('./dom-element')


exports.availableSaxParsers = []
exports.bestSaxParser = null

var saxParsers = [
    './sax/sax_expat.js',
    './sax/sax_ltx.js',
    /*'./sax_easysax.js', './sax_node-xml.js',*/
    './sax/sax_saxjs.js'
]

saxParsers.forEach(function(modName) {
    var mod
    try {
        mod = require(modName)
    } catch (e) {
        /* Silently missing libraries drop for debug:
        console.error(e.stack || e)
         */
    }
    if (mod) {
        exports.availableSaxParsers.push(mod)
        if (!exports.bestSaxParser) {
            exports.bestSaxParser = mod
        }
    }
})

exports.Parser = function(saxParser) {
    events.EventEmitter.call(this)
    var self = this

    var ParserMod = saxParser || exports.bestSaxParser
    if (!ParserMod) {
        throw new Error('No SAX parser available')
    }
    this.parser = new ParserMod()

    var el
    this.parser.addListener('startElement', function(name, attrs) {
        var child = new DOMElement(name, attrs)
        if (!el) {
            el = child
        } else {
            el = el.cnode(child)
        }
    })
    this.parser.addListener('endElement', function(name) {
        /* jshint -W035 */
        if (!el) {
            /* Err */
        } else if (name === el.name) {
            if (el.parent) {
                el = el.parent
            } else if (!self.tree) {
                self.tree = el
                el = undefined
            }
        }
        /* jshint +W035 */
    })
    this.parser.addListener('text', function(str) {
        if (el) {
            el.t(str)
        }
    })
    this.parser.addListener('error', function(e) {
        self.error = e
        self.emit('error', e)
    })
}

util.inherits(exports.Parser, events.EventEmitter)

exports.Parser.prototype.write = function(data) {
    this.parser.write(data)
}

exports.Parser.prototype.end = function(data) {
    this.parser.end(data)

    if (!this.error) {
        if (this.tree) {
            this.emit('tree', this.tree)
        } else {
            this.emit('error', new Error('Incomplete document'))
        }
    }
}

exports.parse = function(data, saxParser) {
    var p = new exports.Parser(saxParser)
    var result = null
      , error = null

    p.on('tree', function(tree) {
        result = tree
    })
    p.on('error', function(e) {
        error = e
    })

    p.write(data)
    p.end()

    if (error) {
        throw error
    } else {
        return result
    }
}
