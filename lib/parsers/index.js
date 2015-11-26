'use strict'

module.exports = [
  // 'easysax', // BROKEN
  'ltx',
  'node-expat',
  'node-xml',
  'sax'
].map(function (name) {
  return require('./' + name)
})
