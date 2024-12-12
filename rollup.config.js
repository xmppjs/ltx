export default [
  {
    input: [
      "src/ltx.js",
      "src/parsers.js",
    ],
    output: {
      dir: "lib",
      format: "cjs",
      preserveModules: true,
      exports: "auto",
    },
  },
];
