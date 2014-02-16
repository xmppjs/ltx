'use strict';

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
        /*
        'issue-29 test #2': function() {
           var text = '니코드<'
           var element = new Element(
               'message', { to: 'you@server.com', type: 'chat' }
           )
               .c('body').t('니코드<'.toString('utf8'))
           assert.equal(element.getChildText('body'), text)
        },
        */
        'issue-29 test #3': function() {
            var text = '니코드<'
            var element = new Element(
               'message', { to: 'you@server.com', type: 'chat' }
            ).c('body').t('니코드<'.toString('utf8'))
            assert.equal(element.getText(), text)
        },
        'issue-29 test write': function() {
            var text = '유니코드'
            var result = '<0message0 0to0="0-1@chat.fb.com0"0 0type0="0chat0"0>0<0body0>'.split(0)
            result.push(text)
            result = result.concat('</0body0>0</0message0>'.split(0))
            var element = new Element('message', {to:'-1@chat.fb.com', type:'chat'})
            element.c('body').t(text.toString('utf8'))
            element.write(function(c) {
                assert.equal(result.shift(), c)
            })
            assert.equal(result.length, 0)
        }
    }
}).export(module)
