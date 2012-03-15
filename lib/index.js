var element = require('./element');
var parse = require('./parse');

exports.Element = element.Element;
exports.escapeXml = element.escapeXml;

exports.Parser = parse.Parser;
exports.parse = parse.parse;
exports.availableSaxParsers = parse.availableSaxParsers;
exports.bestSaxParser = parse.bestSaxParser;
