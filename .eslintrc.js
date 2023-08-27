module.exports = {
  root: true,
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  overrides: [
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint/eslint-plugin", "import"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/resolver": {
          typescript: {},
        },
      },
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
      },
      extends: [
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
      ],
      rules: {
        "no-redeclare": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-extra-semi": "off",
        "@typescript-eslint/no-redeclare": "error",
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
  env: {
    node: true,
    es6: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    "arrow-body-style": ["error", "as-needed"],
    "import/no-deprecated": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        pathGroups: [
          {
            pattern: "@/**/**",
            group: "parent",
            position: "after",
          },
          {
            pattern: "@obs/**/**",
            group: "parent",
            position: "before",
          },
        ],
        ["newlines-between"]: "always-and-inside-groups",
        pathGroupsExcludedImportTypes: ["type"],
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../*"],
            message: "Usage of relative parent imports is not allowed.",
          },
        ],
      },
    ],
    "max-len": [
      "error",
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
}
