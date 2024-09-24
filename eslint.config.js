import tseslint from "typescript-eslint";

export default tseslint.config({
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
    },
  },
//   ignorePatterns: [
    // **.json
    // **.js
    // **.md
    // .gitignore
    // .editorconfig
    // **/node_modules/**
    // **/.angular/**
    // **/.vs/**
    // **/dist/**
    // **/.vscode/**
    // **/index.html
    // **/main.ts
    // **.config
//   ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
  },
});
