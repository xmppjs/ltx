'use strict'

var parse = require('./parse')
var Parser = require('./Parser')
var escape = require('./escape')
var Element = require('./Element')

/**
 * Element
 */
exports.Element = Element
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
