'use strict'

var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var saxes = require('saxes')

var SaxSaxesjs = module.exports = function SaxSaxesjs () {
  EventEmitter.call(this)
  this.parser = new saxes.SaxesParser({ fragment: true })

  var that = this
  this.parser.on('opentag', function (a) {
    that.emit('startElement', a.name, a.attributes)
  })
  this.parser.on('closetag', function (el) {
    that.emit('endElement', el.name)
  })
  this.parser.on('text', function (str) {
    that.emit('text', str)
  })
  this.parser.on('end', function () {
    that.emit('end')
  })
  this.parser.on('error', function (e) {
    that.emit('error', e)
  })
}

inherits(SaxSaxesjs, EventEmitter)

SaxSaxesjs.prototype.write = function (data) {
  if (typeof data !== 'string') {
    data = data.toString()
  }
  this.parser.write(data)
}

SaxSaxesjs.prototype.end = function (data) {
  if (data) {
    this.parser.write(data)
  }
  this.parser.close()
}
