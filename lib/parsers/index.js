'use strict'

module.exports = [
  // 'easysax',
  'ltx',
  'node-expat',
  'node-xml',
  'sax'
].map(function (name) {
  return require('./' + name)
})
