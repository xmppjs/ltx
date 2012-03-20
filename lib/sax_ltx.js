var util = require('util');
var events = require('events');

var STATE_TEXT = 0,
    STATE_TAG_NAME = 2,
    STATE_TAG = 3,
    STATE_ATTR_NAME = 4,
    STATE_ATTR_EQ = 5,
    STATE_ATTR_QUOT = 6,
    STATE_ATTR_VALUE = 7;

var RE_TAG_NAME = /^[^\s\/>]+$/,
    RE_ATTR_NAME = /^[^\s=]+$/;

var SaxLtx = module.exports = function SaxLtx() {
    events.EventEmitter.call(this);

    this.recordStart = 0;
    this.state = STATE_TEXT;


    var origEmit = this.emit;
    this.emit = function() {
	//console.log('ltx', arguments);
	origEmit.apply(this, arguments);
    };
};
util.inherits(SaxLtx, events.EventEmitter);

SaxLtx.prototype.write = function(data) {
    if (typeof data !== 'string')
	data = data.toString();
    var pos = 0;

    /* Anything from previous write()? */
    if (this.remainder) {
	data = this.remainder + data;
	pos += this.remainder.length;
	delete this.remainder;
    }

    var that = this;
    function endRecording() {
	if (that.hasOwnProperty('recordStart')) {
	    var recorded = data.slice(that.recordStart, pos);
	    delete that.recordStart;
	    return recorded;
	}
    }

    for(; pos < data.length; pos++) {
	var c = data[pos];
	//console.log("state", this.state, "c", c);
	switch(this.state) {
	case STATE_TEXT:
	    if (c === "<") {
		var text = endRecording();
		if (text)
		    this.emit('text', unescapeXml(text));
		this.state = STATE_TAG_NAME;
		this.recordStart = pos + 1;
		this.attrs = {};
	    }
	    break;
	case STATE_TAG_NAME:
	    if (c === "/" && this.recordStart === pos) {
		this.recordStart = pos + 1;
		this.endTag = true;
	    } else if (!RE_TAG_NAME.test(c)) {
		this.tagName = endRecording();
		pos--;
		this.state = STATE_TAG;
	    }
	    break;
	case STATE_TAG:
	    if (c === ">") {
		if (!this.endTag) {
		    this.emit('startElement', this.tagName, this.attrs);
		    if (this.selfClosing)
			this.emit('endElement', this.tagName);
		} else
		    this.emit('endElement', this.tagName);
		delete this.tagName;
		delete this.attrs;
		delete this.endTag;
		delete this.selfClosing;
		this.state = STATE_TEXT;
		this.recordStart = pos + 1;
	    } else if (c === "/") {
		this.selfClosing = true;
	    } else if (RE_ATTR_NAME.test(c)) {
		this.recordStart = pos;
		this.state = STATE_ATTR_NAME;
	    }
	    break;
	case STATE_ATTR_NAME:
	    if (!RE_ATTR_NAME.test(c)) {
		this.attrName = endRecording();
		pos--;
		this.state = STATE_ATTR_EQ;
	    }
	    break;
	case STATE_ATTR_EQ:
	    if (c === "=") {
		this.state = STATE_ATTR_QUOT;
	    }
	    break;
	case STATE_ATTR_QUOT:
	    if (c === '"' || c === "'") {
		this.attrQuote = c;
		this.state = STATE_ATTR_VALUE;
		this.recordStart = pos + 1;
	    }
	    break;
	case STATE_ATTR_VALUE:
	    if (c === this.attrQuote) {
		var value = unescapeXml(endRecording());
		this.attrs[this.attrName] = value;
		delete this.attrName;
		this.state = STATE_TAG;
	    }
	    break;
	}
    }

    if (this.hasOwnProperty('recordStart') &&
	this.recordStart <= data.length) {
	this.remainder = data.slice(this.recordStart);
	this.recordStart = 0;
    }
};

SaxLtx.prototype.end = function(data) {
    if (data)
	this.write(data);

    /* Uh, yeah */
    this.write = function() {
    };
};

function unescapeXml(s) {
    return s.
        replace(/\&amp;/g, '&').
        replace(/\&lt;/g, '<').
        replace(/\&gt;/g, '>').
        replace(/\&quot;/g, '"').
        replace(/\&apos;/g, '\'');
}
