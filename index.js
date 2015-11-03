'use strict'

var parse = require('./lib/parse')
var Parser = require('./lib/Parser')
var escape = require('./lib/escape')
var Element = require('./lib/Element')

/**
 * Element
 */
exports.Element = Element
exports.equals = Element.equals
exports.createElement = Element.createElement

/**
 * Helpers
 */
exports.escapeXML = escape.escapeXML
exports.escapeXMLText = escape.escapeXMLText

/**
 * parser interface
 */
exports.Parser = Parser
exports.parse = parse
