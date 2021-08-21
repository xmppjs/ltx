export default [
  {
    input: [
      "src/ltx.js",
      "src/DOMElement",
      "src/parsers.js",
      "src/parsers/libxmljs.js",
    ],
    output: {
      dir: "lib",
      format: "cjs",
      preserveModules: true,
      exports: "auto",
    },
  },
];
