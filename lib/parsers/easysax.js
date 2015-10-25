'use strict'

var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var Easysax = require('easysax')

/**
 * FIXME: This SAX parser cannot be pushed to!
 */
module.exports = SaxEasysax
inherits(SaxEasysax, EventEmitter)

function SaxEasysax () {
  EventEmitter.call(this)
  this.parser = new Easysax()

  var self = this

  this.parser.on('startNode', function (name, attr, uq) {
    attr = attr()

    if (attr === false) {
      self.emit('error', 'attr char')
      return false
    }

    for (var k in attr) {
      attr[k] = uq(attr[k])
    }

    self.emit('startElement', name, attr)
  })
  this.parser.on('endNode', function (name) {
    self.emit('endElement', name)
  })
  this.parser.on('textNode', function (str, uq) {
    self.emit('text', uq(str))
  })
  this.parser.on('cdata', function (str) {
    self.emit('text', str)
  })
  this.parser.on('error', function (e) {
    self.emit('error', e)
  })
  // TODO: other events, esp. entityDecl (billion laughs!)

  var sbuffer = ''

  this.write = function (data) {
    sbuffer += typeof data !== 'string' ? data.toString() : data
  }

  this.end = function (data) {
    sbuffer += typeof data !== 'string' ? data.toString() : data
    this.parser(sbuffer)
    sbuffer = ''
  }
}
