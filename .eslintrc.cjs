module.exports = {
  root: true,

  extends: ["eslint:recommended", "plugin:prettier/recommended"],

  env: {
    es6: true,
    "shared-node-browser": true,
  },

  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    // ecmaFeatures: {
    //   jsx: true,
    // },
  },

  rules: {
    strict: ["error", "global"],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "func-names": ["error", "always"],
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ],
    "capitalized-comments": ["off"],
    "func-style": ["error", "declaration"],

    // ECMAScript 6
    // https://eslint.org/docs/rules/#ecmascript-6
    "no-var": ["error"],
    "prefer-arrow-callback": ["error"],
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

  overrides: [
    {
      files: ["**.cjs"],
      env: {
        commonjs: true,
      },
    },
  ],
};
