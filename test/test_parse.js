var vows = require('vows'),
assert = require('assert'),
ltx = require('./../lib/index');

vows.describe('ltx').addBatch({
    'parsing': {
        'simple document': function() {
            var el = ltx.parse('<root/>');
            assert.equal(el.name, 'root');
            assert.equal(0, el.children.length);
        },
        'raises error': function() {
            assert.throws(function() {
                ltx.parse('<root></toor>');
            });
        }
    }
}).run();
