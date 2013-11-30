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
        },
        'issue-29 test #2': function() {
           var text = '니코드<'
           var element = new Element(
               'message', { to: 'you@server.com', type: 'chat' }
           )
               .c('body').t('니코드<'.toString('utf8'))
           assert.equal(element.getChildText('body'), text)
        }
    }
}).export(module)
