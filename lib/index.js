'use strict';

var parse = require('./parse')
var Parser = require('./Parser')
var escape = require('./escape')
var Element = require('./Element')
var DOMElement = require('./DOMElement')

/**
 * The only (relevant) data structure
 */
exports.Element = Element
exports.createElement = Element.createElement

exports.DOMElement = DOMElement
exports.createDOMElement = DOMElement.createElement

/**
 * Helper
 */
exports.escapeXML = escape.escapeXML
exports.escapeXMLText = escape.escapeXMLText

/**
 * parser interface
 */
exports.Parser = Parser
exports.parse = parse
