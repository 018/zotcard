# ZotCard 适配 Zotero 9 — 开发接续说明

> 本文档用于在**新会话**里快速接续开发。给 AI 时可直接说：
> “请阅读 `D:\gaofei\third\MyTools\Zotcode\zotcard\DEV_HANDOFF.md`，我们继续开发 ZotCard。”

最后更新：2026-06-16

---

## 1. 目标 & 现状

- **目标**：把 **ZotCard** 插件适配到最新 **Zotero 9**（原仅支持 Z7），并增删功能。
- **现状**：✅ 已适配完成并在**真实 Zotero 9 正式使用**；✅ 新增了完整的「卢曼式卡片编码」功能；✅ 修复了设置备份/还原。
- 开发者是插件开发初学者，沟通用**中文**，讲解尽量具体。

## 2. 关键环境

| 项 | 值 |
|----|----|
| ZotCard 项目（**主战场**） | `D:\gaofei\third\MyTools\Zotcode\zotcard` |
| 工作分支 | `zotero8-adaptation` |
| 安装的 Zotero | **9.0.5**（平台 Firefox 140），路径 `D:\gaofei\Program Files(x86)\Zotero\zotero.exe` |
| 另一个练手项目（已搁置） | `d:\gaofei\third\MyTools\zotero`（windingwind 模板做的 from-scratch 练手，**不用管**） |
| 打包好的 xpi | `D:\gaofei\third\MyTools\Zotcode\zotcard-3.3.0-zotero9.xpi` |

> ZotCard 是**老式 Zotero-7 bootstrap 插件**：纯 JS、`Services.scriptloader.loadSubScript` 串联 `Zotero.ZotCard.*` 全局模块、chrome:// 资源、弹窗用 **Vue3 + Element Plus + ECharts**。**未重写架构**，只做兼容性修复 + 加功能。

## 3. 开发工作流（热重载）

项目已接入 `zotero-plugin-scaffold`（仅用于开发，不改运行架构）：

```powershell
cd D:\gaofei\third\MyTools\Zotcode\zotcard
npm start      # 启动 Zotero 9(独立空库) + 装入 ZotCard + 改代码自动热重载
```

- **⚠️ `npm start` 启动时会关闭所有正在运行的 Zotero**（含你的真实 Zotero）——先存好真实库的活。
- 开发用**独立 profile + 空数据库**：`D:\gaofei\third\MyTools\Zotcode\.zotcard-dev\{profile,data}`（在 `.env` 里配置，不碰真实库）。
- 改 `src/` 下代码 → 自动重建+重载。**注意**：弹窗页面（card-*.html）和设置面板改动后，需**关掉那个窗口再重开**才会用上新代码。
- 配置文件：`package.json` / `zotero-plugin.config.ts` / `.env`（均为开发新增；`.env`、`node_modules`、`.scaffold` 已 gitignore）。

打包成可安装的 xpi：
```powershell
npm run build   # 生成 .scaffold\build\zot-card.xpi
```
安装到真实 Zotero：工具→插件→⚙️→Install Plugin From File…（版本号仍 3.3.0，**先移除旧版再装**，或直接覆盖；设置存在 Zotero 偏好里不会丢）。

## 4. 已完成的工作（分支 `zotero8-adaptation` 提交，新→旧）

```
89e1f30 修复 设置「备份/还原」在 Z9 失效及还原不忠实
0906427 卡片编码：跨文献聚合（按分类汇总）
a1c5086 卡片编码：树层级折叠/展开（工具栏 + 右键子树）
660f918 卡片编码：新建同级/下级（按钮 + 右键菜单）
b947f89 卡片编码：右侧内容预览 + 可拖拽调宽 + 打开编辑器
d0ce96c 卡片编码：仅写真正变动的卡片 + 保存后不自动关闭
ca9a76d 卡片编码：「组号」前缀
1698700 卡片编码：识别无空格编码 + 部分编码开关 + 不连续层级回溯
7bb39e1 卡片编码：数字零填充修复 >9 排序 + 一键清除
957f913 新增：卢曼式卡片编码（可拖拽树形面板）
160e7bc 适配 Z9：图片压缩 OS.File → IOUtils
3aebbd1 适配 Z9：恢复笔记面板“新建子笔记”下拉卡片项
bda6bf5 适配 Z9：Vue 模板编译器 chrome 文档崩溃（白屏根因）
1d62125 适配 Z8/9：三大加载阻塞（manifest 版本 / Services.jsm / startup 崩溃）
```
（基线提交 `9c2d11d` 是适配前的原始 ZotCard）

## 5. Z9 适配踩过的坑（=以后排错的套路库）

