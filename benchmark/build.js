var browserify = require('browserify');
var path = require('path');
var b = browserify({
    debug: true,
    require: ["ltx/lib/sax_saxjs.js", "ltx/lib/sax_easysax.js"]
});
b.addEntry('../benchmark/browser_benchmark.js');

var fs = require('fs');

fs.writeFileSync('index.js', b.bundle());
