/*
  benchmark the speed of the different methods to create elements
  Not all tests are equally functional but it gives a good idea of what to expect from
  the different methods.
 */

import benchmark from "benchmark";

import createElement from "../src/createElement.js";
import tag from "../src/tag.js";
import Element from "../src/Element.js";
import parse from "../src/parse.js";

const XML = [
  '<message to="foo@bar" from="bar@foo" type="chat" id="foobar">',
  "<body>Where there is love there is life.</body>",
  "</message>",
].join("");
const el = parse(XML);

const suite = new benchmark.Suite("ltx");

suite.add("tag with template literal", () => {
  tag`
    <message to="${"foo@bar"}" from="${"bar@foo"}" type="${"chat"}" id="${"foobar"}">
      <body>${"Where there is love there is life."}</body>
    </message>
  `;
});

suite.add("tag with direct call", () => {
  tag(
    [
      '\n  <message to="',
      '" from="',
      '" type="',
      '" id="',
      '">\n    <body>',
      "</body>\n  </message>\n",
    ],
    "foo@bar",
    "bar@foo",
    "chat",
    "foobar",
    "Where there is love there is life."
  );
});

suite.add("serialize and parse", () => {
  parse(el.toString());
});

suite.add("parse", () => {
  parse(XML);
});

suite.add("createElement (jsx)", () => {
  createElement(
    "message",
    { to: "foo@bar", from: "bar@foo", type: "chat", id: "foobar" },
    createElement("body", null, "Where there is love there is life.")
  );
});

suite.add("serialize", () => {
  el.toString();
});

suite.add("clone", () => {
  el.clone();
});

suite.add("Element", () => {
  new Element("message", {
    to: "foo@bar",
    from: "bar@foo",
    type: "chat",
    id: "foobar",
  })
    .c("body")
    .t("Where there is love there is life.")
    .root();
});

export default suite;
