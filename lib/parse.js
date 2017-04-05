'use strict'

var factoryParse = require('./factoryParse')
var Parser = require('./Parser')

module.exports = factoryParse(Parser)

console.log(module.exports('<foo/>'))
console.log(module.exports('<bar/>'))
