import ltx from "./ltx.js";
import parsers from "./parsers.js";
import parse from "./parse.js";
import write from "./write.js";

const suites = [ltx, parsers, parse, write];

for (const suite of suites) {
  console.log("suite", suite.name);
  suite
    .on("cycle", (event) => {
      console.log(event.target.toString());
    })
    .on("complete", () => {
      console.log('Fastest is "' + suite.filter("fastest").map("name") + '"');
    })
    .run({ async: false });
  console.log("\n");
}
