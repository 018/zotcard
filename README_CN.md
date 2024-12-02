<p align="center">
  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/zotcard.png">
</p>
<p align="center">
  <a href="https://www.zotero.org">
    <img src="https://img.shields.io/badge/Zotero-7-red" alt="Zotero-7">
  </a>
  <a href="https://github.com/018/zotcard/stargazers">
    <img src="https://img.shields.io/github/stars/018/zotcard?label=Stars" alt="element-ui">
  </a>
  <a href="https://github.com/018/zotcard/releases">
    <img src="https://img.shields.io/github/downloads/018/zotcard/total?label=Downloads" alt="element-ui">
  </a>
</p>

[English](https://github.com/018/zotcard) | 简体中文

## 介绍
zotcard是Zotero的一个插件，它是卡片法笔记的提效工具。它提供了卡片模版（如默认有概念卡、人物卡、金句卡等，支持自定义其他卡片模版），可以让你快速写卡。除此之外，还帮助你卡片分类以及统一卡片的标准格式。

## 快速开始
- 第一步、下载zotcard最新版本：[点击下载](https://github.com/018/zotcard/releases)；

- 第二步、Zotero - 工具 - 附加组件 - ⚙️ - Install Add-on From File...，选择插件xpi文件；

- 第三步、在条目右键 - ZotCard - 摘要卡，即可快速按模版创建卡片。

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard1.gif" width="600"/>

## 视频
- [bilibili](https://space.bilibili.com/404131635)

## 特性
- 快速建卡: 预置卡片模板，支持自定义卡片模块。

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/setting.png" alt="配置" width="600"/>

- 卡片管理: 卡片的基本操作，批量操作编辑、替换、复制、删除、移动、打印等等。

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/card.png" alt="操作" width="600"/>

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/edit.png" alt="操作" width="600"/>

- 读卡: 随机读卡，还可以统计读卡时长。

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/read.png" alt="操作" width="600"/>

- 卡片报告：统计自你写卡以来的卡片情况，包括分类汇总统计、标签汇总统计、周/月/年汇总统计、按年分析统计。

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/report.png" alt="操作" width="600"/>
  
- 设置备份/还原/重置：在Zotero Settings的ZotCard配置页中可以对ZotCard设置进行备份/还原/重置。

## 高级

zotcard给你提供更多的自定义卡片空间，但需要你懂一点点[HTML](https://www.runoob.com/html/html-tutorial.html)。

```html
<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>
<p><strong>原文</strong>：<span>${text ? text : "&lt;摘抄&gt;"}</span></p>
<p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p>
<p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p>
<p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p>
<p><strong>标签</strong>：[无]</p>
<p><strong>日期</strong>：${today}</p>
```

如需要插入 <，>，空格，&，"，'，换行，分割线等特殊字符可在「◉」插入。

如需要插入表情，可在「🤪」插入。

如需要插入Zotero的字段，可在「字段」插入。

  以下为复盘卡模版：

```html
<h3>## 复盘卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\n
<p>- <strong>背景</strong>：<span style="color: #bbbbbb;">&lt;描述事情的背景，怎么引起的复盘。&gt;</span></p>
<p>- <strong>过程</strong>：<span style="color: #bbbbbb;">&lt;描述事情发送的过程，以及处理方式及结果。&gt;</span></p>
<p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;从此事情上得到什么启发，日后怎么改进。&gt;</span></p>
<p>- <strong>日期</strong>：{today}</p>
```

欢迎来这里寻找和分享你的卡片模版：[访问](https://github.com/018/zotcard/discussions/2)。

## 捐赠

<img src="https://raw.githubusercontent.com/018/zotcard/main/src/chrome/content/images/wechat-alipay.png" style="zoom:70%;float:left" />

或者

<a href="https://www.buymeacoffee.com/0x18" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## 许可证

[MIT](./LICENSE)

Copyright (c) 2020-2024 018




---

由本人新建的网站今日优读 [http://uread.today](http://uread.today) 已经上线，欢迎小伙伴围观。
