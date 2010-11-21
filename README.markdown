# Less-Than XML

* *Element:* any XML Element
* Text nodes are Strings


## Element traversal

* `Element(name, attrs?)`: constructor
* `is(name, xmlns?)`: check
* `getName()`: name without ns prefix
* `getNS()`: element's xmlns, respects prefixes and searches upwards
* `findNS(prefix?)`: search for xmlns of a prefix upwards
* `getChild(name, xmlns?)`: find one children
* `getChildren(name, xmlns?)`: find all children
* `getText()`: appends all text nodes recursively
* `getChildText(name)`: a child's text contents
* `root()`: uppermost parent in the tree
* `up()`: parent or self


## Element attributes

* `attrs` is an object of the Element's attributes
* `name` contains optional prefix, colon, name
* `parent` points to its parent, this should always be consistent with
  children
* `children` is an Array of Strings and Elements


## Building XML Elements

This resembles strophejs a bit.

strophejs' XML Builder is very convenient for producing XMPP
stanzas. node-xmpp includes it in a much more primitive way: the
`c()`, `cnode()` and `t()` methods can be called on any *Element*
object, returning the child element.

This can be confusing: in the end, you will hold the last-added child
until you use `up()`, a getter for the parent. `Connection.send()`
first invokes `tree()` to retrieve the uppermost parent, the XMPP
stanza, before sending it out the wire.


## Destructive manipulation

Please always make sure `parent` and `children` are consistent. Don't
append children of other parents to your own element. We're not
adoption-safe!


## TODO

* More documentation
* More tests (Using [Vows](http://vowsjs.org/))

