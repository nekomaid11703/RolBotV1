import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["src/**/*.js", "tests/**/*.js", "index.js"],
    ...jsdoc.configs["flat/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      ...jsdoc.configs["flat/recommended"].rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }],
      "no-undef": "error",
      "no-constant-binary-expression": "error",
      "no-unreachable": "error",
      "no-promise-executor-return": "error",
      "no-constant-condition": ["warn", { checkLoops: false }],
      "no-empty": "warn",
      "no-console": "warn",
      "no-redeclare": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": ["warn", { checkRestProperty: false, checkDestructured: false }],
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/check-types": "warn",
      "jsdoc/reject-any-type": "off",
      "jsdoc/reject-function-type": "off",
    },
  },
];
