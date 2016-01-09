'use strict'

exports.escapeXML = function escapeXML (s) {
  return s
    .replace(/\&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

exports.unescapeXML = function unescapeXML (s) {
  return s
    .replace(/\&(amp|#38);/g, '&')
    .replace(/\&(lt|#60);/g, '<')
    .replace(/\&(gt|#62);/g, '>')
    .replace(/\&(quot|#34);/g, '"')
    .replace(/\&(apos|#39);/g, "'")
}

exports.escapeXMLText = function escapeXMLText (s) {
  return s
    .replace(/\&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

exports.unescapeXMLText = function unescapeXMLText (s) {
  return s
    .replace(/\&(amp|#38);/g, '&')
    .replace(/\&(lt|#60);/g, '<')
    .replace(/\&(gt|#62);/g, '>')
}
