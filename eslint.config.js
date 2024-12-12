import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["lib"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {

    languageOptions: {
      globals: {
        ...globals["shared-node-browser"],
      },
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
  },
];
