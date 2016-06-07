'use strict'

var nameEqual = require('./equal').name

module.exports = function match (a, b) {
  if (!nameEqual(a, b)) return false
  var attrs = a.attrs
  var keys = Object.keys(attrs)
  var length = keys.length

  for (var i = 0, l = length; i < l; i++) {
    var key = keys[i]
    var value = attrs[key]
    if (value == null || b.attrs[key] == null) { // === null || undefined
      if (value !== b.attrs[key]) return false
    } else if (value.toString() !== b.attrs[key].toString()) {
      return false
    }
  }
  return true
}
