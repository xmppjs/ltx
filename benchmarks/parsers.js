'use strict'

/*
 * benchmark the parsing speed of the supported backends
 * difference with parse.js benchmark is that this doesn't use ltx at all
*/

var benchmark = require('benchmark')
var nodeXml = require('node-xml')
var libxml = require('libxmljs')
var expat = require('node-expat')
var sax = require('sax')
var saxes = require('saxes')
var LtxSaxParser = require('../lib/parsers/ltx')
var fs = require('fs')
var path = require('path')

var XML = fs.readFileSync(path.join(__dirname, 'data.xml'), 'utf8')

function NodeXmlParser () {
  var parser = new nodeXml.SaxParser(function (cb) {})
  this.parse = function (s) {
    parser.parseString(s)
  }
  this.name = 'node-xml'
}
function LibXmlJsParser () {
  var parser = new libxml.SaxPushParser(function (cb) {})
  this.parse = function (s) {
    parser.push(s, false)
  }
  this.name = 'libxmljs'
}
function SaxParser () {
  var parser = sax.parser()
  this.parse = function (s) {
    parser.write(s).close()
  }
  this.name = 'sax'
}
function SaxesParser () {
  var parser = new saxes.SaxesParser({ fragment: true })
  this.parse = function (s) {
    parser.write(s).close()
  }
  this.name = 'saxes'
}
function ExpatParser () {
  var parser = new expat.Parser()
  this.parse = function (s) {
    parser.parse(s, false)
  }
  this.name = 'node-expat'
}
function LtxParser () {
  var parser = new LtxSaxParser()
  this.parse = function (s) {
    parser.write(s)
  }
  this.name = 'ltx'
}

var parsers = [
  SaxParser,
  SaxesParser,
  NodeXmlParser,
  LibXmlJsParser,
  ExpatParser,
  LtxParser
].map(function (Parser) {
  return new Parser()
})

var suite = new benchmark.Suite('XML parsers comparison')

parsers.forEach(function (parser) {
  parser.parse('<r>')
  suite.add(parser.name, function () {
    parser.parse(XML)
  })
})

module.exports = suite
