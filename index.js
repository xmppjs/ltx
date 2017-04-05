'use strict'

var core = require('./core')
var Parser = require('./lib/Parser')

var parse = require('./lib/parse')
var factoryParse = require('./lib/factoryParse')

var tag = require('./lib/tag')
var factoryTag = require('./lib/factoryTag')

exports = module.exports = function ltx () {
  return tag.apply(null, arguments)
}

for (var i in core) exports[i] = core[i]

exports.Parser = Parser
exports.parse = parse
exports.factoryParse = factoryParse
exports.tag = tag
exports.factoryTag = factoryTag
