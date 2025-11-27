# Unplugin Keep Comments

在构建产物中保留指定的注释

[![github stars][github-stars-src]][github-stars-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

### ☕️ 背景

构建工具通常会移除代码中的普通注释，但是在某些场景下，我们希望在构建产物中保留特定的注释，
例如 uni-app 的 [条件编译](https://uniapp.dcloud.net.cn/tutorial/platform.html) 注释。

插件基于构建工具（如 [ESBuild](https://github.com/evanw/esbuild)）提供的
[Legal comments](https://esbuild.github.io/api/#legal-comments) 机制，
为指定的注释临时添加 `!` 前缀使其成为「合法注释」，这些注释在构建产物中就会被保留，从而达到预期目标。

### 📦 安装

```shell
# pnpm
pnpm add -D @uni-ku/unplugin-keep-comments

# yarn
yarn add --dev @uni-ku/unplugin-keep-comments

# npm
npm install -D @uni-ku/unplugin-keep-comments
```

### 🚀 使用

#### Tsdown

```ts
// tsdown.config.ts

import keepComments from "@uni-ku/unplugin-keep-comments/rolldown";
import { defineConfig } from "tsdown";

export default defineConfig({
  // ...
  plugins: [
    keepComments({
      comments: [
        /^\/\/ *#if/,
        /^\/\/ *#endif/
      ]
    })
  ]
});
```

#### Unbuild

```ts
// build.config.ts

import keepComments from "@uni-ku/unplugin-keep-comments/rollup";
import type { Plugin } from "rollup";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // ...
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
```

### 🏆 开源协议

MIT [LICENSE](./LICENSE)

[github-stars-src]: https://img.shields.io/github/stars/uni-ku/unplugin-keep-comments?style=flat&color=92dcd2&labelColor=18181b&logo=github
[github-stars-href]: https://github.com/uni-ku/unplugin-keep-comments
[npm-version-src]: https://img.shields.io/npm/v/@uni-ku/unplugin-keep-comments?style=flat&color=92dcd2&labelColor=18181b&logo=npm
[npm-version-href]: https://npmjs.com/package/@uni-ku/unplugin-keep-comments
[npm-downloads-src]: https://img.shields.io/npm/dm/@uni-ku/unplugin-keep-comments?style=flat&color=92dcd2&labelColor=18181b
[npm-downloads-href]: https://npmjs.com/package/@uni-ku/unplugin-keep-comments
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-92dcd2?style=flat&labelColor=18181b
[jsdocs-href]: https://www.jsdocs.io/package/@uni-ku/unplugin-keep-comments
[license-src]: https://img.shields.io/github/license/uni-ku/unplugin-keep-comments.svg?style=flat&color=92dcd2&labelColor=18181b
[license-href]: https://github.com/uni-ku/unplugin-keep-comments/blob/main/LICENSE