'use strict';

var parse = require('./parse')

/**
 * The only (relevant) data structure
 */
exports.Element = require('./dom-element')

/**
 * Helper
 */
exports.escapeXml = require('./element').escapeXml

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
