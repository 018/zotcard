'use strict'

if (!Zotero.getMainWindow().Zotero) Zotero.getMainWindow().Zotero = {}
if (!Zotero.getMainWindow().Zotero.ZotCard) Zotero.getMainWindow().Zotero.ZotCard = {}
if (!Zotero.getMainWindow().Zotero.ZotCard.Cards) Zotero.getMainWindow().Zotero.ZotCard.Cards = {}

Zotero.getMainWindow().Zotero.ZotCard.Cards = {
	quotes: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>原文</strong>：<span>${text ? text : "&lt;摘抄&gt;"}</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Quotes Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Original</strong>: <span>${text ? text : "&lt;extract&gt;"}</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 金句卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span style="color: #bbbbbb;">&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>原文</strong>：<span>${text ? text : "&lt;摘抄&gt;"}</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Quotes Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Original</strong>: <span>${text ? text : "&lt;extract&gt;"}</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>原文</strong>：<span>${text ? text : "&lt;摘抄&gt;"}</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Quotes Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Original</strong>: <span>${text ? text : "&lt;extract&gt;"}</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},
	concept: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 概念卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p><strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Concept Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Presenter</strong>: <span>&lt;:Name&gt;</span>, <span>&lt;Year&gt;</span></p><p><strong>Description</strong>: <span>&lt;Describe or extract&gt;</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 概念卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span style="color: #bbbbbb;">&lt;姓名&gt;</span>, <span style="color: #bbbbbb;">&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 概念卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p><strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 概念卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p><strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Concept Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Presenter</strong>: <span>&lt;:Name&gt;</span>, <span>&lt;Year&gt;</span></p><p><strong>Description</strong>: <span>&lt;Describe or extract&gt;</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 概念卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p><strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Concept Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Presenter</strong>: <span>&lt;:Name&gt;</span>, <span>&lt;Year&gt;</span></p><p><strong>Description</strong>: <span>&lt;Describe or extract&gt;</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},
	character: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 人物卡 - <span>&lt;姓名&gt;</span></h1>\\n<p><strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p><strong>作品</strong>：</p><p><strong>成就</strong>：</p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Personage Card - <span>&lt;Name&gt;</span></h1>\\n<p><strong>Introductory</strong>: <span>&lt;Date of birth, place of birth, university, biography, etc&gt;</span></p><p><strong>Works</strong>: </p><p><strong>Achievement</strong>: </p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 人物卡 - <span style="color: #bbbbbb;">&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span style="color: #bbbbbb;">&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：</p><p>- <strong>成就</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：</p><p>- <strong>成就</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 人物卡 - <span>&lt;姓名&gt;</span></h1>\\n<p><strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p><strong>作品</strong>：</p><p><strong>成就</strong>：</p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 人物卡 - <span>&lt;姓名&gt;</span></h1>\\n<p><strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p><strong>作品</strong>：</p><p><strong>成就</strong>：</p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Personage Card - <span>&lt;Name&gt;</span></h1>\\n<p><strong>Introductory</strong>: <span>&lt;Date of birth, place of birth, university, biography, etc&gt;</span></p><p><strong>Works</strong>: </p><p><strong>Achievement</strong>: </p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 人物卡 - <span>&lt;姓名&gt;</span></h1>\\n<p><strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p><strong>作品</strong>：</p><p><strong>成就</strong>：</p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Personage Card - <span>&lt;Name&gt;</span></h1>\\n<p><strong>Introductory</strong>: <span>&lt;Date of birth, place of birth, university, biography, etc&gt;</span></p><p><strong>Works</strong>: </p><p><strong>Achievement</strong>: </p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},
	not_commonsense: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 反常识卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p><strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Uncommonsense Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Commonsense</strong>: <span>&lt;Common sense in cognition&gt;</span></p><p><strong>Uncommonsense</strong>: <span>&lt;Perceptions that need to be refreshed&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 反常识卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span style="color: #bbbbbb;">&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span style="color: #bbbbbb;">&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 反常识卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p><strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 反常识卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p><strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Uncommonsense Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Commonsense</strong>: <span>&lt;Common sense in cognition&gt;</span></p><p><strong>Uncommonsense</strong>: <span>&lt;Perceptions that need to be refreshed&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>标签</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 反常识卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p><strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Uncommonsense Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Commonsense</strong>: <span>&lt;Common sense in cognition&gt;</span></p><p><strong>Uncommonsense</strong>: <span>&lt;Perceptions that need to be refreshed&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},
	skill: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 技巧卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Skill Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Steps</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 技巧卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 技巧卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 技巧卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Skill Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Steps</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 技巧卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Skill Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Steps</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},
	structure: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 结构卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Structure Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Content</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 结构卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 结构卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 结构卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Structure Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Content</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 结构卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Structure Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Content</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},
	abstract: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 摘要卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>摘要</strong>：<span>${text ? text : "&lt;原文句子&gt;"}</span></p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Abstract Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Abstract</strong>：<span>${text ? text : "&lt;The original sentence&gt;"}</span></p><p><strong>Reference</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>：[none]</p><p><strong>Date</strong>：${today}</p>',
		history: ['<h3>## 摘要卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>摘要</strong>：<span>&lt;原文句子&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 摘要卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>摘要</strong>：<span>&lt;原文句子&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 摘要卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>摘要</strong>：<span>${text ? text : "&lt;原文句子&gt;"}</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Abstract Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Abstract</strong>：<span>${text ? text : "&lt;The original sentence&gt;"}</span></p><p><strong>Reference</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>：[none]</p><p><strong>Date</strong>：${today}</p>',
			'<h1>## 摘要卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>摘要</strong>：<span>${text ? text : "&lt;原文句子&gt;"}</span></p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Abstract Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Abstract</strong>：<span>${text ? text : "&lt;The original sentence&gt;"}</span></p><p><strong>Reference</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>：[none]</p><p><strong>Date</strong>：${today}</p>']
	},
	general: {
		default: Zotero.locale.startsWith('zh') ? '<h1>## 短文卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>正文</strong>：</p><p><strong>出处</strong>：${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
			: '<h1>## Essay Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Body</strong>: </p><p><strong>Reference</strong>: ${itemType ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
		history: ['<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 通用卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h3>## 短文卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>正文</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
			'<h1>## 短文卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>正文</strong>：</p><p><strong>出处</strong>：${authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>',
			'<h1>## 短文卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>正文</strong>：</p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Essay Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Body</strong>: </p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>',
			'<h1>## 短文卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>正文</strong>：</p><p><strong>出处</strong>：${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;页码&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>',
			'<h1>## Essay Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Body</strong>: </p><p><strong>Reference</strong>: ${itemType && itemType === "book" ? `<a href="${itemLink}">${authors}《${title}》(${year}) P<span>&lt;Page&gt;</span></a>` : `<a href="${collectionLink}">${collectionName}</a>`}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>']
	},

	initPref: function (name, item, beforeDefs, def) {
		var card
		var isDef = false
		var val = Zotero.Prefs.get(`zotcard.${item}`)
		if (val) {
			if (beforeDefs.indexOf(val) > -1) {
				isDef = true
			} else {
				card = val
			}
		} else {
			isDef = true
		}
		if (isDef) {
			card = def
			Zotero.Prefs.set(`zotcard.${item}`, card)
		}
	
		var label = Zotero.Prefs.get(`zotcard.${item}.label`)
		if (label === undefined) {
			label = name
			Zotero.Prefs.set(`zotcard.${item}.label`, label)
		}
	
		var visible = Zotero.Prefs.get(`zotcard.${item}.visible`)
		if (visible === undefined) {
			visible = true
			Zotero.Prefs.set(`zotcard.${item}.visible`, visible)
		}
		return { card: card, label: label, visible: visible }
	},
	
	initReservedPref: function (item) {
		var card = Zotero.Prefs.get(`zotcard.${item}`)
		if (!card) {
			card = ''
			Zotero.Prefs.set(`zotcard.${item}`, card)
		}
		var label = Zotero.Prefs.get(`zotcard.${item}.label`)
		if (!label) {
			Zotero.Prefs.set(`zotcard.${item}.label`, item)
		}
		var visible = Zotero.Prefs.get(`zotcard.${item}.visible`)
		if (visible === undefined || visible.length === 0) {
			visible = true
			Zotero.Prefs.set(`zotcard.${item}.visible`, visible)
		}
		return { card: card, label: label, visible: visible }
	},
	
	initPrefs: function (item) {
		var pref
		var beforeDefs
		var def
		if (!item) {
			let json = {}
			pref = this.initPrefs('quotes')
			json.quotes = pref
			pref = this.initPrefs('concept')
			json.concept = pref
			pref = this.initPrefs('character')
			json.character = pref
			pref = this.initPrefs('not_commonsense')
			json.not_commonsense = pref
			pref = this.initPrefs('skill')
			json.skill = pref
			pref = this.initPrefs('structure')
			json.structure = pref
			pref = this.initPrefs('abstract')
			json.abstract = pref
			pref = this.initPrefs('general')
			json.general = pref
			let quantity = this.initPrefs('card_quantity')
			json.card_quantity = quantity
			for (let index = 0; index < quantity; index++) {
				pref = this.initPrefs(`card${index + 1}`)
				json[`card${index + 1}`] = pref
			}
			return json
		} else {
			switch (item) {
				case 'quotes':
				case 'concept':
				case 'character':
				case 'not_commonsense':
				case 'skill':
				case 'structure':
				case 'abstract':
				case 'general':
					beforeDefs = Zotero.ZotCard.Cards[item].history
					def = Zotero.ZotCard.Cards[item].default
					pref = this.initPref(Zotero.ZotCard.Utils.getString(`zotcard.${item}card`), item, beforeDefs, def)
				break
				case 'card_quantity':
					var quantity = Zotero.Prefs.get('zotcard.card_quantity')
					if (quantity === undefined) {
						quantity = 6
						Zotero.Prefs.set('zotcard.card_quantity', quantity)
					}
					pref = quantity
					break
				default:
					pref = this.initReservedPref(item)
					break
			}
		}
	
		return pref
	},

	newCard: async function (collection, item, name, text) {
		var pref = this.initPrefs(name)
		if (!pref || !pref.card) {
			Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.pleaseconfigure', name))
			return
		}
	
		return await this.newCardWithTemplate(collection, item, pref.card, text)
	},
	
	newCardWithTemplate: async function (collection, item, template, text) {
		try {
			var itemType
			let year
			var nowDate = new Date()
			var now = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd HH:mm:ss')
			var today = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd')
			var month = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM')
			var firstDay = new Date()
			firstDay.setMonth(0)
			firstDay.setDate(1)
			firstDay.setHours(0)
			firstDay.setMinutes(0)
			firstDay.setSeconds(0)
			firstDay.setMilliseconds(0)
			let dateGap = nowDate.getTime() - firstDay.getTime() + 1
			let dayOfYear = Math.ceil(dateGap / (24 * 60 * 60 * 1000))
			// 0: 周日开始
			// 1: 周一开始
			let startOfWeek = Zotero.Prefs.get('zotcard.startOfWeek')
			if (!startOfWeek) {
				startOfWeek = 0
				Zotero.Prefs.set('zotcard.startOfWeek', startOfWeek)
			}
			firstDay.setDate(1 + (7 - firstDay.getDay() + startOfWeek) % 7)
			dateGap = nowDate.getTime() - firstDay.getTime()
			let weekOfYear = Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000)) + 1
			let week = ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()]
			let weekEn = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.'][nowDate.getDay()]
			itemType = item ? item.itemType : undefined
			year = item ? item.getField('year') : undefined
		
			var itemLink = item ? Zotero.ZotCard.Utils.getZoteroItemUrl(item.key) : ''
			var collectionLink = collection ? Zotero.ZotCard.Utils.getZoteroCollectionUrl(collection.key) : ''
			Zotero.debug(`zotcard@itemLink: ${itemLink}, collectionLink: ${collectionLink}`)
			var json = item ? item.toJSON() : {}
			var itemFields = Zotero.ItemFields.getAll().map(e => e.name)
			var creatorTypes = Zotero.CreatorTypes.getTypes().map(e => e.name)
			const spliceItemFields = (field) => {
				var index = itemFields.indexOf(field)
				while (index > -1) {
					itemFields.splice(index, 1)
					index = itemFields.indexOf(field)
				}
			}
			const spliceCreatorTypes = (type) => {
				var index = creatorTypes.indexOf(type)
				while (index > -1) {
					creatorTypes.splice(index, 1)
					index = creatorTypes.indexOf(type)
				}
			}
			
			var clipboardText = Zotero.getMainWindow().Zotero.ZotCard.Utils.getClipboard()
			var tags = []
			var dateAdded = ''
			var dateModified = ''
			var accessDate = ''
			let econtent = '(() => {\n' +
				'var clipboardText = "' + (clipboardText || '').replace(/\n/g, '\\n').replace(/"/g, '\\"') + '";\n' +
				'var now = "' + now + '";\n' +
				'var today = "' + today + '";\n' +
				'var week = "' + week + '";\n' +
				'var week_en = "' + weekEn + '";\n' +
				'var weekOfYear = "' + weekOfYear + '";\n' +
				'var dayOfYear = "' + dayOfYear + '";\n' +
				'var itemType = "' + (itemType ? itemType : '') + '";\n' +
				'var month = "' + month + '";\n' +
				'var year = "' + (year ? year : '') + '";\n' +
				'var itemLink = "' + itemLink + '";\n' +
				'var collectionName = "' + (collection ? collection.name : '') + '";\n' + 
				'var collectionLink = "' + collectionLink + '";\n'
			for (const key in json) {
				if (Object.hasOwnProperty.call(json, key)) {
				const element = json[key];
				switch (key) {
					case 'tags':
						tags.push(...element.map(e => e.tag))
						spliceItemFields(key)
						break;
					case 'creators':
						var creators = {}
						if (element.length > 0) {
							element.forEach(ee => {
							var name = ee.name
							if (!name) {
								var isCN1 = ee.lastName.match('[\u4e00-\u9fa5]+')
								var isCN2 = ee.firstName.match('[\u4e00-\u9fa5]+')
								name = ee.lastName + (isCN1 || isCN2 ? '' : ' ') + ee.firstName
							}
							if (Object.hasOwnProperty.call(creators, ee.creatorType)) {
								creators[ee.creatorType].push(name)
							} else {
								creators[ee.creatorType] = [name]
							}
							})
							for (const key in creators) {
							if (Object.hasOwnProperty.call(creators, key)) {
								const e = creators[key];
								econtent += 'var ' + key + 's = ' + JSON.stringify(e) + ';\n'
								spliceCreatorTypes(key)
							}
							}
						}
						break;
					case 'relations':
					case 'collections':
						break;
					case 'accessDate':
						Zotero.debug('zotcard@' + key + ': ' + element)
						accessDate = Zotero.ZotCard.Utils.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss')
						spliceItemFields(key)
						break;
					case 'dateAdded':
						Zotero.debug('zotcard@' + key + ': ' + element)
						dateAdded = Zotero.ZotCard.Utils.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss')
						spliceItemFields(key)
						break;
					case 'dateModified':
						Zotero.debug('zotcard@' + key + ': ' + element)
						dateModified = Zotero.ZotCard.Utils.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss')
						spliceItemFields(key)
						break;
					default:
						switch (Object.prototype.toString.call(element)) {
							case '[object Number]':
							case '[object Boolean]':
								econtent += 'var ' + key + ' = ' + element + ';\n'
								spliceItemFields(key)
								break;
							case '[object String]':
								econtent += 'var ' + key + ' = "' + element.replace(/"|'/g, "\\\"").replace(/\n/g, "\\n") + '";\n'
								spliceItemFields(key)
								break;
							case '[object Object]':
							case '[object Array]':
								econtent += 'var ' + key + ' = ' + JSON.stringify(element) + ';\n'
								spliceItemFields(key)
								break;
							default:
								break;
						}
						break;
					}
				}
			}
			itemFields.forEach(element => {
				econtent += 'var ' + element + ' = "";\n'
			});
			creatorTypes.forEach(element => {
				econtent += 'var ' + element + 's = "";\n'
			});
			econtent += 'var tags = ' + JSON.stringify(tags) + ';\n'
			econtent += 'var accessDate = "' + accessDate + '";\n'
			econtent += 'var dateAdded = "' + dateAdded + '";\n'
			econtent += 'var dateModified = "' + dateModified + '";\n'
			econtent += 'var text = "' + (text ? text.replace(/"|'/g, "\\\"") : '') + '";\nreturn `' + template + '`;\n})()'
			Zotero.debug(`zotcard@econtent: ${econtent}`)
			let content
			try {
				content = Zotero.getMainWindow().eval(econtent)
			
				content = content.replace(/\{now\}/g, now)
					.replace(/\{today\}/g, today)
					.replace(/\{month\}/g, month)
					.replace(/\{dayOfYear\}/g, dayOfYear)
					.replace(/\{weekOfYear\}/g, weekOfYear)
					.replace(/\{week\}/g, week)
					.replace(/\{week_en\}/g, weekEn)
					.replace(/\\n/g, '\n')
					.replace(/\{text\}/g, text)
				
				for (const key in json) {
					if (Object.hasOwnProperty.call(json, key)) {
						const element = json[key]
						if (!['tags', 'creators', 'relations', 'collections', 'dateAdded', 'dateModified'].includes(key)) {
							content.replace(new RegExp('\{' + key + '\}', 'g'), element)
						}
					}
				}
				
				Zotero.debug(`zotcard@content: ${content}`)
				return content
			} catch (error) {
				Zotero.ZotCard.Utils.warning(error)
			}
		} catch (error) {
			Zotero.debug(error)
			Zotero.ZotCard.Utils.warning(error)
		}
	}
}