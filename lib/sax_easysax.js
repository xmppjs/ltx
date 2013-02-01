var util = require('util');
var events = require('events');
var Easysax = require('easysax');

/**
 * FIXME: This SAX parser cannot be pushed to!
 */
module.exports = SaxEasysax;
util.inherits(SaxEasysax, events.EventEmitter);


function SaxEasysax() {
    events.EventEmitter.call(this);
    this.parser = new Easysax();

    var that = this;

    this.parser.on('startNode', function(name, attr, uq, istagend) {
	attr = attr();

	if (attr === false) {
		that.emit('error', 'attr char');
		return false;
	};

	for(var k in attr) {
		attr[k] = uq(attr[k]);
	};

        that.emit('startElement', name, attr);
    });
    this.parser.on('endNode', function(name, uq, str, tagstart) {
        that.emit('endElement', name);
    });
    this.parser.on('textNode', function(str, uq) {
        that.emit('text', uq(str));
    });
    this.parser.on('cdata', function(str) {
        that.emit('text', str);
    });
    this.parser.on('error', function(e) {
	that.emit('error', e);
    });
    // TODO: other events, esp. entityDecl (billion laughs!)
    
    var sbuffer = '';
    
    this.write = function(data) {
    	sbuffer += typeof data !== 'string' ? data.toString() : data;
    };

    this.end = function(data) {
    	sbuffer += typeof data !== 'string' ? data.toString() : data;
    	this.parser(sbuffer);
    	sbuffer = '';
    };
};



