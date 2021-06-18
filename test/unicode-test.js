'use strict'

var vows = require('vows')
var assert = require('assert')
var Element = require('../lib/Element')
var parseChunks = require('./helpers').parseChunks

vows.describe('unicode').addBatch({
  'unicode forming': {
    'issue-29': function () {
      var text = 'Hello ɝ'
      var element = new Element('iq')
      element.t(text)
      assert.strictEqual(element.toString(), '<iq>' + text + '</iq>')
    },
    /*
    'issue-29 test #2': function() {
       var text = '니코드<'
       var element = new Element(
           'message', { to: 'you@server.com', type: 'chat' }
       )
           .c('body').t('니코드<'.toString('utf8'))
       assert.strictEqual(element.getChildText('body'), text)
    },
    */
    'issue-29 test #3': function () {
      var text = '니코드<'
      var element = new Element(
        'message', { to: 'you@server.com', type: 'chat' }
      ).c('body').t('니코드<'.toString('utf8'))
      assert.strictEqual(element.getText(), text)
    },
    'issue-29 test write': function () {
      var text = '유니코드'
      var result = '<0message0 0to0="0-1@chat.fb.com0"0 0type0="0chat0"0>0<0body0>'.split(0)
      result.push(text)
      result = result.concat('</0body0>0</0message0>'.split(0))
      var element = new Element('message', { to: '-1@chat.fb.com', type: 'chat' })
      element.c('body').t(text.toString('utf8'))
      element.write(function (c) {
        assert.strictEqual(result.shift(), c)
      })
      assert.strictEqual(result.length, 0)
    },
    'Unicode buffers': () => {
      var buffer = Buffer.from('<root><![CDATA[Ποδήλατο]]></root>', 'utf-8')
      var el1 = parseChunks([buffer.slice(0, 18), buffer.slice(18)])
      assert.strictEqual(el1.getText(), 'Ποδήλατο')
    }
  }
}).export(module)
