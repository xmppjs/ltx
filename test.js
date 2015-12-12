// var Parser = require('./ltx.old')
var Parser = require('./lib/parsers/ltx')

var parser = new Parser()

parser.on('startElement', function (name, attrs) {
  console.log('start', name, attrs)
})

parser.on('endElement', function (name) {
  console.log('end', name)
})

// parser.write('<')
// parser.write('stream:features')
// otherwise libxmljs complains stream is not a defined NS
// parser.write(' xmlns:stream="http://etherx.jabber.org/streams"')
// parser.write('>')
parser.write('<')
parser.write('mechanisms/>')
// parser.write(' ')
// parser.write('xmlns')
// parser.write('="')
// parser.write('urn:ietf:params:xml:ns:xmpp-sasl')
// parser.write('"')
// parser.write('/>')
// parser.write('<mechanisms/>')

// parser.write('<foobar:bar hello="bar"/>')
