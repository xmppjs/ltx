'use strict'

var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var unescapeXML = require('../escape').unescapeXML

var STATE_TEXT = 0
var STATE_IGNORE_TAG = 1
var STATE_TAG_NAME = 2
var STATE_TAG = 3
var STATE_ATTR_NAME = 4
var STATE_ATTR_EQ = 5
var STATE_ATTR_QUOT = 6
var STATE_ATTR_VALUE = 7
var STATE_ENDED = 8

function SaxLtx () {
  EventEmitter.call(this)

  this.state = STATE_TEXT
  this.remainder = undefined
  this.tagName = undefined
  this.attrs = undefined
  this.endTag = undefined
  this.selfClosing = undefined
  this.attrQuote = undefined
  this.recordStart = 0
  this.attrName = undefined
}
inherits(SaxLtx, EventEmitter)

SaxLtx.prototype._handleTagOpening = function () {
  if (!this.endTag) {
    this.emit('startElement', this.tagName, this.attrs)
    if (this.selfClosing) {
      this.emit('endElement', this.tagName)
    }
  } else {
    this.emit('endElement', this.tagName)
  }
}

SaxLtx.prototype.write = function (data) {
  if (this.state === STATE_ENDED) return

  if (typeof data !== 'string') {
    data = data.toString()
  }
  var pos = 0

  /* Anything from previous write()? */
  if (this.remainder) {
    data = this.remainder + data
    pos += this.remainder.length
    this.remainder = null
  }

  var self = this
  function endRecording () {
    if (typeof self.recordStart === 'number') {
      var recorded = data.slice(self.recordStart, pos)
      self.recordStart = undefined
      return recorded
    }
  }

  for (; pos < data.length; pos++) {
    var c = data.charCodeAt(pos)
    // console.log("state", state, "c", c, data[pos])
    switch (this.state) {
      case STATE_TEXT:
        if (c === 60 /* < */) {
          var text = endRecording()
          if (text) {
            this.emit('text', unescapeXML(text))
          }
          this.state = STATE_TAG_NAME
          this.recordStart = pos + 1
          this.attrs = {}
        }
        break
      case STATE_TAG_NAME:
        if (c === 47 /* / */ && this.recordStart === pos) {
          this.recordStart = pos + 1
          this.endTag = true
        } else if (c === 33 /* ! */ || c === 63 /* ? */) {
          this.recordStart = undefined
          this.state = STATE_IGNORE_TAG
        } else if (c <= 32 || c === 47 /* / */ || c === 62 /* > */) {
          this.tagName = endRecording()
          pos--
          this.state = STATE_TAG
        }
        break
      case STATE_IGNORE_TAG:
        if (c === 62 /* > */) {
          this.state = STATE_TEXT
        }
        break
      case STATE_TAG:
        if (c === 62 /* > */) {
          this._handleTagOpening()
          this.tagName = undefined
          this.attrs = undefined
          this.endTag = undefined
          this.selfClosing = undefined
          this.state = STATE_TEXT
          this.recordStart = pos + 1
        } else if (c === 47 /* / */) {
          this.selfClosing = true
        } else if (c > 32) {
          this.recordStart = pos
          this.state = STATE_ATTR_NAME
        }
        break
      case STATE_ATTR_NAME:
        if (c <= 32 || c === 61 /* = */) {
          this.attrName = endRecording()
          pos--
          this.state = STATE_ATTR_EQ
        }
        break
      case STATE_ATTR_EQ:
        if (c === 61 /* = */) {
          this.state = STATE_ATTR_QUOT
        }
        break
      case STATE_ATTR_QUOT:
        if (c === 34 /* " */ || c === 39 /* ' */) {
          this.attrQuote = c
          this.state = STATE_ATTR_VALUE
          this.recordStart = pos + 1
        }
        break
      case STATE_ATTR_VALUE:
        if (c === this.attrQuote) {
          var value = unescapeXML(endRecording())
          this.attrs[this.attrName] = value
          this.attrName = undefined
          this.state = STATE_TAG
        }
        break
    }
  }

  if (typeof recordStart === 'number' &&
    this.recordStart <= data.length) {
    this.remainder = data.slice(this.recordStart)
    this.recordStart = 0
  }
  /*
  var origEmit = this.emit
  this.emit = function() {
    console.log('ltx', arguments)
    origEmit.apply(this, arguments)
  }
  */
}

SaxLtx.prototype.end = function (data) {
  if (data) {
    this.write(data)
  }

  this.state = STATE_ENDED
}

module.exports = SaxLtx
