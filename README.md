# Less-Than XML

`<xml for=\"JavaScript\">`

[![build status](https://img.shields.io/travis/node-xmpp/ltx/master.svg?style=flat-square)](https://travis-ci.org/node-xmpp/ltx/branches)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

ltx is a fast XML builder, parser and manipulation library for JavaScript.

The builder is a convenient and succinct API to build XML documents represented in memory as JavaScript primitives that can be serialized to XML strings. It provides a [JSX](https://facebook.github.io/jsx/) compatible API as well.

The parser can parse XML documents or streams and support different backends.

Features:
* Succinct API to build and manipulate XML objects
* parse XML strings
* parse XML streams
* multiple parser backends
  * [sax-js](https://github.com/isaacs/sax-js)
  * [node-xml](https://github.com/dylang/node-xml)
  * [node-expat](https://github.com/node-xmpp/node-expat)
  * [libxmljs](https://github.com/polotek/libxmljs)
  * [ltx](https://github.com/node-xmpp/ltx/blob/master/lib/parsers/ltx.js) (default and fastest see [Benchmark](#benchmark))
* [JSX](https://facebook.github.io/jsx/) compatible (use `ltx.createElement` pragma)
* [tagged template](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) support `` ltx`<foo bar="${baz}">` ``

## Install

`npm install ltx`

## Documentation

For documentation please see http://node-xmpp.org/doc/ltx.html

## Benchmark

```
npm run benchmark
```

## Test

```
npm install -g standard browserify
npm test
```

## Licence

MIT
