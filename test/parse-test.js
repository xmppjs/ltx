var vows = require('vows'),
assert = require('assert'),
ltx = require('./../lib/index');

ltx.availableSaxParsers.forEach(function(saxParser) {
    var parse = function(s) {
        return ltx.parse(s, saxParser);
    };
    vows.describe('ltx with ' + saxParser.name).addBatch({
        'DOM parsing': {
            'simple document': function() {
                var el = parse('<root/>');
                assert.equal(el.name, 'root');
                assert.equal(0, el.children.length);
            },
            'text with commas': function() {
                var el = parse("<body>sa'sa'1'sasa</body>");
                assert.equal("sa'sa'1'sasa", el.getText());
            },
            'text with entities': function() {
                var el = parse("<body>&lt;&gt;&amp;&quot;&apos;</body>");
                assert.equal("<>&\"'", el.getText());
            },
            'attribute with entities': function() {
		var el = parse("<body title='&lt;&gt;&amp;&quot;&apos;'/>");
		assert.equal("<>&\"'", el.attrs.title);
            },
            'erroneous document raises error': function() {
                assert.throws(function() {
                    parse('<root></toor>');
                });
            },
            'incomplete document raises error': function() {
                assert.throws(function() {
                    parse('<root>');
                });
            },
            'namespace declaration': function() {
                var el = parse("<root xmlns='https://github.com/astro/ltx'/>");
                assert.equal(el.name, 'root');
                assert.equal(el.attrs.xmlns, 'https://github.com/astro/ltx');
                assert.ok(el.is('root', 'https://github.com/astro/ltx'));
            },
            'namespace declaration with prefix': function() {
                var el = parse("<x:root xmlns:x='https://github.com/astro/ltx'/>");
                assert.equal(el.name, 'x:root');
                assert.equal(el.getName(), 'root');
                assert.ok(el.is('root', 'https://github.com/astro/ltx'));
            },
	    'buffer': function() {
		var buf = new Buffer('<root/>');
		var el = parse(buf);
                assert.equal(el.name, 'root');
                assert.equal(0, el.children.length);
	    },
	    'utf-8 text': function() {
		var el = parse('<?xml version="1.0" encoding="utf-8"?><text>Möwe</text>');
                assert.equal(el.name, 'text');
                assert.equal(el.getText(), "Möwe");
	    },
	    'iso8859-1 text': function() {
		var el = parse('<?xml version="1.0" encoding="iso-8859-1"?><text>M\xF6we</text>');
                assert.equal(el.name, 'text');
                assert.equal(el.getText(), "Möwe");
	    }
        },
	'SAX parsing': {
	    'XMPP stream': function() {
		var parser = new saxParser();
		var events = [];
		parser.on('startElement', function(name, attrs) {
		    events.push({ start: name, attrs: attrs });
		});
		parser.on('endElement', function(name) {
		    events.push({ end: name });
		});
		parser.on('text', function(s) {
		    events.push({ text: s });
		});
		parser.write("<?xml version='1.0'?><stream:stream xmlns='jabber:client'");
		parser.write(" xmlns:stream='http://etherx.jabber.org/streams' id='5568");
		assert.equal(events.length, 0);
		parser.write("90365' from='jabber.ccc.de' version='1.0' xml:lang='en'><");
		assert.equal(events.length, 1);
        testStanza(events[0], {name:'stream:stream', attrs:{
            xmlns:"jabber:client",
            'xmlns:stream':"http://etherx.jabber.org/streams",
            id:"556890365",
            from:"jabber.ccc.de",
            version:"1.0",
            'xml:lang':"en"
        }});
		parser.write("stream:features><starttls xmlns='urn:ietf:params:xml:ns:x");
		assert.equal(events.length, 2);
        testStanza(events[1], {name:'stream:features', attrs:{}});
		parser.write("mpp-tls'/><mechanisms xmlns='urn:ietf:params:xml:ns:xmpp-");
		assert.equal(events.length, 4);
        testStanza(events[2], {name:'starttls', attrs:{
            xmlns:"urn:ietf:params:xml:ns:xmpp-tls"
        }});
        assert.equal(events[3].end, 'starttls');
		parser.write("sasl'><mechanism>PLAIN</mechanism><mechanism>DIGEST-MD5</");
		assert.ok(events.length >= 9);
		parser.write("mechanism><mechanism>SCRAM-SHA-1</mechanism></mechanisms>");
		assert.equal(events.length, 15);
		parser.write("<register xmlns='http://jabber.org/features/iq-register'/");
		assert.equal(events.length, 15);
		parser.write("></stream:features>");
		assert.equal(events.length, 18);
        },
        'bug: partial attrs': function() {
            var parser = new saxParser();
            var events = [];
            parser.on('startElement', function(name, attrs) {
                events.push({ start: name, attrs:attrs });
            });
            parser.on('endElement', function(name) {
                events.push({ end: name });
            });
            parser.on('text', function(s) {
                events.push({ text: s });
            });
            parser.write("<");
            parser.write("stream:features");
            parser.write(">");
            parser.write("<");
            parser.write("mechanisms");
            parser.write(" ");
            parser.write("xmlns");
            parser.write("=\"");
            parser.write("urn:ietf:params:xml:ns:xmpp-sasl");
            parser.write("\"");
            parser.write(">");
            assert.equal(events.length, 2);
            testStanza(events[0], {name:'stream:features', attrs:{}});
            testStanza(events[1], {name:'mechanisms', attrs:{
                xmlns:"urn:ietf:params:xml:ns:xmpp-sasl"
            }});
	    }
	}
    }).export(module);
});

function testStanza(data, stanza) {
    assert.equal(data.start, stanza.name);
    assert.equal(Object.keys(data.attrs).length,
                    Object.keys(stanza.attrs).length);
    for (var k in stanza.attrs)
        assert.equal(data.attrs[k], stanza.attrs[k]);
}
