# zotcard
ZotCard is a plug-in for Zotero, which is a card note-taking enhancement tool. It provides card templates (such as concept card, character card, golden sentence card, etc., by default, you can customize other card templates), so you can write cards quickly. In addition, it helps you sort cards and standardize card formats.

[切换到中文](https://github.com/018/zotcard/blob/main/README_CH.md)

## Write a card

It supports new cards according to the template, and then write cards, but also supports batch creation of cards.

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard1_en.gif" alt="Card" width="600"/>
<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard2_en.gif" alt="Card" width="600"/>
<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard3_en.gif" alt="Card" width="600"/>

### 默认卡

The following card templates are provided by default:

- Quotes card: Golden sentence, quotation related.
- Concept card: Related to concepts and keywords.
- Character card: Character related.
- Uncommon sense card: Relate to your own cognitive thoughts.
- Skill Card: skills, operations, steps related.
- Structure Card: related to structure and composition.
- Essay Card: Ideas, essays, diary related.

### Custom card

By default, 6 custom cards are reserved. Custom cards give you more choices than the default cards. If you have other cards that you need to customize, you can customize them, such as replay cards, practical cards, diary cards, and so on.

Of course, you can also customize the card template by going to 「Zotero - 「Tools - 「ZotCard Option」 - 「Config」. For details, see 「Configuration」.


### Utility function

**Word count**

When selecting a note, count the number of words, lines, and space.

**Replace**

You can select multiple notes and replace them in batches.

- Html: Since the original content of Zotero notes is Html (which can be viewed by right-clicking on the notes - "Source code"), some Html foundation is required, so use with caution. Select this option if you need to replace styles. For example, replace italics with bold `<em> text </em>` with `<b> text </b>`.

- Content: Just replace what you see in your notes. For example, if you say `this is just a P letter` (source code is` <p> this is just a P letter </p> `) and replace p with H1, it will say `this is just an h1 letter`, if you select the HTML option, it will say `<h1> This is just an H1 letter </h1>`, The content is a level 1 heading.

**Copy**

You can select multiple notes to copy, and then paste into Word or notepad or Typora for spelling cards written.

**Copy and create**

Note can be copied to create, sometimes write card too long synchronization can use this function for card splitting.

**Open the separate window**

You can select multiple notes and open a floating window to write cards directly.

**Adjust the separate window**

In the floating edit window that is opened by 「Open the separate window」, it is stacked by default. This function allows you to set the number and height of a row displayed on the screen, tiled on the screen.

**Close the selected separate window**

You can optionally close the floating edit window in the floating edit window opened by opening the floating edit window.

**Close all**

This feature closes all floating edit Windows.

**Print**

This function can adjust the format and then print directly.

**Copy the link**

This function directly copies notes links, easy to jump to in notes or other software.

**The source code**

Since Zotero6 has removed view source code, this feature allows you to edit note source code.



## Read Card

Review the card after writing it and read it from time to time.

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/readcard_en.png" alt="Read the card" width="600"/>

Read cards for all selected cards (including My library, Categorization, Saved Search, group Library), focus mode support, powerful search (custom query time, author, card type, card label, and keyword search), and keyword highlighting.

At any time during the process of reading card can edit, positioning, to read the card can be hidden, can also be simple to spell card, placed at the top/down/up/down card, after the final confirmation location copy all or selected card content in Word editing tools such as paste, can also support export all or selected CARDS to HTML or TXT file.



## Card Report

After writing the card to the card statistics, so that you have a comprehensive understanding of their own cards.

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/cardreport_en.png" alt="cardreport" width="600"/>

For the selected (including "my library", "classification", "saved search", "group library"), support by day, by week, by year, by month statistics, but also the statistics of card types and card labels, you can also click the corresponding time to read cards.




## Options

**Configuration**

Open the configuration window: 「Zotero」 - 「Tools」 - 「ZotCard Option」 - 「Config」.

![config](https://raw.githubusercontent.com/018/zotcard/main/image/config_en.png)

Note Background: Sets the note editor background.

Custom card quantity: you can add custom card book at will, and configure card template immediately after modification.

Card template: visual configuration, as a novice can also be configured as desired card template.

If you need more style, learn a little [HTML](https://www.runoob.com/html/html-tutorial.html)。

```html
<h1>## Quotes Card - <span>&lt;Title&gt;</span></h1>
<p><strong>Original</strong>：<span>${text ? text : "&lt;extract&gt;"}</span></p>
<p><strong>Repeat</strong>：<span>&lt;Repeat it in your own words&gt;</span></p>
<p><strong>Inspired</strong>：<span>&lt;What are the implications?&gt;</span></p>
<p><strong>Provenance</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p>
<p><strong>Tag</strong>：[none]</p>
<p><strong>Data</strong>：${today}</p>
```

Insert if necessary `<`, `>`, `space`, `&`, `"`, `br`, `separator` can be inserted in 'Select Insert Special content'.

If you need to insert Zotero fields, you can insert them in 「Select insert special content」.

  Field information includes:

  - Time information: `${today}` is today's date, `${month}` is today's month, `${dayOfYear}`is the day of the year, `${weekOfYear}` is for the week of the year(By default, Sunday is the first day of a week. You can change the default value from Configuration to General.), `${week}` is Chinese Week. (The values are 日、一、二、三、四、五、六），`${week_en}`is English Week. （The values are Sun.、Mon.、Tues.、Wed.、Thurs.、Fri.、Sat.), `${now}` is the present time.
  - Additional information: '${text}' is the selected text in the literature.
  - Item information: Commonly used with `${title}` is title, `${collectionName}` is the category to which the entry belongs,`${itemLink}` is the item link, `${collectionLink}` is the collection connection, `${shortTitle}` is Short Title, `${archive}` is Archive，`${archiveLocation}` is Archive Location, `${url}` is URL, `${date}` is Date, `${year}` is Year, `${extra}` is Extra, `${publisher}` is Publisher, `${publicationTitle}` is Publication Title, `${ISBN}` is ISBN, `${numPages}` is Num Pages, `${authors}` is Author, `${translators}` is Translator ... [More, see Zotero field](https://aurimasv.github.io/z2csl/typeMap.xml)。
    Please use format `${...}`, `{...}` has been deprecated, because ${...} is the JS string template, you can `${You can program it}`, such as {text ? text : '<No Text>'}`。
    
  The following is the duplicate card template:

```html
<h3>## Checking card - <span style="color: #bbbbbb;">&lt;Title&gt;</span></h3>\n
<p>- <strong>Background</strong>：<span style="color: #bbbbbb;">&lt;Describe the background of the incident and how it started.&gt;</span></p>
<p>- <strong>Process</strong>：<span style="color: #bbbbbb;">&lt;Describe how things are sent, how they are handled, and the results.&gt;</span></p>
<p>- <strong>Inspired</strong>：<span style="color: #bbbbbb;">&lt;From this matter what inspiration, how to improve in the future.&gt;</span></p>
<p>- <strong>Date</strong>：{today}</p>
```

Welcome to find and share your card templates here：[Click](https://github.com/018/zotcard/discussions/2)。

**Reset**

Reset all configurations to default, that is, the default card style to default, clear all custom cards, and default to 6 reserved card slots. Use with caution. To reset a configuration item, right-click the configuration item and press Reset.

**The backup configuration ...**

Export all configurations (including default card styles and custom cards) to a local file for backup.

**Restore the configuration ...**

Restore local backup files (including default card styles and custom cards).



---

By my new website today excellent read [http://uread.today](http://uread.today) has been online, welcome small partners to watch.
