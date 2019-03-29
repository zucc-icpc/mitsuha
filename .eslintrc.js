module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react"],
  // extends: ["eslint:recommended", "plugin:prettier/recommended"],
  extends: ["eslint:recommended",  "plugin:react/recommended"],
  rules: {
    "react/jsx-uses-vars": 2
  }
};