| 现象 | 根因 | 修法 |
|------|------|------|
| 装不上 | `manifest.json` `strict_max_version: 7.*.*` | 放开到 `9.*.*` |
| 模块崩溃 | `Components.utils.import('...Services.jsm')`（FF115+ 移除） | 删导入，`Services` 已是全局 |
| startup 整体崩溃 | 某主界面元素 `getElementById` 为 null 抛错 | 事件注册**空值安全**；元素惰性创建/改名要适配 |
| **所有 Vue 页面白屏** | Vue 浏览器版解码属性用 `<div foo=...>`+`getAttribute('foo')`，Z9 的 chrome 消毒器删 `foo` 属性→返回 null→编译器崩 | `vue.global.js`/`.prod.js` 里 `foo`→`title`（标准属性不被删） |
| 笔记面板下拉无卡片项 | Z9 把元素从 **id 改成 class**、惰性创建、多实例 | 改 **document 级事件委托** + 对“当前弹出的 popup”操作 |
| 图片压缩崩 | `OS.File`（osfile）废弃 | 改 `IOUtils.stat` 等 |
| **文件选择器无反应** | 旧 `nsIFilePicker` 回调写法失效 | 用 `ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs')` 的 `FilePicker`；显示方法是 **`await fp.show()`**（不是 open()）；`fp.init(window,...)`、`fp.file` 返回路径字符串 |
| 还原中断/不全 | `noteBGColor` 在 `note.css` 未设置时 `val.replace` 抛错 | `Zotero.Prefs.get('note.css') \|\| ''` 容错 |
| 布尔 `false` 设置存不住 | ZotCard 的 `Zotero.ZotCard.Prefs.set(k,val)` 对 falsy 值执行 **clear**（false/0/'' 都被当成清除→读取回落默认） | 存 false 时绕过封装，直接 `Zotero.Prefs.set('zotcard.<key>', false)` |

> 调试 GUI 报错的办法：① 临时往出问题的 html 注入“错误捕获脚本”把报错写日志文件再读；② 把 `vue.global.prod.js` 换 `vue.global.js`（开发版）拿可读报错；③ 改完 JS 用 `node --check 文件` 验证括号/语法（这些 chrome JS 不经 esbuild，语法错只在运行时暴露）。

## 6. 新功能「卢曼式卡片编码」架构

**入口**：
- 条目右键 → ZotCard → **卡片编码**（单条文献，组织其子笔记）
- 分类右键 → **卡片编码（聚合）**（汇总该分类含子分类下所有卡片：各文献子笔记 + 独立笔记）

**核心文件**：
- `src/chrome/content/cardcoding/card-coding.html` — Vue + ElementPlus 面板（可拖拽 `el-tree`、左右分栏预览、右键菜单）
- `src/chrome/content/cardcoding/card-coding.js` — 全部逻辑
- `src/zotcard-dialog.js` — `openCardCoding(items)` 开窗
- `src/zotcard.js` — 菜单注入 + `itemCardCoding()` / `collectionCardCoding()`
- `src/locale/{zh-CN,en-US}/zotcard.ftl` — 菜单文案键

**已实现能力**：
- 拖拽树组织顺序/分支；卢曼编码 `1 / 1a / 1a1 / 2`（数字段按同级数量**零填充**保证排序）
- 写入卡片**标题前缀** → Zotero 主界面据此排序（`splitTitle()` 统一解析/剥离/写入；`applyCode()` 幂等，且**只改真正变动**的卡片，不动修改时间）
- 「**组号**」前缀（如 `S32/1a1`，分隔符可自定义；打开时自动识别回填）
- **部分编码**：每卡勾选框（默认已有编码的勾选）+ 全选/全不选；未勾选的保存时清除编码
- **不连续层级**回溯（`1a1a` 缺 `1a1` 时挂到最近祖先 `1a`）
- **右侧预览**（可拖拽调宽）+「在编辑器中打开」原生笔记编辑器 +「刷新」
- **新建同级/下级**（按钮 + 右键菜单；以选中卡片的标题元素为模板克隆，去掉旧编码；聚合模式建独立笔记入该分类）
- **折叠/展开**：工具栏（展开全部/折叠全部/展开到 N 级）+ 右键（展开/折叠选中子树）
- **一键清除编码**

**关键取舍/限制**：聚合树是“逻辑全局顺序”——卡片物理上仍挂在各文献下，Zotero 原生条目树不体现全局顺序，**聚合面板就是组织/导航入口**。字母段同级 >26 时字典序会乱（极少见）。

## 7. 方法论结论（卡片盒怎么组织，已和用户讨论）

- **文献卡**（针对某篇的摘录）→ 挂在该文献下（子笔记），篇内排序即可。
- **永久卡**（自己的、跨来源的想法）→ 建议做成**独立笔记**集中在一个「卡片盒」分类，用全局卢曼编码 + 链接成网；文献用 `zotero://` 链接引用而非当容器。
- 用户当前选择**先用「跨文献聚合视图」**体验效果。

## 8. 待办 / 可能的下一步

- [ ] （可选）版本号 `3.3.0 → 3.3.1` 以便真实库**直接覆盖升级**（免先卸载）。
- [ ] 聚合视图增强：搜索/过滤、显示来源文献、点击跳到原卡片、按组号分块。
- [ ] 「独立卡片盒」模型支持（永久卡集中、原生可排序）。
- [ ] 全局卡片浏览器（按编码聚合全库）。
- [ ] 回归测试尚未逐一点过的旧功能：复制各格式 / 移动 / 替换 / 打印 / 卡片报告统计 / 卡片查看器读卡。
- [ ] 备份/还原：`card_quantity=0` 等其它 falsy 值是否需同 `.visible` 一样直接写（目前只修了 visible）。

## 9. 在新会话里怎么接续

1. 让 AI 读本文件。
2. 启动开发：`cd D:\gaofei\third\MyTools\Zotcode\zotcard && npm start`。
3. 确认在 `zotero8-adaptation` 分支。
4. 继续提需求即可；改完按“测→报错→修”的节奏，验证 OK 就 `git commit`、必要时 `npm run build` 重新打包。
