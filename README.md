# ltx

`JavaScript XML library`

ltx is a fast XML builder, parser, serialization and manipulation library for JavaScript.

The builder is a convenient and succinct API to build XML documents represented in memory as JavaScript primitives that can be serialized to XML strings.

The parser can parse XML documents or streams and support [multiple parsers](#parsers).

Features:

- succinct API to build and manipulate XML objects
- parse XML strings
- parse XML streams
- [multiple parser backends](#parsers)
- [JSX](https://facebook.github.io/jsx/) compatible (with `ltx.createElement` pragma)
- [tagged template](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) support `` ltx`<foo bar="${baz}">` ``

## Install

`npm install ltx`

## Parsers

By default ltx uses its own parser which is the fastest but doesn't support advanced XML features.
ltx supports third party parsers when such features are needed.

| parser                                            | ops/sec | JS  | stream |
| :------------------------------------------------ | ------: | :-: | :----: |
| [node-xml](https://github.com/dylang/node-xml)    |  22,292 |  ☑  |   ☑    |
| [libxmljs](https://github.com/polotek/libxmljs)   |  48,116 |  ☐  |   ☐    |
| [node-expat](https://github.com/astro/node-expat) |  63,805 |  ☐  |   ☑    |
| [sax-js](https://github.com/isaacs/sax-js)        |  79,375 |  ☑  |   ☑    |
| [saxes](https://github.com/lddubeau/saxes)        | 168,263 |  ☑  |   ☑    |
| **[ltx/src/parsers/ltx](lib/parsers/ltx.js)**     | 527,728 |  ☑  |   ☑    |

From [ltx/benchmarks/parsers.js](benchmarks/parsers.js), higher is better.
Node.js v14.17.0 - AMD Ryzen 9 5900HX

## Benchmark

```
npm run benchmark
```

## Test

```
npm install
npm test
```
