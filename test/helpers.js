'use strict'

var exports = module.exports = {}

var Parser = require('../lib/Parser')

exports.parseChunks = function (chunks) {
  var p = new Parser()

  var result = null
  var error = null

  p.on('tree', function (tree) {
    result = tree
  })
  p.on('error', function (e) {
    error = e
  })

  for (var chunk of chunks) {
    p.write(chunk)
  }
  p.end()

  if (error) {
    throw error
  } else {
    return result
  }
}
