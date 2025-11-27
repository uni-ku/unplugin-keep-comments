import keepComments from "@uni-ku/unplugin-keep-comments/rollup";
import type { Plugin } from "rollup";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "./src/index.ts"
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true
  },
  hooks: {
    "rollup:options": (_, options) => {
      options.plugins.push(
        keepComments({
          comments: [
            /^\/\/ *#if/,
            /^\/\/ *#endif/
          ]
        }) as Plugin
      );
    }
  }
});