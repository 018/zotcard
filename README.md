# zotcard
zotcard是Zotero的一个插件，它可以帮助你快速写卡片、或笔记，提供了如概念卡、人物卡、反常识卡等等卡片模版，只需一步即可直接写卡，无需复杂模版。还提供复制多张卡片及批量打开浮动编辑窗口，调整浮动编辑窗口，方便拼卡成文。

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/card.png" alt="卡" width="300"/>

## 默认卡

目前支持以下卡片：

- 金句卡：金句、语录相关。
- 概念卡：概念、关键字相关。
- 人物卡：人物相关。
- 反常识卡：与自己认知想法相关。
- 技巧卡：技巧、操作、步骤相关。
- 结构卡：机构、组成相关。
- 短文卡：想法、短文、日记相关。

以上卡片支持三种样式：

- 默认样式：[下载](https://raw.githubusercontent.com/018/zotcard/main/zotcardstyle/default.zotcardstyle) (「右键」-「链接存储为...」)

  ![默认卡片样式-默认](https://raw.githubusercontent.com/018/zotcard/main/image/default-style.png)

- 社交样式：[下载](https://raw.githubusercontent.com/018/zotcard/main/zotcardstyle/social.zotcardstyle) (「右键」-「链接存储为...」)

  ![默认卡片样式-社交样式](https://raw.githubusercontent.com/018/zotcard/main/image/social-style.png)

- 卡片样式：[下载](https://raw.githubusercontent.com/018/zotcard/main/zotcardstyle/card.zotcardstyle) (「右键」-「链接存储为...」)

  ![默认卡片样式-卡片样式](https://raw.githubusercontent.com/018/zotcard/main/image/card-style.png)

- 便签样式：[下载](https://raw.githubusercontent.com/018/zotcard/main/zotcardstyle/memo.zotcardstyle) (「右键」-「链接存储为...」)

  ![默认卡片样式-便签样式](https://raw.githubusercontent.com/018/zotcard/main/image/memo-style.png)

可以根据自己喜好进行替换。更换默认卡样式的操作方法：「Zotero」-「工具」-「ZotCard 选项」-「更换默认卡片样式 ...」-「选择对应的下载样式文件」。

当然，你也可以自定义默认卡片，操作方法：「Zotero」-「工具」-「ZotCard 选项」-「配置」。

![配置](https://raw.githubusercontent.com/018/zotcard/main/image/config1.png)

每一张卡片的配置由三项组成，如`extensions.zotero.zotcard.quotes`为金句卡模版、`extensions.zotero.zotcard.quotes.label`为金句卡标题和`extensions.zotero.zotcard.quotes.visible`为金句卡是否显示。模版是在点击了右键的菜单时会按这个模版内容新增一个笔记，模版内容为HTML，具体可阅读下文的自定义卡片。标题是右键的菜单标题，修改后会在右键的菜单中对应修改。是否显示是控制右键的菜单是否显示，true显示，false时菜单被隐藏。默认卡的全部配置项如下：

- `extensions.zotero.zotcard.quotes`：金句卡模版
- `extensions.zotero.zotcard.quotes.label`：金句卡标题

- `extensions.zotero.zotcard.quotes.visible`：金句卡显示

- `extensions.zotero.zotcard.concept`：概念卡模版
- `extensions.zotero.zotcard.concept.label`：概念卡标题

- `extensions.zotero.zotcard.concept.visible`：概念卡显示

- `extensions.zotero.zotcard.character`：人物卡模版
- `extensions.zotero.zotcard.character.label`：人物卡标题

- `extensions.zotero.zotcard.character.visible`：人物卡显示

- `extensions.zotero.zotcard.not_commonsense`：反常识卡模版
- `extensions.zotero.zotcard.not_commonsense.label`：反常识卡标题

- `extensions.zotero.zotcard.not_commonsense.visible`：反常识卡显示

- `extensions.zotero.zotcard.skill`：技巧卡模版
- `extensions.zotero.zotcard.skill.label`：技巧卡标题

- `extensions.zotero.zotcard.skill.visible`：技巧卡显示

- `extensions.zotero.zotcard.structure`：结构卡模版
- `extensions.zotero.zotcard.structure.label`：结构卡标题

- `extensions.zotero.zotcard.structure.visible`：结构卡显示

- `extensions.zotero.zotcard.general`：短文卡模版
- `extensions.zotero.zotcard.general.label`：短文卡标题

- `extensions.zotero.zotcard.general.visible`：短文卡显示



## 自定义卡

默认预留6个自定义卡位，自定义卡为你提供除了默认卡片的更多选择。如果你有其他卡片需要自定义，即可对这些卡片进行自定义，如复盘卡、实事卡、日记卡等等。

自定义的操作方法：「Zotero」-「工具」-「ZotCard 选项」-「配置」。

![配置](https://raw.githubusercontent.com/018/zotcard/main/image/config2.png)

首先配置自定义卡片数，配置项为`extensions.zotero.zotcard.card-quantity`，默认为6，可根据自己需要增加或减少，增加或减少时会自动增加或减少卡片对应的设置。

每一张卡片的配置跟默认卡一样由三项组成，如`extensions.zotero.zotcard.card1`为自定义第一卡位模版、`extensions.zotero.zotcard.card1.label`为自定义第一卡位标题和`extensions.zotero.zotcard.card1.visible`为自定义第一卡位是否显示。模版、标题和是否显示也跟默认卡一样。关于自定义卡的配置项如下：

- `extensions.zotero.zotcard.card1`：卡片1模版
- `extensions.zotero.zotcard.card1.label`：卡片1标题
- `extensions.zotero.zotcard.card1.visible`：卡片1是否显示
- ...
- `extensions.zotero.zotcard.cardN`：卡片N模版
- `extensions.zotero.zotcard.cardN.label`：卡片N菜单
- `extensions.zotero.zotcard.cardN.visible`：卡片N是否显示

如果你需要自定义自己的模版，在对应的配置项中进行修改配置，但之前你需要学一点点的HTML。主要都是[HTML](https://www.runoob.com/html/html-tutorial.html)代码，下面以人物卡为例，进行说明：

```html
<h3>## 人物卡 - <span style="color: #bbbbbb;">&lt;姓名&gt;</span></h3>\n
<p>- <strong>简介</strong>：<span style="color: #bbbbbb;">&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p>
<p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p>
<p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p>
<p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span>
</p><p>- <strong>日期</strong>：{today}</p>
```

`<h3>...</h3>`为三级标题，如需要一级标题可以改为`<h1>...</h1>`。

`<span>...</span>`可以修改文字的样式。如`<span style="color: #bbbbbb;">...</span>`是修改文字的颜色为灰色，其他颜色可以使用Excel的颜色选取，找到带#的代码就是了。

`&lt;`为<，`&gt;`为>。

`\n`为回车（主要在生成的时候前面第一行为标题）。

`&nbsp;`为空格

`<strong>...</strong>`为加粗字体。

`<p>...</p>`为一项信息。

`<br />`为换行，跟`p`的区别就是行间距不一样，`br`的行间距比较小。

另外还有书籍中的信息：`{authors}`为作者，`{title}`为书名，`{shortTitle}`为短标题，`{archive}`为归档，`{archiveLocation}`为归档位置，`{url}`为网址，`{date}`为日期，`{year}`为年份，`{extra}`为其他，`{publisher}`为出版社，`{ISBN}`为ISBN，`{numPages}`为总页数，时间信息：`{today}`为今天日期，`{month}`为月份，`{dayOfYear}`为今年第几天，`{weekOfYear}`为今年第几周（默认是以周日作为一周的第一天，以周一作为第一天可以配置`extensions.zotero.zotcard.startOfWeek`为1。），`{week}`为星期几（值为日、一、二、三、四、五、六），`{week_en}`为英文的星期几（值为Sun.、Mon.、Tues.、Wed.、Thurs.、Fri.、Sat.），`{now}`为现在时间。

有一个技巧，就是在Zotero的笔记中编辑好，然后右键「源代码」，复制出来也可以。

以下为复盘卡模版：

```html
<h3>## 复盘卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\n
<p>- <strong>背景</strong>：<span style="color: #bbbbbb;">&lt;描述事情的背景，怎么引起的复盘。&gt;</span></p>
<p>- <strong>过程</strong>：<span style="color: #bbbbbb;">&lt;描述事情发送的过程，以及处理方式及结果。&gt;</span></p>
<p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;从此事情上得到什么启发，日后怎么改进。&gt;</span></p>
<p>- <strong>日期</strong>：{today}</p>
```

欢迎来这里寻找和分享你的卡片模版：[访问](https://github.com/018/zotcard/discussions/2)。



## 笔记操作

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

在通过**打开浮动编辑窗口**打开的浮动编辑窗口，默认会堆一块。通过此功能可以设置显示在屏幕上一行多少个，平铺在屏幕上。

**关闭所选浮动编辑窗口**

在通过**打开浮动编辑窗口**打开的浮动编辑窗口，可以通过此功能进行选择性的关闭浮动编辑窗口。

**关闭所有**

此功能关闭所有浮动编辑窗口。

**压缩图片**

此功能调用tinypng接口，设置api key即可图片压缩，还可多次压缩。为笔记压缩，尽可能可同步。可以设置`zotcard.config.compress_with_width_and_height`为true，跟随宽高进行压缩，属于高度压缩会影响图片质量。



## 选项

<img src="https://raw.githubusercontent.com/018/zotcard/main/image/option.png" alt="选项" width="300"/>

**配置**

打开配置窗口。

**重置**

重置所有配置为默认状态，也就是默认卡的样式为默认样式，清空所有自定义卡，并默认为6个预留卡位。请谨慎使用。如需重置某一个配置项，只需要在配置项「右键」-「reset」即可。

**备份配置 ...**

把所有配置（包括默认卡样式、自定义卡）导出成文件保存到本地进行备份。

**还原配置 ...**

把本地的备份文件（包括默认卡样式、自定义卡）还原。

**更换默认卡片样式 ...**

作者为你提供了三种默认卡片样式：默认、社交和卡片。请参考上文图片，根据喜好进行下载，然后通过此功能进行替换。

**笔记背景**

你可以修改笔记的背景，这里设置之后会对所有笔记（卡片）的背景生效，目前预设了：

- 灰色：灰色背景。如果你的默认卡用卡片样式，建议你用此背景，看起来卡片相当舒服。

- 暗色：深黑背景。

- 莫兰迪色系：参考了实体的便签颜色。如果你的默认卡用便签样式，可以试试这些背景。

- 重置：重置到默认状态。默认为白色。

**官网**

访问此页面。



---

由本人新建的网站今日优读 [http://uread.today](http://uread.today) 已经上线，欢迎小伙伴围观。
