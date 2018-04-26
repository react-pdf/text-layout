module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb-base", "prettier"],
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  rules: {
    "no-continue": 0,
    "no-cond-assign": 0,
    "no-underscore-dangle": 0,
    "no-restricted-syntax": 0,
    "class-methods-use-this": 0,
    "no-restricted-properties": 0,
    "no-param-reassign": ["warn"],
    "prefer-destructuring": ["warn"]
  }
};
