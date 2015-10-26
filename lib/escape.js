'use strict'

exports.escapeXML = function escapeXML (s) {
  return s
    .replace(/\&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/"/g, '&apos;')
}

exports.escapeXMLText = function escapeXMLText (s) {
  return s
    .replace(/\&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
