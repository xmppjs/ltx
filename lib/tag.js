'use strict'

var escape = require('./escape').escapeXML
var parse = require('./parse')

module.exports = function tag (/* [literals], ...substitutions */) {
  var literals = arguments[0]
  var substitutions = Array.prototype.slice.call(arguments, 1)

  var str = ''

  for (var i = 0; i < substitutions.length; i++) {
    str += literals[i]
    str += escape(substitutions[i])
  }
  str += literals[literals.length - 1]

  return parse(str)
}
