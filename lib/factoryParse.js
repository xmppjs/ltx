'use strict'

module.exports = function factoryParse (parser) {
  return function parse (data) {
    var result = null
    var error = null

    parser.on('tree', function (tree) {
      result = tree
    })
    parser.on('error', function (e) {
      error = e
    })

    parser.write(data)
    parser.end()

    if (error) {
      throw error
    } else {
      return result
    }
  }
}
