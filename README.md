<p align="center">
  <img width="320" src="https://raw.githubusercontent.com/018/zotcard/main/image/zotcard.png">
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
English | [简体中文](https://github.com/018/zotcard/blob/main/README_CN.md)

## Introduction
ZotCard is a plug-in for Zotero, which is a card note-taking enhancement tool. It provides card templates (such as concept card, character card, golden sentence card, etc., by default, you can customize other card templates), so you can write cards quickly. In addition, it helps you sort cards and standardize card formats.

## Getting started

- Step 1, download the latest version zotcard: [Download](https://github.com/018/zotcard/releases);

- Step 2: Zotero - Tools - Add-ons - ⚙️ - Install Add-on From File... , select the plug-in xpi file;

- Step 3, right-click the item - ZotCard - summary card, you can quickly create the card according to the template.

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard1_en.gif" width="600"/>

## Features
- Fast card building: Preset card template, support custom card module.

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/setting_en.png" width="600"/>

- Card management: Basic card operation, batch operation edit, copy, delete, move, print.

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/edit_en.png" width="600"/>

- Read card: Randomly read the card, you can also count the time of reading the card.

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/read_en.png" width="600"/>

- Card report: Statistics of the status of the card since you wrote the card, including classified summary statistics, label summary statistics, weekly/monthly/annual summary statistics, and annual analysis statistics.

  <img src="https://raw.githubusercontent.com/018/zotcard/main/image/report_en.png" width="600"/>

- Set up Backup/Restore/Reset: ZotCard Settings can be backed up/restore/reset from the ZotCard configuration page of Zotero Settings.

## Advanced

Zotcard custom CARDS give you more space, but need you to know a little [HTML](https://www.runoob.com/html/html-tutorial.html).

```html
<h1>## Quotes Card - <span>&lt;Title&gt;</span></h1>
<p><strong>Original</strong>: <span>${text ? text : "&lt;extract&gt;"}</span></p>
<p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p>
<p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p>
<p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p>
<p><strong>Tag</strong>: [none]</p>
<p><strong>Date</strong>: ${today}</p>
```

Insert Special characters such as, <,>,Spaces, &, ", ', newlines, and delimiters can be inserted at "◉".

If you want to insert an emoji, you can do so at 🤪.

If you want to insert a field from Zotero, you can do so in Fields.

The following are double plate templates:

```html
<h3>## Review card - <span style="color: #bbbbbb;">&lt;title&gt;</span></h3>\n
<p>- <strong>backdrop</strong>：<span style="color: #bbbbbb;">&lt;Describe the background to what happened, how it caused the rematch.&gt;</span></p>
<p>- <strong>course</strong>：<span style="color: #bbbbbb;">&lt;Describe the process by which things are sent, and how they are handled and the results.&gt;</span></p>
<p>- <strong>enlighten</strong>：<span style="color: #bbbbbb;">&lt;What inspiration can be gained from this matter and how to improve it in the future.&gt;</span></p>
<p>- <strong>date</strong>：{today}</p>
```

Welcome to come here to find and share your card template: [Visit](https://github.com/018/zotcard/discussions/2).

## Donate

<img src="https://raw.githubusercontent.com/018/zotcard/main/src/chrome/content/images/wechat-alipay.png" style="zoom:70%;float:left" />

OR

<a href="https://www.buymeacoffee.com/0x18" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

[MIT](./LICENSE)

Copyright (c) 2020-2023 018
