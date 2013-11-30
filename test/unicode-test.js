var vows = require('vows')
  , assert = require('assert')
  , Element = require('../lib/element').Element

vows.describe('unicode').addBatch({
    'unicode forming': {
        'issue-29': function() {
            var text = 'Hello ɝ'
            var element = new Element('iq')
            element.t(text)
            assert.equal(element.toString(), '<iq>' + text + '</iq>')
        }
    }
}).export(module)
