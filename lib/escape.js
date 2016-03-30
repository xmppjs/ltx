'use strict'

var escapeXMLTable = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;'
}

function escapeXMLReplace (match) {
  return escapeXMLTable[match]
}

var unescapeXMLTable = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&quot;': '"',
  '&#34;': '"',
  '&apos;': "'",
  '&#39;': "'"
}

function unescapeXMLReplace (match) {
  return unescapeXMLTable[match]
}

exports.escapeXML = function escapeXML (s) {
  return s.replace(/\&|<|>|"|'/g, escapeXMLReplace)
}

exports.unescapeXML = function unescapeXML (s) {
  return s.replace(/\&(amp|#38|lt|#60|gt|#62|quot|#34|apos|#39);/g, unescapeXMLReplace)
}

exports.escapeXMLText = function escapeXMLText (s) {
  return s.replace(/\&|<|>/g, escapeXMLReplace)
}

exports.unescapeXMLText = function unescapeXMLText (s) {
  return s.replace(/\&(amp|#38|lt|#60|gt|#62);/g, unescapeXMLReplace)
}
