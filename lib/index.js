'use strict';

var parse = require('./parse')
var element = require('./element')
var Element = element.Element
var DOMElement = require('./dom-element')

/**
 * The only (relevant) data structure
 */
exports.Element = DOMElement
exports.createElement = Element.createElement

exports.DOMElement = DOMElement
exports.createDOMElement = DOMElement.createElement

/**
 * Helper
 */
exports.escapeXml = element.escapeXml

/**
 * DOM parser interface
 */
exports.parse = parse.parse
exports.Parser = parse.Parser

/**
 * SAX parser interface
 */
exports.availableSaxParsers = parse.availableSaxParsers
exports.bestSaxParser = parse.bestSaxParser
