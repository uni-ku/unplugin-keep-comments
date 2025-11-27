import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/*.ts",
  platform: "neutral",
  format: [
    "esm",
    "cjs"
  ],
  dts: {
    build: true
  }
});