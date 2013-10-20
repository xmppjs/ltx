/* Cause browserify to bundle SAX parsers: */
//require('./sax_easysax');
//require('./sax_saxjs');
var parse = require('./parse');
parse.availableSaxParsers.push(parse.bestSaxParser = require('./sax_ltx'));

/* SHIM */
module.exports = require('./index');
