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

var SaxLtx = module.exports = function SaxLtx () {
  EventEmitter.call(this)

  var state = STATE_TEXT
  var remainder
  var tagName
  var attrs
  var endTag
  var selfClosing
  var attrQuote
  var recordStart = 0
  var attrName

  this._handleTagOpening = function (endTag, tagName, attrs) {
    if (!endTag) {
      this.emit('startElement', tagName, attrs)
      if (selfClosing) {
        this.emit('endElement', tagName)
      }
    } else {
      this.emit('endElement', tagName)
    }
  }

  this.write = function (data) {
    if (typeof data !== 'string') {
      data = data.toString()
    }
    var pos = 0

    /* Anything from previous write()? */
    if (remainder) {
      data = remainder + data
      pos += remainder.length
      remainder = null
    }

    function endRecording () {
      if (typeof recordStart === 'number') {
        var recorded = data.slice(recordStart, pos)
        recordStart = undefined
        return recorded
      }
    }

    for (; pos < data.length; pos++) {
      var c = data.charCodeAt(pos)
      // console.log("state", state, "c", c, data[pos])
      switch (state) {
        case STATE_TEXT:
          if (c === 60 /* < */) {
            var text = endRecording()
            if (text) {
              this.emit('text', unescapeXML(text))
            }
            state = STATE_TAG_NAME
            recordStart = pos + 1
            attrs = {}
          }
          break
        case STATE_TAG_NAME:
          if (c === 47 /* / */ && recordStart === pos) {
            recordStart = pos + 1
            endTag = true
          } else if (c === 33 /* ! */ || c === 63 /* ? */) {
            recordStart = undefined
            state = STATE_IGNORE_TAG
          } else if (c <= 32 || c === 47 /* / */ || c === 62 /* > */) {
            tagName = endRecording()
            pos--
            state = STATE_TAG
          }
          break
        case STATE_IGNORE_TAG:
          if (c === 62 /* > */) {
            state = STATE_TEXT
          }
          break
        case STATE_TAG:
          if (c === 62 /* > */) {
            this._handleTagOpening(endTag, tagName, attrs)
            tagName = undefined
            attrs = undefined
            endTag = undefined
            selfClosing = undefined
            state = STATE_TEXT
            recordStart = pos + 1
          } else if (c === 47 /* / */) {
            selfClosing = true
          } else if (c > 32) {
            recordStart = pos
            state = STATE_ATTR_NAME
          }
          break
        case STATE_ATTR_NAME:
          if (c <= 32 || c === 61 /* = */) {
            attrName = endRecording()
            pos--
            state = STATE_ATTR_EQ
          }
          break
        case STATE_ATTR_EQ:
          if (c === 61 /* = */) {
            state = STATE_ATTR_QUOT
          }
          break
        case STATE_ATTR_QUOT:
          if (c === 34 /* " */ || c === 39 /* ' */) {
            attrQuote = c
            state = STATE_ATTR_VALUE
            recordStart = pos + 1
          }
          break
        case STATE_ATTR_VALUE:
          if (c === attrQuote) {
            var value = unescapeXML(endRecording())
            attrs[attrName] = value
            attrName = undefined
            state = STATE_TAG
          }
          break
      }
    }

    if (typeof recordStart === 'number' &&
      recordStart <= data.length) {
      remainder = data.slice(recordStart)
      recordStart = 0
    }
  }
  /*
  var origEmit = this.emit
  this.emit = function() {
    console.log('ltx', arguments)
    origEmit.apply(this, arguments)
  }
  */
}
inherits(SaxLtx, EventEmitter)

SaxLtx.prototype.end = function (data) {
  if (data) {
    this.write(data)
  }

  /* Uh, yeah */
  this.write = function () {}
}
