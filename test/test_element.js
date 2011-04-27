var vows = require('vows'),
assert = require('assert'),
ltx = require('./../lib/index');

vows.describe('ltx').addBatch({
    'serialization': {
	'serialize an element': function() {
	    var e = new ltx.Element('e');
	    assert.equal(e.toString(), '<e/>');
	},
	'serialize an element with attributes': function() {
	    var e = new ltx.Element('e',
				    { a1: 'foo' });
	    assert.equal(e.toString(), '<e a1="foo"/>');
	},
	'serialize an element with attributes to entities': function() {
	    var e = new ltx.Element('e',
				    { a1: '"well"' });
	    assert.equal(e.toString(), '<e a1="&quot;well&quot;"/>');
	},
	'serialize an element with text': function() {
	    var e = new ltx.Element('e').t('bar').root();
	    assert.equal(e.toString(), '<e>bar</e>');
	},
	'serialize an element with text to entities': function() {
	    var e = new ltx.Element('e').t('1 < 2').root();
	    assert.equal(e.toString(), '<e>1 &lt; 2</e>');
	},
	'serialize an element with a number attribute': function() {
	    var e = new ltx.Element('e', { a: 23 });
	    assert.equal(e.toString(), '<e a="23"/>');
	},
	'serialize an element with number contents': function() {
	    var e = new ltx.Element('e').t(23);
	    assert.equal(e.toString(), '<e>23</e>');
	}
    },

    'remove': {
	'by element': function() {
	    var el = new ltx.Element('e').
		c('c').c('x').up().up().
		c('c2').up().
		c('c').up();
	    el.remove(el.getChild('c'));
	    assert.equal(el.getChildren('c').length, 1);
	    assert.equal(el.getChildren('c2').length, 1);
	},
	'by name': function() {
	    var el = new ltx.Element('e').
		c('c').up().
		c('c2').up().
		c('c').up();
	    el.remove('c');
	    assert.equal(el.getChildren('c').length, 0);
	    assert.equal(el.getChildren('c2').length, 1);
	}
    }
}).run();
