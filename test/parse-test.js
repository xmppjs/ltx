"use strict";

var vows = require("vows");
var assert = require("assert");
var ltx = require("..");
var parsers = require("../lib/parsers");

parsers.forEach(function (Parser) {
  if (Parser.name === "SaxSaxesjs") return;
  var parse = function (s) {
    return ltx.parse(s, { Parser: Parser });
  };
  vows
    .describe("ltx with " + Parser.name)
    .addBatch({
      "DOM parsing": {
        "simple document": function () {
          var el = parse("<root/>");
          assert.strictEqual(el.name, "root");
          assert.strictEqual(0, el.children.length);
        },
        "text with commas": function () {
          var el = parse("<body>sa'sa'1'sasa</body>");
          assert.strictEqual("sa'sa'1'sasa", el.getText());
        },
        "text with entities": function () {
          var el = parse("<body>&lt;&gt;&amp;&quot;&apos;</body>");
          assert.strictEqual("<>&\"'", el.getText());
        },
        "attribute with entities": function () {
          var el = parse("<body title='&lt;&gt;&amp;&quot;&apos;'/>");
          assert.strictEqual("<>&\"'", el.attrs.title);
        },
        "erroneous document raises error": function () {
          assert.throws(function () {
            parse("<root></toor>");
          });
        },
        "incomplete document raises error": function () {
          assert.throws(function () {
            parse("<root>");
          });
        },
        "namespace declaration": function () {
          var el = parse("<root xmlns='https://github.com/astro/ltx'/>");
          assert.strictEqual(el.name, "root");
          assert.strictEqual(el.attrs.xmlns, "https://github.com/astro/ltx");
          assert.ok(el.is("root", "https://github.com/astro/ltx"));
        },
        "namespace declaration with prefix": function () {
          var el = parse("<x:root xmlns:x='https://github.com/astro/ltx'/>");
          assert.strictEqual(el.name, "x:root");
          assert.strictEqual(el.getName(), "root");
          assert.ok(el.is("root", "https://github.com/astro/ltx"));
        },
        buffer: function () {
          var buf = Buffer.from("<root/>");
          var el = parse(buf);
          assert.strictEqual(el.name, "root");
          assert.strictEqual(0, el.children.length);
        },
        "utf-8 text": function () {
          var el = parse(
            '<?xml version="1.0" encoding="utf-8"?><text>Möwe</text>'
          );
          assert.strictEqual(el.name, "text");
          assert.strictEqual(el.getText(), "Möwe");
        },
        "iso8859-1 text": function () {
          if (Parser.name === "SaxLibxmljs") return;
          var el = parse(
            '<?xml version="1.0" encoding="iso-8859-1"?><text>M\xF6we</text>'
          );
          assert.strictEqual(el.name, "text");
          assert.strictEqual(el.getText(), "Möwe");
        },
      },
      "SAX parsing": {
        "XMPP stream": function () {
          var parser = new Parser();
          var events = [];
          parser.on("startElement", function (name, attrs) {
            events.push({ start: name, attrs: attrs });
          });
          parser.on("endElement", function (name) {
            events.push({ end: name });
          });
          parser.on("text", function (s) {
            events.push({ text: s });
          });
          parser.write(
            "<?xml version='1.0'?><stream:stream xmlns='jabber:client'"
          );
          parser.write(
            " xmlns:stream='http://etherx.jabber.org/streams' id='5568"
          );
          assert.strictEqual(events.length, 0);
          parser.write(
            "90365' from='jabber.ccc.de' version='1.0' xml:lang='en'><"
          );
          assert.strictEqual(events.length, 1);
          testStanza(events[0], {
            name: "stream:stream",
            attrs: {
              xmlns: "jabber:client",
              "xmlns:stream": "http://etherx.jabber.org/streams",
              id: "556890365",
              from: "jabber.ccc.de",
              version: "1.0",
              "xml:lang": "en",
            },
          });
          parser.write(
            "stream:features><starttls xmlns='urn:ietf:params:xml:ns:x"
          );
          assert.strictEqual(events.length, 2);
          testStanza(events[1], { name: "stream:features", attrs: {} });
          parser.write(
            "mpp-tls'/><mechanisms xmlns='urn:ietf:params:xml:ns:xmpp-"
          );
          assert.strictEqual(events.length, 4);
          testStanza(events[2], {
            name: "starttls",
            attrs: {
              xmlns: "urn:ietf:params:xml:ns:xmpp-tls",
            },
          });
          assert.strictEqual(events[3].end, "starttls");
          parser.write(
            "sasl'><mechanism>PLAIN</mechanism><mechanism>DIGEST-MD5</"
          );
          assert.ok(events.length >= 9);
          parser.write(
            "mechanism><mechanism>SCRAM-SHA-1</mechanism></mechanisms>"
          );
          assert.strictEqual(events.length, 15);
          parser.write(
            "<register xmlns='http://jabber.org/features/iq-register'/"
          );
          assert.strictEqual(events.length, 15);
          parser.write("></stream:features>");
          assert.strictEqual(events.length, 18);
        },
        "bug: partial attrs": function () {
          var parser = new Parser();
          var events = [];
          parser.on("startElement", function (name, attrs) {
            events.push({ start: name, attrs: attrs });
          });
          parser.on("endElement", function (name) {
            events.push({ end: name });
          });
          parser.on("text", function (s) {
            events.push({ text: s });
          });
          parser.write("<");
          parser.write("stream:features");
          // otherwise libxmljs complains stream is not a defined NS
          parser.write(' xmlns:stream="http://etherx.jabber.org/streams"');
          parser.write(">");
          parser.write("<");
          parser.write("mechanisms");
          parser.write(" ");
          parser.write("xmlns");
          parser.write('="');
          parser.write("urn:ietf:params:xml:ns:xmpp-sasl");
          parser.write('"');
          parser.write(">");
          assert.strictEqual(events.length, 2);
          testStanza(events[0], {
            name: "stream:features",
            attrs: {
              "xmlns:stream": "http://etherx.jabber.org/streams",
            },
          });
          testStanza(events[1], {
            name: "mechanisms",
            attrs: {
              xmlns: "urn:ietf:params:xml:ns:xmpp-sasl",
            },
          });
        },
        "bug: elements in comments": function () {
          var parser = new Parser();
          var events = [];
          parser.on("startElement", function (name, attrs) {
            events.push({ start: name, attrs: attrs });
          });
          parser.on("endElement", function (name) {
            events.push({ end: name });
          });
          parser.on("comment", function (s) {
            events.push({ comment: s });
          });
          parser.write(
            "<?xml version='1.0'?><!-- <foo></foo><bar></bar> --><root></root>"
          );
          assert.deepStrictEqual(events, [
            { start: "root", attrs: {} },
            { end: "root" },
          ]);
        },
      },
    })
    .export(module);
});

function testStanza(data, stanza) {
  assert.strictEqual(data.start, stanza.name);
  assert.strictEqual(
    Object.keys(data.attrs).length,
    Object.keys(stanza.attrs).length
  );
  for (var k in stanza.attrs) {
    assert.strictEqual(data.attrs[k], stanza.attrs[k]);
  }
}
