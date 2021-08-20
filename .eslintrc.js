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
    "func-names": ["error", "as-needed"],
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ],
    "capitalized-comments": ["off"],

    // ECMAScript 6
    // https://eslint.org/docs/rules/#ecmascript-6
    "no-var": ["error"],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
    "prefer-const": ["error"],
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
    ],
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    // Potentially slower
    // "prefer-template": ["error"],
  },
};
