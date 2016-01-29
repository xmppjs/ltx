'use strict'

var readdir = require('fs').readdirSync
var basename = require('path').basename

readdir(__dirname).forEach(function (file) {
  if (file === basename(__filename)) return

  var suite = require('./' + file)
  console.log('suite', suite.name)
  suite
  .on('cycle', function (event) {
    console.log(event.target.toString())
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({'async': false})
  console.log('\n')
})
