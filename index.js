'use strict'

var core = require('./core')
var factoryParse = require('./factoryParse')
var Parser = require('./Parser')

core.parse = factoryParse(new Parser())
core.Parser = Parser
core.factoryParse = factoryParse

module.exports = core
