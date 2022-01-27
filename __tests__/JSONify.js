import assert from "assert";
import JSONify from "../src/JSONify.js";
import Element from "../src/Element.js";

describe("JSONify", () => {
  it("serialize to json", () => {
    const e = new Element("e", { foo: 23, bar: 0, nil: null })
      .c("f")
      .t(1000)
      .up();
    assert.deepStrictEqual(JSONify(e), {
      name: "e",
      attrs: { foo: 23, bar: 0, nil: null },
      children: [{ name: "f", attrs: {}, children: [1000] }],
    });
  });
});
