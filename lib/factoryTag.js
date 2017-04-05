'use strict'

var tagString = require('./tagString')

module.exports = function factoryTag (parse) {
  return function tag (/* [literals], ...substitutions */) {
    const p = parse
    return p(tagString.apply(null, arguments))
  }
}
