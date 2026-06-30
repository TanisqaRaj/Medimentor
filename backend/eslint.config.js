import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules", "tests/.mongodb-binaries"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-process-exit": "warn",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
];
