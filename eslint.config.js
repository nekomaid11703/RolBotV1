import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sonarjs = require("eslint-plugin-sonarjs");

export default [
  js.configs.recommended,
  sonarjs.configs.recommended,
  prettier,
  {
    files: ["src/**/*.js", "tests/**/*.js", "scripts/**/*.js", "index.js"],
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
      "jsdoc/require-param": ["warn", { checkRestProperty: false, checkDestructured: false }],
      "jsdoc/require-returns": "warn",
      "jsdoc/check-types": "warn",
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
];
