'use strict'

var escape = require('./lib/escape')
var Element = require('./lib/Element')
var equal = require('./lib/equal')
var createElement = require('./lib/createElement')
var tagString = require('./lib/tagString')
var is = require('./lib/is')
var clone = require('./lib/clone')
var stringify = require('./lib/stringify')

exports.Element = Element

exports.equal = equal.equal
exports.nameEqual = equal.name
exports.attrsEqual = equal.attrs
exports.childrenEqual = equal.children

exports.isNode = is.isNode
exports.isElement = is.isElement
exports.isText = is.isText

exports.clone = clone
exports.createElement = createElement

exports.escapeXML = escape.escapeXML
exports.unescapeXML = escape.unescapeXML
exports.escapeXMLText = escape.escapeXMLText
exports.unescapeXMLText = escape.unescapeXMLText

exports.tagString = tagString

exports.stringify = stringify
