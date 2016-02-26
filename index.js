'use strict'

var parse = require('./lib/parse')
var Parser = require('./lib/Parser')
var escape = require('./lib/escape')
var Element = require('./lib/Element')
var equal = require('./lib/equal')
var createElement = require('./lib/createElement')
var tag = require('./lib/tag')

exports = module.exports = tag

exports.Element = Element

exports.equal = equal.equal
exports.nameEqual = equal.name
exports.attrsEqual = equal.attrs
exports.childrenEqual = equal.children

exports.createElement = createElement

exports.escapeXML = escape.escapeXML
exports.unescapeXML = escape.unescapeXML
exports.escapeXMLText = escape.escapeXMLText
exports.unescapeXMLText = escape.unescapeXMLText

exports.Parser = Parser
exports.parse = parse

exports.tag = tag
