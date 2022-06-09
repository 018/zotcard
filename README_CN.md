# zotcard
zotcard是Zotero的一个插件，它是卡片法笔记的提效工具。它提供了卡片模版（如默认有概念卡、人物卡、金句卡等，支持自定义其他卡片模版），可以让你快速写卡。除此之外，还帮助你卡片分类以及统一卡片的标准格式。

## 写卡

支持按模版新建卡片，进行写卡，还支持批量建卡。

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard1.gif" alt="卡" width="600"/>
<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard2.gif" alt="卡" width="600"/>
<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard3.gif" alt="卡" width="600"/>
<img src="https://raw.githubusercontent.com/018/zotcard/main/image/newcard4.gif" alt="卡" width="600"/>

### 默认卡

![默认卡片样式-默认](https://raw.githubusercontent.com/018/zotcard/main/image/default-style.png)

默认提供了以下卡片模版：

- 金句卡：金句、语录相关。
- 概念卡：概念、关键字相关。
- 人物卡：人物相关。
- 反常识卡：与自己认知想法相关。
- 技巧卡：技巧、操作、步骤相关。
- 结构卡：机构、组成相关。
- 短文卡：想法、短文、日记相关。

### 自定义卡

默认预留6个自定义卡位，自定义卡为你提供除了默认卡片的更多选择。如果你有其他卡片需要自定义，即可对这些卡片进行自定义，如复盘卡、实事卡、日记卡等等。

当然，你也可以自定义卡片的模版，自定义模版的操作方法：「Zotero」-「工具」-「ZotCard 选项」-「配置」，具体请阅读「配置」。



### 辅助操作

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/note.png" alt="操作" width="300"/>

**字数统计**

选择一个笔记时，统计字数、行数和占空间大小。

**替换**

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/replace.jpg" alt="替换" width="200"/>

可以选择多个笔记，批量替换。

- Html：由于Zotero笔记的原内容是Html（可以通过在笔记「右键」-「源代码」查看），需要一定的Html基础，谨慎使用。如果需要替换样式可以选择此选项。如把斜体字替换成粗体为`<em>文本</em>`替换成`<b>文本</b>`。

- 内容：仅仅只是笔记看到的内容进行替换。比如内容为`这只是个p字母`（源代码为`<p>这只是个p字母</p>`）把p替换成h1，结果会是`这只是个h1字母`（源代码为`<p>这只是个h1字母</p>`），如果选择html选项，这结果为`<h1>这只是个h1字母</h1>`，内容就是一个一级标题。

**复制**

可以选择多个笔记进行复制，然后粘贴到word或记事本或Typora进行拼卡成文。

**复制并创建**

可以对一个笔记进行复制后创建，有时候写卡太长同步不了就可以用此功能进行卡片拆分。

**打开浮动编辑窗口**

可以选择多个笔记，打开浮动窗口直接进行拼卡成文。

**调整浮动编辑窗口**

在通过**打开浮动编辑窗口**打开的浮动编辑窗口，默认会堆一块。通过此功能可以设置显示在屏幕上一行多少个和高度，平铺在屏幕上。

**关闭所选浮动编辑窗口**

在通过**打开浮动编辑窗口**打开的浮动编辑窗口，可以通过此功能进行选择性的关闭浮动编辑窗口。

**关闭所有**

此功能关闭所有浮动编辑窗口。

**打印**

此功能可调整格式然后直接打印。

**复制链接**

此功能直接复制笔记的链接，方便在笔记或其他软件中跳转。

**源代码**

由于Zotero6去掉了查看源代码，此功能可以编辑笔记的源代码。



## 读卡

写卡之后对卡片的回顾，时不时进行读卡。

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/readcard.png" alt="读卡" width="600"/>

对所选（包括「我的文库」、「分类」、「保存的搜索」、「群组文库」）中所有卡片进行读卡，支持专注模式，还支持强大的搜索（自定义查询时间、作者、卡片类型、卡片标签和关键字搜索），还支持关键字高亮显示。

在读卡过程中随时可以编辑、定位，对已读的卡片可以隐藏，还可以简单进行拼卡，置顶/置底/上移/下移卡片，最后确认位置后复制所有或选中的卡片内容在Word等编辑工具粘贴，还能支持导出所有或选中的卡片到HTML或txt文件。

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/card-operation.png" alt="卡片操作" width="300"/>



## 卡片报告

写卡之后对卡片进行统计，让你对自己的卡片有一个全方位的认知。

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/cardreport.png" alt="卡片报告" width="600"/>

对所选（包括「我的文库」、「分类」、「保存的搜索」、「群组文库」）中统计卡片，支持按天、按周、按年、按月统计，还统计出卡片类型和卡片标签，还可以继续点击对应时间进行读卡。




## 选项

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/option.png" alt="选项" width="300"/>

**配置**

打开配置窗口：「Zotero」-「工具」-「ZotCard 选项」-「配置」。

![配置](https://raw.githubusercontent.com/018/zotcard/main/image/config.png)

笔记背景：设置笔记编辑器背景。

自定义卡片数量：可随意添加自定义卡片书了，修改后立即可配置卡片模版。

卡片模版：可视化配置，作为新手也可随心所欲的配置卡片模版。

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/noteedit.png" alt="笔记编辑" width="200"/>

如果你需要更多样式，还需要学一点点的[HTML](https://www.runoob.com/html/html-tutorial.html)。

```html
<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>
<p><strong>原文</strong>：<span>${text ? text : "&lt;摘抄&gt;"}</span></p>
<p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p>
<p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p>
<p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p>
<p><strong>标签</strong>：[无]</p>
<p><strong>日期</strong>：${today}</p>
```

如需要插入 `<`，`>`，`空格`，`&`，`"`,`'`,`换行`,`分割线`可在「选择插入特殊内容」插入。

如需要插入Zotero的字段，可在「选择插入字段」插入。

  字段信息主要有：

  - 时间信息：`${today}`为今天日期，`${month}`为月份，`${dayOfYear}`为今年第几天，`${weekOfYear}`为今年第几周（默认是以周日作为一周的第一天，可通过「配置」-「常规」修改。），`${week}`为星期几（值为日、一、二、三、四、五、六），`${week_en}`为英文的星期几（值为Sun.、Mon.、Tues.、Wed.、Thurs.、Fri.、Sat.），`${now}`为现在时间。
  - 扩展信息：`${text}`为文献中选中的文字。
  - 条目信息：常用的有`${title}`为书名，`${collectionName}`为条目所属的分类，`${itemLink}`为条目链接，`${collectionLink}`，为分类链接，`${shortTitle}`为短标题，`${archive}`为归档，`${archiveLocation}`为归档位置，`${url}`为网址，`${date}`为日期，`${year}`为年份，`${extra}`为其他，`${publisher}`为出版社，`${publicationTitle}`为期刊，`${ISBN}`为ISBN，`${numPages}`为总页数，`${authors}`为作者，`${translators}`为译者 ... [更多属性，参考Zotero field。](https://aurimasv.github.io/z2csl/typeMap.xml)。
    请使用`${...}`这种格式，`{...}`已经弃用，因为${...}是JS的字符串模版，你可以`${这里面可以编程}`，比如`{text ? text : '<无选择文字>'}`。

  以下为复盘卡模版：

```html
<h3>## 复盘卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\n
<p>- <strong>背景</strong>：<span style="color: #bbbbbb;">&lt;描述事情的背景，怎么引起的复盘。&gt;</span></p>
<p>- <strong>过程</strong>：<span style="color: #bbbbbb;">&lt;描述事情发送的过程，以及处理方式及结果。&gt;</span></p>
<p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;从此事情上得到什么启发，日后怎么改进。&gt;</span></p>
<p>- <strong>日期</strong>：{today}</p>
```

欢迎来这里寻找和分享你的卡片模版：[访问](https://github.com/018/zotcard/discussions/2)。

**重置**

重置所有配置为默认状态，也就是默认卡的样式为默认样式，清空所有自定义卡，并默认为6个预留卡位。请谨慎使用。如需重置某一个配置项，只需要在配置项「右键」-「reset」即可。

**备份配置 ...**

把所有配置（包括默认卡样式、自定义卡）导出成文件保存到本地进行备份。

**还原配置 ...**

把本地的备份文件（包括默认卡样式、自定义卡）还原。

**官网**

访问此页面。




---

由本人新建的网站今日优读 [http://uread.today](http://uread.today) 已经上线，欢迎小伙伴围观。
