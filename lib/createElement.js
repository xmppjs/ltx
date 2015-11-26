'use strict'

// JSX compatible

var Element = require('./Element')

module.exports = function createElement (name, attrs /*, child1, child2, ...*/) {
  var el = new Element(name, attrs)

  var children = Array.prototype.slice.call(arguments, 2)

  children.forEach(function (child) {
    el.cnode(child)
  })
  return el
}
