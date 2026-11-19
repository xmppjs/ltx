import ltx from "./ltx.js";
import parse from "./parse.js";

const suites = [ltx, parse];

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
