import vows from "vows";
import assert from "assert";
import Element from "../lib/Element.js";
import parse from "../lib/parse.js";

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
      "serialize to json": () => {
        const e = new Element("e", { foo: 23, bar: 0, nil: null })
          .c("f")
          .t(1000)
          .up();
        assert.deepStrictEqual(e.toJSON(), {
          name: "e",
          attrs: { foo: 23, bar: 0, nil: null },
          children: [{ name: "f", attrs: {}, children: [1000] }],
        });
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
    // extensively tested in equality-test.js
    equality: {
      name: () => {
        const a = new Element("foo");
        let b = new Element("foo");
        assert.strictEqual(a.nameEquals(a), true);
        assert.strictEqual(a.nameEquals(b), true);
        assert.strictEqual(b.nameEquals(a), true);

        b = new Element("b");
        assert.strictEqual(a.nameEquals(b), false);
        assert.strictEqual(b.nameEquals(a), false);
      },
      attrs: () => {
        const a = new Element("foo", { foo: "bar" });
        let b = new Element("foo", { foo: "bar" });
        assert.strictEqual(a.attrsEquals(a), true);
        assert.strictEqual(a.attrsEquals(b), true);
        assert.strictEqual(b.attrsEquals(a), true);

        b = new Element("foo", { bar: "foo" });
        assert.strictEqual(a.attrsEquals(b), false);
        assert.strictEqual(b.attrsEquals(a), false);
      },
      children: () => {
        const a = new Element("foo").c("foo").root();
        let b = new Element("foo").c("foo").root();
        assert.strictEqual(a.childrenEquals(a), true);
        assert.strictEqual(a.childrenEquals(b), true);
        assert.strictEqual(b.childrenEquals(a), true);

        b = new Element("foo").c("bar").root();
        assert.strictEqual(a.childrenEquals(b), false);
        assert.strictEqual(b.childrenEquals(a), false);
      },
    },
    clone: {
      clones: () => {
        const orig = new Element("msg", { type: "get" })
          .c("content")
          .t("foo")
          .root();
        const clone = orig.clone();
        assert.strictEqual(clone.name, orig.name);
        assert.strictEqual(clone.attrs.type, orig.attrs.type);
        assert.strictEqual(clone.attrs.to, orig.attrs.to);
        assert.strictEqual(clone.children.length, orig.children.length);
        assert.strictEqual(
          clone.getChildText("content"),
          orig.getChildText("content")
        );

        assert.strictEqual(orig.getChild("content").up(), orig);
        assert.strictEqual(clone.getChild("content").up(), clone);
      },
      "mod attr": () => {
        const orig = new Element("msg", { type: "get" });
        const clone = orig.clone();
        clone.attrs.type += "-result";

        assert.strictEqual(orig.attrs.type, "get");
        assert.strictEqual(clone.attrs.type, "get-result");
      },
      "rm attr": () => {
        const orig = new Element("msg", { from: "me" });
        const clone = orig.clone();
        delete clone.attrs.from;
        clone.attrs.to = "you";

        assert.strictEqual(orig.attrs.from, "me");
        assert.strictEqual(orig.attrs.to, undefined);
        assert.strictEqual(clone.attrs.from, undefined);
        assert.strictEqual(clone.attrs.to, "you");
      },
      "mod child": () => {
        const orig = new Element("msg", { type: "get" })
          .c("content")
          .t("foo")
          .root();
        const clone = orig.clone();
        clone.getChild("content").t("bar").name = "description";

        assert.strictEqual(orig.children[0].name, "content");
        assert.strictEqual(orig.getChildText("content"), "foo");
        assert.strictEqual(clone.children[0].name, "description");
        assert.strictEqual(clone.getChildText("description"), "foobar");
      },
      "use original constructor for the clone": () => {
        class Foo extends Element {}
        const foo = new Foo();
        assert(foo.clone() instanceof Element);
        assert(foo.clone() instanceof Foo);
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
  })
  .run();
