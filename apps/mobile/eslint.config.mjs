import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["app/**/*.ts", "app/**/*.tsx", "lib/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {},
  },
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**"],
  },
];
