/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "warn",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.mjs"],
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: "./tsconfig.json",
      },
      extends: [
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
      ],
      rules: {
        "no-redeclare": "off", // replace with @typescript-eslint version
        "no-unused-vars": "off", // replace with @typescript-eslint version
        "@typescript-eslint/no-extra-semi": "off", // no need with prettier
        "@typescript-eslint/no-redeclare": "error",
        "@typescript-eslint/dot-notation": "off", // conflict with `noPropertyAccessFromIndexSignature`
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          { allowNumber: true },
        ],
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
          },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": [
          "error",
          {
            ignorePrimitives: {
              boolean: true,
            },
          },
        ],
        "@typescript-eslint/no-confusing-void-expression": [
          "error",
          {
            ignoreArrowShorthand: true,
          },
        ],
      },
    },
  ],
  ignorePatterns: ["node_modules/", "dist/", "out/"],
}
