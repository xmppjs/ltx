/* Cause browserify to bundle SAX parsers: */
require('./sax_easysax');
require('./sax_saxjs');

/* SHIM */
module.exports = require('./index');