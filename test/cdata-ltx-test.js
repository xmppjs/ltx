'use strict';

var vows = require('vows')
  , assert = require('assert')
  , ltx = require('./../lib/index')
  , SaxLtxParser = ltx.availableSaxParsers.filter(function(saxParser) {
            return (saxParser.name === 'SaxLtx');
        }
  )[0];

function parse(xml) {
    return ltx.parse(xml, SaxLtxParser);
}

vows.describe('sax_ltx').addBatch({
    'CDATA parsing': {
        'issue-19: parse CDATA content as text': function() {
            var el = parse('<root><![CDATA[Content]]></root>');
            assert.equal(el.name, 'root');
            assert.equal(el.getText(), 'Content');
        }
    }
}).export(module)
