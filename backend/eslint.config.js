// eslint.config.js
import { defineConfig } from "eslint";

export default defineConfig({
  extends: ["@rocketseat/eslint-config/node", "plugin:drizzle/all"],
  plugins: {
    drizzle: require("eslint-plugin-drizzle"),
  },
  rules: {
    "drizzle/enforce-delete-with-where": ["error"],
    "drizzle/enforce-update-with-where": ["error"],
  },
});
