const { rules } = require("eslint-config-prettier");

// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    ignorePatterns: ["/dist/*"],
  },
};
