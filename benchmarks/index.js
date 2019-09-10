'use strict'

const suites = [
  require('./ltx'),
  require('./parsers'),
  require('./parse'),
  require('./write')
]

suites.forEach(function (suite) {
  console.log('suite', suite.name)
  suite
    .on('cycle', function (event) {
      console.log(event.target.toString())
    })
    .on('complete', function () {
      console.log('Fastest is "' + this.filter('fastest').map('name') + '"')
    })
    .run({ async: false })
  console.log('\n')
})
