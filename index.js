'use strict'

var parse = require('./lib/parse')
var Parser = require('./lib/Parser')
var escape = require('./lib/escape')
var Element = require('./lib/Element')
var equal = require('./lib/equal')
var createElement = require('./lib/createElement')

exports.Element = Element

exports.equal = equal.equal
exports.nameEqual = equal.name
exports.attrsEqual = equal.attrs
exports.childrenEqual = equal.children

exports.createElement = createElement

exports.escapeXML = escape.escapeXML
exports.escapeXMLText = escape.escapeXMLText

exports.Parser = Parser
exports.parse = parse
