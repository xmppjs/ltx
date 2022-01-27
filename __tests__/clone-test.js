import assert from "assert";
import _clone from "../src/clone.js";
import Element from "../src/Element.js";

describe("clone", () => {
  it("clones", () => {
    const orig = new Element("msg", { type: "get" })
      .c("content")
      .t("foo")
      .root();
    const clone = _clone(orig);
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
  });
  it("mod attr", () => {
    const orig = new Element("msg", { type: "get" });
    const clone = _clone(orig);
    clone.attrs.type += "-result";

    assert.strictEqual(orig.attrs.type, "get");
    assert.strictEqual(clone.attrs.type, "get-result");
  });
  it("rm attr", () => {
    const orig = new Element("msg", { from: "me" });
    const clone = _clone(orig);
    delete clone.attrs.from;
    clone.attrs.to = "you";

    assert.strictEqual(orig.attrs.from, "me");
    assert.strictEqual(orig.attrs.to, undefined);
    assert.strictEqual(clone.attrs.from, undefined);
    assert.strictEqual(clone.attrs.to, "you");
  });
  it("mod child", () => {
    const orig = new Element("msg", { type: "get" })
      .c("content")
      .t("foo")
      .root();
    const clone = _clone(orig);
    clone.getChild("content").t("bar").name = "description";

    assert.strictEqual(orig.children[0].name, "content");
    assert.strictEqual(orig.getChildText("content"), "foo");
    assert.strictEqual(clone.children[0].name, "description");
    assert.strictEqual(clone.getChildText("description"), "foobar");
  });
  it("use original constructor for the clone", () => {
    class Foo extends Element {}
    const foo = new Foo();
    assert(_clone(foo) instanceof Element);
    assert(_clone(foo) instanceof Foo);
  });
});
