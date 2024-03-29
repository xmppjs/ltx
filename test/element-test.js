import vows from "vows";
import assert from "assert";
import Element from "../src/Element.js";
import parse from "../src/parse.js";

vows
  .describe("Element")
  .addBatch({
    "new element": {
      "doesn't reference original attrs object": () => {
        const o = { foo: "bar" };
        const e = new Element("e", o);
        assert.notStrictEqual(e.attrs, o);
        e.attrs.bar = "foo";
        assert.strictEqual(o.bar, undefined);
        o.foobar = "barfoo";
        assert.strictEqual(e.attrs.foobar, undefined);
      },
      "set xmlns attribute if a string is passed as second argument": () => {
        const ns = "xmlns:test";
        const e = new Element("e", ns);
        assert.strictEqual(e.attrs.xmlns, ns);
        assert.strictEqual(e.getAttr("xmlns"), ns);
      },
    },
    serialization: {
      "serialize an element": () => {
        const e = new Element("e");
        assert.strictEqual(e.toString(), "<e/>");
      },
      "serialize an element with attributes": () => {
        const e = new Element("e", { a1: "foo" });
        assert.strictEqual(e.toString(), '<e a1="foo"/>');
      },
      "serialize an element with attributes to entities": () => {
        const e = new Element("e", { a1: '"well"' });
        assert.strictEqual(e.toString(), '<e a1="&quot;well&quot;"/>');
      },
      "serialize an element with text": () => {
        const e = new Element("e").t("bar").root();
        assert.strictEqual(e.toString(), "<e>bar</e>");
      },
      "serialize an element with text to entities": () => {
        const e = new Element("e").t("1 < 2").root();
        assert.strictEqual(e.toString(), "<e>1 &lt; 2</e>");
      },
      "serialize an element with a number attribute": () => {
        const e = new Element("e", { a: 23 });
        assert.strictEqual(e.toString(), '<e a="23"/>');
      },
      "serialize an element with number contents": () => {
        const e = new Element("e");
        e.c("foo").t(23);
        e.c("bar").t(0);
        assert.strictEqual(e.toString(), "<e><foo>23</foo><bar>0</bar></e>");
      },
      "serialize with undefined attribute": () => {
        const e = new Element("e", { foo: undefined });
        assert.strictEqual(e.toString(), "<e/>");
      },
      "serialize with null attribute": () => {
        const e = new Element("e", { foo: null });
        assert.strictEqual(e.toString(), "<e/>");
      },
      "serialize with number attribute": () => {
        const e = new Element("e", { foo: 23, bar: 0 });
        const s = e.toString();
        assert.ok(s.match(/foo="23"/));
        assert.ok(s.match(/bar="0"/));
      },
      "serialize with undefined child": () => {
        const e = new Element("e");
        e.children = [undefined];
        assert.strictEqual(e.toString(), "<e></e>");
      },
      "serialize with null child": () => {
        const e = new Element("e");
        e.children = [null];
        assert.strictEqual(e.toString(), "<e></e>");
      },
      "serialize with integer text": () => {
        const e = new Element("e").t(1000);
        assert.strictEqual(e.getText(), "1000");
      },
    },
    remove: {
      "by element": () => {
        const el = new Element("e")
          .c("c")
          .c("x")
          .up()
          .up()
          .c("c2")
          .up()
          .c("c")
          .up();
        el.remove(el.getChild("c"));
        assert.strictEqual(el.getChildren("c").length, 1);
        assert.strictEqual(el.getChildren("c2").length, 1);
      },
      "by name": () => {
        const el = new Element("e").c("c").up().c("c2").up().c("c").up();
        el.remove("c");
        assert.strictEqual(el.getChildren("c").length, 0);
        assert.strictEqual(el.getChildren("c2").length, 1);
      },
    },
    getAttr: {
      "without ns": () => {
        const stanza =
          '<team xmlns:job="http://site.tld/job">' +
          '<person name="julien" job:title="hacker" /></team>';
        const doc = parse(stanza);
        const el = doc.getChild("person");
        assert.strictEqual(el.getAttr("name"), "julien");
      },
      "with ns": () => {
        const stanza =
          '<team xmlns:job="http://site.tld/job">' +
          '<person name="julien" job:title="hacker" /></team>';
        const doc = parse(stanza);
        const el = doc.getChild("person");
        assert.strictEqual(
          el.getAttr("title", "http://site.tld/job"),
          "hacker"
        );
      },
    },
    children: {
      getChildren: () => {
        const el = new Element("a")
          .c("b")
          .c("b2")
          .up()
          .up()
          .t("foo")
          .c("c")
          .t("cbar")
          .up()
          .t("bar")
          .root();

        const { children } = el;
        assert.strictEqual(children.length, 4);
        assert.strictEqual(children[0].name, "b");
        assert.strictEqual(children[1], "foo");
        assert.strictEqual(children[2].name, "c");
        assert.strictEqual(children[3], "bar");
      },
      getChildElements: () => {
        const el = new Element("a")
          .c("b")
          .c("b2")
          .up()
          .up()
          .t("foo")
          .c("c")
          .t("cbar")
          .up()
          .t("bar")
          .root();

        const children = el.getChildElements();
        assert.strictEqual(children.length, 2);
        assert.strictEqual(children[0].name, "b");
        assert.strictEqual(children[1].name, "c");
      },
    },

    recursive: {
      getChildrenByAttr: () => {
        const el = new Element("a")
          .c("b")
          .c("c", { myProperty: "x" })
          .t("bar")
          .up()
          .up()
          .up()
          .c("d", { id: "x" })
          .c("e", { myProperty: "x" })
          .root();

        const results = el.getChildrenByAttr("myProperty", "x", null, true);
        assert.strictEqual(results[0].toString(), '<c myProperty="x">bar</c>');
        assert.strictEqual(results[1].toString(), '<e myProperty="x"/>');
      },
      getChildByAttr: () => {
        const el = new Element("a").c("b").c("c", { id: "x" }).t("bar").root();
        assert.strictEqual(
          el.getChildByAttr("id", "x", null, true).toString(),
          '<c id="x">bar</c>'
        );
      },
    },

    "issue #15: Inconsistency with prefixed elements": {
      topic: () => {
        return parse("<root><x:foo>bar</x:foo></root>");
      },
      "getChildText prefixed": (el) => {
        assert.strictEqual(el.getChildText("x:foo"), null);
      },
      "getChildText unprefixed": (el) => {
        assert.strictEqual(el.getChildText("foo"), "bar");
      },
      "getChild prefixed": (el) => {
        assert.strictEqual(el.getChild("x:foo"), undefined);
      },
      "getChild unprefixed": (el) => {
        assert.strictEqual(el.getChild("foo").getText(), "bar");
      },
    },

    "issue-37: Element instanceof Fails": {
      instanceof: () => {
        const el = new Element("root").c("children");
        assert.ok(el instanceof Element);
      },
    },

    append: {
      "single element": () => {
        const foo = new Element("foo");
        const bar = new Element("bar");
        assert.equal(bar.parent, undefined);
        foo.append(bar);
        assert.equal(bar.parent, foo);

        assert.equal(foo.children[0], bar);
      },
      "single string": () => {
        const foo = new Element("foo");
        const bar = "bar";
        assert.equal(bar.parent, undefined);
        foo.append(bar);
        assert.equal(bar.parent, undefined);

        assert.equal(foo.children[0], bar);
      },
      "multiple nodes": () => {
        const foo = new Element("foo");
        const bar = new Element("bar");
        const baz = new Element("bar");
        foo.append(bar, baz);

        assert.deepEqual(foo.children, [bar, baz]);
      },
      "pre-existing nodes": () => {
        const foo = new Element("foo");
        const bar = new Element("bar");
        const baz = new Element("bar");
        foo.append(bar);
        foo.append(baz);

        assert.deepEqual(foo.children, [bar, baz]);
      },
    },
    prepend: {
      "single element": () => {
        const foo = new Element("foo");
        const bar = new Element("bar");
        assert.equal(bar.parent, undefined);
        foo.prepend(bar);
        assert.equal(bar.parent, foo);

        assert.equal(foo.children[0], bar);
      },
      "single string": () => {
        const foo = new Element("foo");
        const bar = "bar";
        assert.equal(bar.parent, undefined);
        foo.prepend(bar);
        assert.equal(bar.parent, undefined);

        assert.equal(foo.children[0], bar);
      },
      "multiple nodes": () => {
        const foo = new Element("foo");
        const bar = new Element("bar");
        const baz = new Element("bar");
        foo.prepend(bar, baz);

        assert.deepEqual(foo.children, [bar, baz]);
      },
      "pre-existing nodes": () => {
        const foo = new Element("foo");
        const bar = new Element("bar");
        const baz = new Element("bar");
        foo.prepend(bar);
        foo.prepend(baz);

        assert.deepEqual(foo.children, [baz, bar]);
      },
    },
  })
  .run();
