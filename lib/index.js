var element = require('./element');
var parse = require('./parse');

/**
 * The only (relevant) data structure
 */
exports.Element = element.Element;
/**
 * Helper
 */
exports.escapeXml = element.escapeXml;

/**
 * DOM parser interface
 */
exports.parse = parse.parse;
/**
 * SAX parser interface
 */
exports.Parser = parse.Parser;
exports.availableSaxParsers = parse.availableSaxParsers;
exports.bestSaxParser = parse.bestSaxParser;
