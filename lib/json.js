'use strict'

var Element = require('./Element')

module.exports.to = function to (el) {
  return [
    el.name,
    el.attrs,
    el.children.map(function (child) {
      return typeof child === 'string' ? child : to(child)
    })
  ]
}

module.exports.from = function from (arr) {
  var el = new Element(arr[0], arr[1])
  arr[2].forEach(function (child) {
    if (typeof child === 'string') el.t(el)
    else el.cnode(from(child))
  })
}
