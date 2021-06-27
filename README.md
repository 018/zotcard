# zotcard
zotcard是Zotero的一个插件，它可以帮助你快速写卡片，提供了如概念卡、人物卡、反常识卡等等卡片模版，只需一步即可直接写卡。还提供复制多张卡片及批量打开浮动编辑窗口，方便拼卡成文。

[下载插件](https://github.com/018/zotcard/releases)

## 金句卡

![金句卡](https://raw.githubusercontent.com/018/zotcard/main/image/quotes.jpeg)

`<灰色字体>`需要你替换，下同。还可以自定义模版，请阅读下方「Card1/2/3...」。

## 概念卡

![概念卡](https://raw.githubusercontent.com/018/zotcard/main/image/concept.jpeg)

## 人物卡

![人物卡](https://raw.githubusercontent.com/018/zotcard/main/image/character.jpeg)

## 反常识卡

![反常识卡](https://raw.githubusercontent.com/018/zotcard/main/image/not_commonsense.jpeg)

## 技巧卡

![技巧卡](https://raw.githubusercontent.com/018/zotcard/main/image/skill.jpeg)

## 结构卡

![结构卡](https://raw.githubusercontent.com/018/zotcard/main/image/structure.jpeg)

## 通用卡

![通用卡](https://raw.githubusercontent.com/018/zotcard/main/image/general.jpeg)

## Card1/2/3...
预留6个卡片位，供你自定义。除了自定义模版之外还可以自定义菜单中的卡片名称。

进入「首选项」-「高级」-「设置编辑器」搜索 `zotcard` 进行配置。注意自定义后的配置手工复制保存进行备份。

![金句卡](https://raw.githubusercontent.com/018/zotcard/main/image/config.png)

- extensions.zotero.zotcard.card1：模块
- extensions.zotero.zotcard.card1.lable：Card1标题
- extensions.zotero.zotcard.card2：模块
- extensions.zotero.zotcard.card2.lable：Card2标题
- extensions.zotero.zotcard.card3：模块
- extensions.zotero.zotcard.card3.lable：Card3标题
- extensions.zotero.zotcard.card4：模块
- extensions.zotero.zotcard.card4.lable：Card4标题
- extensions.zotero.zotcard.card5：模块
- extensions.zotero.zotcard.card5.lable：Card5标题
- extensions.zotero.zotcard.card6：模块
- extensions.zotero.zotcard.card6.lable：Card6标题
- extensions.zotero.zotcard.character：人物卡模块
- extensions.zotero.zotcard.concept：概念卡模块
- extensions.zotero.zotcard.general：通用卡模块
- extensions.zotero.zotcard.not_commonsense：反常识卡模块
- extensions.zotero.zotcard.quotes：金句卡模块
- extensions.zotero.zotcard.skill：技巧卡模块
- extensions.zotero.zotcard.structure：结构卡模块

如需重置到默认配置，只需要保存为空即可。

在对应的配置项中进行修改配置。主要都是[html](https://www.runoob.com/html/html-tutorial.html)代码，下面以人物卡为例，进行说明：

```html
<h3>## 人物卡 - <span style="color: #bbbbbb;">&lt;姓名&gt;</span></h3>\n
<p>- <strong>简介</strong>：<span style="color: #bbbbbb;">&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p>
<p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p>
<p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p>
<p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span>
</p><p>- <strong>日期</strong>：{today}</p>
```

`&nbsp;`为空格，`&lt;`为<，`&gt;`为>，`\n`为回车（主要在生成的时候前面第一行为标题），另外还有书籍中的信息：`{authors}`为作者，`{title}`为书名，`{today}`为今天日期，`{now}`为现在时间，`{shortTitle}`为短标题，`{archiveLocation}`为归档位置，`{url}`为网址，`{date}`为日期，`{year}`为年份，`{extra}`为其他，`{publisher}`为出版社，`{ISBN}`为ISBN，`{numPages}`为总页数。

另外，可以在Zotero的笔记中设置好，然后右键「源代码」，复制出来也可以。

以下为复盘卡模版：

```html
<h3>## 复盘卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\n
<p>- <strong>背景</strong>：<span style="color: #bbbbbb;">&lt;描述事情的背景，怎么引起的复盘。&gt;</span></p>
<p>- <strong>过程</strong>：<span style="color: #bbbbbb;">&lt;描述事情发送的过程，以及处理方式及结果。&gt;</span></p>
<p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;从此事情上得到什么启发，日后怎么改进。&gt;</span></p>
<p>- <strong>日期</strong>：{today}</p>
```

效果如图：

![复盘卡](https://raw.githubusercontent.com/018/zotcard/main/image/checking.jpeg)

## 替换

![替换](https://raw.githubusercontent.com/018/zotcard/main/image/replace.jpg)

可以选择多个笔记，批量替换。

- Html：由于Zotero笔记的原内容是Html（可以通过在笔记「右键」-「源代码」查看），需要一定的Html基础。如果需要替换样式可以选择此选项。如把斜体字替换成粗体为`<em>文本</em>`替换成`<b>文本</b>`。
- 内容：仅仅只是笔记看到的内容进行替换。比如`<p>这只是个p字母</p>`把p替换成a，结果会是`<p>这只是个a字母</p>`，如果选择html选项，这结果为`<a>这只是个a字母</a>`。


## 复制

可以选择多个笔记进行复制，然后粘贴到word或记事本，或Typora。进行拼卡成文。

## 复制并创建

可以对一个笔记进行复制后创建，有时候写卡太长同步不了就可以用此功能。

## 打开浮动编辑窗口

可以选择多个笔记，打开浮动窗口直接进行拼卡成文。

