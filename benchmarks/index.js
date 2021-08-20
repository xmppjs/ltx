"use strict";

const suites = [
  require("./ltx"),
  require("./parsers"),
  require("./parse"),
  require("./write"),
];

for (const suite of suites) {
  console.log("suite", suite.name);
  suite
    .on("cycle", (event) => {
      console.log(event.target.toString());
    })
    .on("complete", () => {
      console.log('Fastest is "' + this.filter("fastest").map("name") + '"');
    })
    .run({ async: false });
  console.log("\n");
}
