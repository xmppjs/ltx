import vows from "vows";
import assert from "assert";
import _parse from "../lib/parse.js";
import parsers from "../lib/parsers.js";

/* globals Buffer */

for (const Parser of parsers) {
  if (Parser.name === "SaxSaxesjs") continue;
  // eslint-disable-next-line no-inner-declarations
  function parse(s) {
    return _parse(s, { Parser: Parser });
  }
  vows
    .describe(`parse with ${Parser.name} parser`)
    .addBatch({
      "DOM parsing": {
        "simple document": () => {
          const el = parse("<root/>");
          assert.strictEqual(el.name, "root");
          assert.strictEqual(0, el.children.length);
        },
        "text with commas": () => {
          const el = parse("<body>sa'sa'1'sasa</body>");
          assert.strictEqual("sa'sa'1'sasa", el.getText());
        },
        "text with entities": () => {
          const el = parse("<body>&lt;&gt;&amp;&quot;&apos;</body>");
          assert.strictEqual("<>&\"'", el.getText());
        },
        "attribute with entities": () => {
          const el = parse("<body title='&lt;&gt;&amp;&quot;&apos;'/>");
          assert.strictEqual("<>&\"'", el.attrs.title);
        },
        "erroneous document raises error": () => {
          assert.throws(() => {
            parse("<root></toor>");
          });
        },
        "incomplete document raises error": () => {
          assert.throws(() => {
            parse("<root>");
          });
        },
        "namespace declaration": () => {
          const el = parse("<root xmlns='https://github.com/astro/ltx'/>");
          assert.strictEqual(el.name, "root");
          assert.strictEqual(el.attrs.xmlns, "https://github.com/astro/ltx");
          assert.ok(el.is("root", "https://github.com/astro/ltx"));
        },
        "namespace declaration with prefix": () => {
          const el = parse("<x:root xmlns:x='https://github.com/astro/ltx'/>");
          assert.strictEqual(el.name, "x:root");
          assert.strictEqual(el.getName(), "root");
          assert.ok(el.is("root", "https://github.com/astro/ltx"));
        },
        buffer: () => {
          const buf = Buffer.from("<root/>");
          const el = parse(buf);
          assert.strictEqual(el.name, "root");
          assert.strictEqual(0, el.children.length);
        },
        "utf-8 text": () => {
          const el = parse(
            '<?xml version="1.0" encoding="utf-8"?><text>Möwe</text>'
          );
          assert.strictEqual(el.name, "text");
          assert.strictEqual(el.getText(), "Möwe");
        },
        "iso8859-1 text": () => {
          if (Parser.name === "SaxLibxmljs") return;
          const el = parse(
            '<?xml version="1.0" encoding="iso-8859-1"?><text>M\u00F6we</text>'
          );
          assert.strictEqual(el.name, "text");
          assert.strictEqual(el.getText(), "Möwe");
        },
      },
      "SAX parsing": {
        "XMPP stream": () => {
          const parser = new Parser();
          const events = [];
          parser.on("startElement", (name, attrs) => {
            events.push({ start: name, attrs: attrs });
          });
          parser.on("endElement", (name) => {
            events.push({ end: name });
          });
          parser.on("text", (s) => {
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
        "bug: partial attrs": () => {
          const parser = new Parser();
          const events = [];
          parser.on("startElement", (name, attrs) => {
            events.push({ start: name, attrs: attrs });
          });
          parser.on("endElement", (name) => {
            events.push({ end: name });
          });
          parser.on("text", (s) => {
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
        "bug: elements in comments": () => {
          const parser = new Parser();
          const events = [];
          parser.on("startElement", (name, attrs) => {
            events.push({ start: name, attrs: attrs });
          });
          parser.on("endElement", (name) => {
            events.push({ end: name });
          });
          parser.on("comment", (s) => {
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
    .run();
}

function testStanza(data, stanza) {
  assert.strictEqual(data.start, stanza.name);
  assert.strictEqual(
    Object.keys(data.attrs).length,
    Object.keys(stanza.attrs).length
  );
  for (const k in stanza.attrs) {
    assert.strictEqual(data.attrs[k], stanza.attrs[k]);
  }
}
