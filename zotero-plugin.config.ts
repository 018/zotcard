import { defineConfig } from "zotero-plugin-scaffold";

// ZotCard 是老式（Zotero 7 风格）插件，纯 JS、自带 chrome 资源与 .ftl/prefs。
// 这里只借用 scaffold 的「启动 Zotero + 监听改动 + 自动热重载」能力，
// 关闭它对 FTL / 首选项的前缀改写，避免改坏 ZotCard 原有文件。
export default defineConfig({
  source: ["src"],
  dist: ".scaffold/build",
  name: "ZotCard",
  id: "zotcard@zotero.org",
  namespace: "zotcard",

  build: {
    // 整个 src 原样复制到构建目录（manifest.json 在 src 下）
    assets: ["src/**/*"],

    // 不要给 FTL 文件名/消息加命名空间前缀（ZotCard 用的是无前缀名）
    fluent: {
      prefixLocaleFiles: false,
      prefixFluentMessages: false,
      dts: false,
    },

    // 不要给 prefs.js 的键加前缀（ZotCard 自己管理键名）
    prefs: {
      prefixPrefKeys: false,
      dts: false,
    },
    // 纯 JS，无需 esbuild 打包，省略 esbuildOptions
  },
});
