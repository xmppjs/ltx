"use strict";

module.exports = {
  root: true,

  extends: ["eslint:recommended", "plugin:prettier/recommended"],

  env: {
    es6: true,
    commonjs: true,
    "shared-node-browser": true,
  },

  parserOptions: {
    sourceType: "script",
    ecmaVersion: 2019,
    // ecmaFeatures: {
    //   jsx: true,
    // },
  },

  rules: {
    strict: ["error", "global"],
    "no-empty": ["error", { allowEmptyCatch: true }],
    // "no-multi-assign": 0,
    "func-names": ["error", "as-needed"],
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ],
    "capitalized-comments": 0,
    "no-var": ["error"],
    "prefer-const": ["error"],
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
    ],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
  },
};
