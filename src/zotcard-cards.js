if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Cards) Zotero.ZotCard.Cards = {};

Zotero.ZotCard.Cards = Object.assign(Zotero.ZotCard.Cards, {

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

	_initPref: function (prefName, beforeDefs, defTemplate, defLabel) {
		var card;
		var isDef = false;
		var val = Zotero.ZotCard.Prefs.get(prefName);
		if (val) {
			if (beforeDefs.indexOf(val) > -1) {
				isDef = true;
			} else {
				card = val;
			}
		} else {
			isDef = true;
		}
		if (isDef) {
			card = defTemplate;
		}

		card = card.replaceAll('\\n', '\n');

		var label = Zotero.ZotCard.Prefs.get(`${prefName}.label`, defLabel);
		var visible = Zotero.ZotCard.Prefs.get(`${prefName}.visible`, true);
		return { card: card, label: label, visible: visible };
	},

	initPrefs: function (prefName) {
		var pref;
		var beforeDefs = [];
		var defTemplate = '';
		var defLabel = '';
		if (prefName) {
			if (Zotero.ZotCard.Consts.defCardTypes.includes(prefName)) {
				beforeDefs = Zotero.ZotCard.Cards[prefName].history;
				defTemplate = Zotero.ZotCard.Cards[prefName].default;
				defLabel = Zotero.ZotCard.L10ns.getString(`zotcard-${prefName}card`);
			} else {
				defLabel = prefName;
			}
			pref = this._initPref(prefName, beforeDefs, defTemplate, defLabel);
		} else {
			let json = {};

			Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
				pref = this.initPrefs(type);
				json[type] = pref;
			});

			let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
			json.card_quantity = quantity;
			for (let index = 0; index < quantity; index++) {
				pref = this.initPrefs(this.customCardType(index))
				json[this.customCardType(index)] = pref;
			}
			return json;
		}

		return pref
	},

	newCard: function (window, collection, item, type, text) {
		var pref = this.initPrefs(type);
		if (!pref || !pref.card) {
			Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard-pleaseconfigure', { name: type }));
			return;
		}
		return this.newCardWithTemplate(window, collection, item, pref.card, text);
	},

	newCardWithTemplate: function (window, collection, item, template, text) {
		try {
			var itemType;
			let year;
			var nowDate = new Date();
			var now = Zotero.ZotCard.DateTimes.formatDate(nowDate, Zotero.ZotCard.DateTimes.yyyyMMddHHmmss);
			var today = Zotero.ZotCard.DateTimes.formatDate(nowDate, Zotero.ZotCard.DateTimes.yyyyMMdd);
			var month = Zotero.ZotCard.DateTimes.formatDate(nowDate, Zotero.ZotCard.DateTimes.yyyyMM);
			let dayOfYear = Zotero.ZotCard.DateTimes.dayOfYear(nowDate);
			// 0: 周日开始
			// 1: 周一开始
			let startOfWeek = Zotero.ZotCard.Prefs.get('startOfWeek', Zotero.ZotCard.Consts.startOfWeek.sunday);
			let weekOfYear = Zotero.ZotCard.Moments.weekOfYear(nowDate, startOfWeek);
			let w = Zotero.ZotCard.DateTimes.week(nowDate);
			let week = w.cn;
			let weekEn = w.en;
			itemType = item ? item.itemType : undefined;
			year = item ? item.getField('year') : undefined;

			var itemLink = item ? Zotero.ZotCard.Items.getZoteroUrl(item.key) : '';
			var id = item ? item.getID() : undefined;
			var collectionLink = collection ? Zotero.ZotCard.Collections.getZoteroUrl(collection.key) : '';
			var json = item ? item.toJSON() : {};
			var itemFields = Zotero.ItemFields.getAll().map(e => e.name);
			var creatorTypes = Zotero.CreatorTypes.getTypes().map(e => e.name);
			const spliceItemFields = (field) => {
				var index = itemFields.indexOf(field);
				while (index > -1) {
					itemFields.splice(index, 1);
					index = itemFields.indexOf(field);
				}
			}
			const spliceCreatorTypes = (type) => {
				var index = creatorTypes.indexOf(type);
				while (index > -1) {
					creatorTypes.splice(index, 1);
					index = creatorTypes.indexOf(type);
				}
			}

			var clipboardText = Zotero.ZotCard.Clipboards.getClipboard();
			var tags = [];
			var dateAdded = '';
			var dateModified = '';
			var accessDate = '';
			let econtent = '(() => {\n' +
				'var id = "' + id + '";\n' +
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
				'var collectionLink = "' + collectionLink + '";\n';
			for (const key in json) {
				if (Object.hasOwnProperty.call(json, key)) {
					const element = json[key];
					switch (key) {
						case 'tags':
							tags.push(...element.map(e => e.tag));
							spliceItemFields(key);
							break;
						case 'creators':
							var creators = {}
							if (element.length > 0) {
								element.forEach(ee => {
									var name = ee.name;
									if (!name) {
										var isCN1 = ee.lastName.match('[\u4e00-\u9fa5]+');
										var isCN2 = ee.firstName.match('[\u4e00-\u9fa5]+');
										name = ee.lastName + (isCN1 || isCN2 ? '' : ' ') + ee.firstName;
									}
									if (Object.hasOwnProperty.call(creators, ee.creatorType)) {
										creators[ee.creatorType].push(name);
									} else {
										creators[ee.creatorType] = [name];
									}
								})
								for (const key in creators) {
									if (Object.hasOwnProperty.call(creators, key)) {
										const e = creators[key];
										econtent += 'var ' + key + 's = ' + JSON.stringify(e) + ';\n';
										spliceCreatorTypes(key);
									}
								}
							}
							break;
						case 'relations':
						case 'collections':
							break;
						case 'accessDate':
							accessDate = Zotero.ZotCard.DateTimes.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss');
							spliceItemFields(key);
							break;
						case 'dateAdded':
							dateAdded = Zotero.ZotCard.DateTimes.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss');
							spliceItemFields(key);
							break;
						case 'dateModified':
							dateModified = Zotero.ZotCard.DateTimes.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss');
							spliceItemFields(key);
							break;
						default:
							switch (Object.prototype.toString.call(element)) {
								case '[object Number]':
								case '[object Boolean]':
									econtent += 'var ' + key + ' = ' + element + ';\n';
									spliceItemFields(key);
									break;
								case '[object String]':
									econtent += 'var ' + key + ' = "' + element.replace(/"|'/g, "\\\"").replace(/\n/g, "\\n") + '";\n';
									spliceItemFields(key);
									break;
								case '[object Object]':
								case '[object Array]':
									econtent += 'var ' + key + ' = ' + JSON.stringify(element) + ';\n';
									spliceItemFields(key);
									break;
								default:
									break;
							}
							break;
					}
				}
			}
			itemFields.forEach(element => {
				econtent += 'var ' + element + ' = "";\n';
			});
			creatorTypes.forEach(element => {
				econtent += 'var ' + element + 's = "";\n';
			});
			econtent += 'var tags = ' + JSON.stringify(tags) + ';\n';
			econtent += 'var accessDate = "' + accessDate + '";\n';
			econtent += 'var dateAdded = "' + dateAdded + '";\n';
			econtent += 'var dateModified = "' + dateModified + '";\n';
			econtent += 'var text = "' + (text ? text.replace(/"|'/g, "\\\"") : '') + '";\nreturn `' + template + '`;\n})()';
			let content;
			try {
				content = Zotero.getMainWindow().eval(econtent);

				content = content.replace(/\{now\}/g, now)
					.replace(/\{today\}/g, today)
					.replace(/\{month\}/g, month)
					.replace(/\{dayOfYear\}/g, dayOfYear)
					.replace(/\{weekOfYear\}/g, weekOfYear)
					.replace(/\{week\}/g, week)
					.replace(/\{week_en\}/g, weekEn)
					.replace(/\\n/g, '\n')
					.replace(/\{text\}/g, text);

				for (const key in json) {
					if (Object.hasOwnProperty.call(json, key)) {
						const element = json[key]
						if (!['tags', 'creators', 'relations', 'collections', 'dateAdded', 'dateModified'].includes(key)) {
							content.replace(new RegExp('\{' + key + '\}', 'g'), element);
						}
					}
				}

				return content;
			} catch (error) {
				Zotero.ZotCard.Logger.log(error);
				Zotero.ZotCard.Messages.warning(window, error || 'null');
			}
		} catch (error) {
			Zotero.ZotCard.Logger.log(error);
			Zotero.ZotCard.Messages.warning(window, error || 'null');
		}
	},

	customCardType(index) {
		return `card${index + 1}`;
	},

	resetCustomCard(index) {
		let val = Zotero.Prefs.get(`zotcard.card${index}.visible`)
		while (val) {
			Zotero.Prefs.clear(`zotcard.card${index}`)
			Zotero.Prefs.clear(`zotcard.card${index}.label`)
			Zotero.Prefs.clear(`zotcard.card${index}.visible`)

			index++
			val = Zotero.Prefs.get(`zotcard.card${index}.visible`)
		}
	},

	// ${name}：...
	parseCardItemValue(noteHtml, names, ends) {
		// <p>...${name}：...</p> <h1>...${name}:...</h1> <h2>...${name}...</h2> ...
		let reg = new RegExp(`\<((?:p|h1|h2|h3|h4|h5|h6))\>.*?(?:${names.join('|')}).*?<\/\\1\>`, 'gi')
		let matchs = noteHtml.match(reg);
		let content = '';
		if (matchs) {
			matchs.forEach(element => {
				// 去掉name和：;
				reg = new RegExp(`^(?:${names.join('|')})[:|：](.*)`);
				// matchs = element.trim().replace(/<\/?.*?>/g, '').match(reg);
				matchs = Zotero.Utilities.unescapeHTML(element.trim()).match(reg);
				if (matchs) {
					content = matchs[1].replace(/ +/g, ' ').trim();
					if (Zotero.ZotCard.Objects.isNoEmptyArray(ends)) {
						content = content.replace(new RegExp(`(:?${ends.join('|')}).*`), '').trim();
					}
				}
			});
		}
		return content;
	},

	// ${name}：[1] [3] [4]
	// ${name}：#1# #3# #4#
	// ${name}：1, 2, 3
	// Zotero.ZotCard.Cards.parseCardItemValues('<p><strong>标签</strong>：<span style="background-color: #FF0000">21, 211, 3243242 3432，323</span></p><p><strong>标签</strong>：<span style="background-color: #FF0000">#1# #3# #4#</span></p><p><strong>标签</strong>：<span style="background-color: #FF0000">[1 ]] [a a13] [4]</span></p><p><strong>日期</strong>：${today}</p><p><strong>标签</strong>：<span style="background-color: #FF0000">[无]</span></p><p><strong>日期</strong>：${today}</ p>', '标签');
	parseCardItemValues(noteHtml, names, ends) {
		let content = this.parseCardItemValue(noteHtml, names, ends)
		let reg, matchs;
		let vals = [];
		if (content) {
			if (/\[|\]/.test(content)) {
				// [1] [3] [4]
				reg = new RegExp('\\[.*?\\]', 'g')
				matchs = content.match(reg);
				if (matchs) {
					matchs.forEach(element => {
						let v = element.replace(/\[|\]/g, '').trim();
						if (v.length > 0 && !vals.includes(v)) {
							vals.push(v);
						}
					});
				}
			} else if (/#/.test(content)) {
				// #1# #3# #4#
				reg = new RegExp('#.*?#', 'g');
				matchs = content.match(reg);
				if (matchs) {
					matchs.forEach(element => {
						let v = element.replace(/#/g, '').trim();
						if (v.length > 0 && !vals.includes(v)) {
							vals.push(v);
						}
					});
				}
			} else if (/,|，/.test(content)) {
				// 1, 2, 3
				matchs = content.split(/,|，/);
				if (matchs) {
					matchs.forEach(element => {
						let v = element.trim();
						if (v.length > 0 && !vals.includes(v)) {
							vals.push(v);
						}
					});
				}
			} else {
				vals.push(content);
			}
		}
		return vals;
	},

	// 日期：2021-01-01或2021/01/01或2021.01.01或2021年01月01日或20210101
	// Date：2021-01-01或2021/01/01或2021.01.01或2021年01月01日或20210101
	parseCardDate(noteHtml) {
		let content = this.parseCardItemValue(noteHtml, ['日期', 'date'], ['标签', 'tag', 'tags']);
		if (content) {
			let dateString;
			let match = content.match(/\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1}/g);
			if (!match) {
				match = content.match(/\d{8}/g);
				if (match) {
					dateString = `${match[0].substring(0, 4)}-${match[0].substring(4, 6)}-${match[0].substring(6, 8)}`;
				}
			} else {
				match = match[0].match(/\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1}/g);
				dateString = match[0].replace(/\u5e74|\u6708|\./g, '-').replace(/\u65e5/g, '');
			}

			if (dateString) {
				let date = new Date(dateString);
				let ret = Zotero.ZotCard.DateTimes.formatDate(date, 'yyyy-MM-dd');
				return ret;
			}
		}
	},

	// xx卡
	// card
	parseCardType(noteHtml) {
		let match = noteHtml.match(/[\u4e00-\u9fa5]+卡/gi);
		if (!match) {
			match = noteHtml.match(/[a-zA-Z0-9 ]+card/gi);
		}
		return match ? match[0].trim() : '';
	},

	parseParentIDs (dataIn) {
		var parentIDs = [];
		dataIn.forEach(element => {
			switch (element.type) {
				case Zotero.ZotCard.Consts.cardManagerType.library:
				// library
				let library = Zotero.Libraries.get(element.id);
				if (Zotero.ZotCard.Objects.isNullOrUndefined(library)) {
					ZotElementPlus.Console.log('The libraryID ' + element.id + ' is incorrect.');
				}
				parentIDs.push(['library-' + library.libraryID]);
				break;
				case Zotero.ZotCard.Consts.cardManagerType.collection:
				// collection
				let collection = Zotero.Collections.get(element.id);
				if (Zotero.ZotCard.Objects.isNullOrUndefined(collection)) {
					ZotElementPlus.Console.log('The collectionID ' + element.id + ' is incorrect.');
				}
				parentIDs.push(Zotero.ZotCard.Collections.links(element.id).map(e => {
					return e.type + '-' + e.dataObject.id
				}));
				break;
				case Zotero.ZotCard.Consts.cardManagerType.search:
				// search
				let search = Zotero.Searches.get(element.id);
				if (Zotero.ZotCard.Objects.isNullOrUndefined(search)) {
					ZotElementPlus.Console.log('The searchID ' + element.id + ' is incorrect.');
				}
				parentIDs.push(Zotero.ZotCard.Searches.links(element.id).map(e => {
					return e.type + '-' + e.dataObject.id
				}));
				break;
				case Zotero.ZotCard.Consts.cardManagerType.item:
				// item
				let item = Zotero.Items.get(element.id);
				if (Zotero.ZotCard.Objects.isEmptyNumber(item)) {
					ZotElementPlus.Console.log('The itemID ' + element.id + ' is incorrect.');
				}
				let pIDs1 = [];
				if (element.collectionID) {
					pIDs1.push(...Zotero.ZotCard.Collections.links(element.collectionID).map(e => {
					return e.type + '-' + e.dataObject.id
					}));
					pIDs1.push('item-' + element.id);
				} else {
					pIDs1.push(...Zotero.ZotCard.Items.links(element.id).map(e => {
					return e.type + '-' + e.dataObject.id
					}));
				}
				parentIDs.push(pIDs1);

				break;
				case Zotero.ZotCard.Consts.cardManagerType.note:
				// note
				let note = Zotero.Items.get(element.id);
				if (Zotero.ZotCard.Objects.isEmptyNumber(note)) {
					ZotElementPlus.Console.log('The noteID ' + element.id + ' is incorrect.');
				}

				let pIDs2 = [];
				if (element.collectionID) {
					pIDs2.push(...Zotero.ZotCard.Collections.links(element.collectionID).map(e => {
					return e.type + '-' + e.dataObject.id
					}));
					pIDs2.push('note-' + element.id);
				} else {
					pIDs2.push(...Zotero.ZotCard.Notes.links(element.id).map(e => {
					return e.type + '-' + e.dataObject.id
					}));
				}
				parentIDs.push(pIDs2);
				break;
			}
		});
		return parentIDs;
	},

	async load(window, createCard, allCards, parentIDs, profiles, loadMore, process, complete) {
		allCards.splice(0);
		for (let index = 0; index < parentIDs.length; index++) {
			const element = parentIDs[index];
			let splits = element[element.length - 1].split('-');
			let type = splits[0], id = parseInt(splits[1]);
			Zotero.ZotCard.Logger.log('type: ' + type + ', id: ' + id);
			let searchResultIDs;
			let excludeCollectionKeys;

			switch (type) {
				case Zotero.ZotCard.Consts.cardManagerType.library:
					// library
					let library = Zotero.Libraries.get(id);
					if (!library) {
						Zotero.ZotCard.Messages.warning(window, `The libraryID ${id} is incorrect.`);
						return;
					}
					excludeCollectionKeys = this._excludeCollectionKeys(library.id, profiles);
					searchResultIDs = await Zotero.ZotCard.Notes.search(id, undefined, undefined, excludeCollectionKeys);
					this._loadSearchResultIDs(createCard, allCards, searchResultIDs, profiles);
					Zotero.ZotCard.Logger.log('library: ' + library.name + ', searchResultIDs: ' + searchResultIDs.length + ', allCards: ' + allCards.length);
					break;
				case Zotero.ZotCard.Consts.cardManagerType.collection:
					// collection
					let collection = Zotero.Collections.get(id);
					if (!collection) {
						Zotero.ZotCard.Messages.warning(window, `The collectionID ${id} is incorrect.`);
						return;
					}
					excludeCollectionKeys = this._excludeCollectionKeys(collection.libraryID, profiles);
					searchResultIDs = await Zotero.ZotCard.Notes.search(collection.libraryID, collection.key, undefined, excludeCollectionKeys);
					this._loadSearchResultIDs(createCard, allCards, searchResultIDs, profiles);
					Zotero.ZotCard.Logger.log('collection: ' + collection.name + ', searchResultIDs: ' + searchResultIDs.length + ', allCards: ' + allCards.length);
					break;
				case Zotero.ZotCard.Consts.cardManagerType.search:
					// search
					let search = Zotero.Searches.get(id);
					if (!search) {
						Zotero.ZotCard.Messages.warning(window, `The searchID ${id} is incorrect.`);
						return;
					}
					excludeCollectionKeys = this._excludeCollectionKeys(search.libraryID, profiles);
					searchResultIDs = await Zotero.ZotCard.Notes.search(search.libraryID, undefined, search.key, excludeCollectionKeys);
					this._loadSearchResultIDs(createCard, allCards, searchResultIDs, profiles);
					Zotero.ZotCard.Logger.log('search: ' + search.name + ', searchResultIDs: ' + searchResultIDs.length + ', allCards: ' + allCards.length);
					break;
				case Zotero.ZotCard.Consts.cardManagerType.item:
					// item
					let item = Zotero.Items.get(id);
					if (!item) {
						Zotero.ZotCard.Messages.warning(window, `The itemID ${id} is incorrect.`);
						return;
					}
					let notes = item.getNotes();
					this._loadSearchResultIDs(createCard, allCards, notes, profiles);
					Zotero.ZotCard.Logger.log('item: ' + item.getDisplayTitle() + ', notes: ' + notes.length + ', allCards: ' + allCards.length);
					break;
				case Zotero.ZotCard.Consts.cardManagerType.note:
					// note
					let note = Zotero.Items.get(id);
					if (!note) {
						Zotero.ZotCard.Messages.warning(window, `The noteID ${id} is incorrect.`);
						return;
					}
					this._loadSearchResultIDs(createCard, allCards, [note.id], profiles);
					Zotero.ZotCard.Logger.log('note: ' + note.getDisplayTitle() + ', allCards: ' + allCards.length);
					break;
			}
		};

		if (loadMore) {
			setTimeout(async () => {
				for (let index = 0; index < allCards.length; index++) {
				  const card = allCards[index];
				  this.loadCardMore(card, card.id, profiles);
	
				  process && process(card);
				}
				complete && complete(allCards);
			}, 50);
		}

		Zotero.ZotCard.Logger.log('loaded: ' + allCards.length);
	},

	filter(allCards, cards, filters) {
		cards.splice(0);
		cards.push(...allCards.filter(card => {
			this.loadCardNote(card, card.id);

			switch (filters.mode) {
				case Zotero.ZotCard.Consts.modeProps.all:
					//所有
					break;
				case Zotero.ZotCard.Consts.modeProps.only_show:
					// 仅显示
					if (!card.isShow) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} is not show, be filtered.`);
						return false;
					}
					break;
				case Zotero.ZotCard.Consts.modeProps.only_hide:
					// 仅隐藏
					if (card.isShow) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} is not hide, be filtered.`);
						return false;
					}
					break;
				case Zotero.ZotCard.Consts.modeProps.only_expand:
					// 仅展开
					if (!card.isExpand) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} is not expand, be filtered.`);
						return false;
					}
					break;
				case Zotero.ZotCard.Consts.modeProps.only_collapse:
					// 仅收起
					if (card.isExpand) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} is not collapse, be filtered.`);
						return false;
					}
					break;
				case Zotero.ZotCard.Consts.modeProps.only_selected:
					// 仅选择
					if (!card.isSelected) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} is not selected, be filtered.`);
						return false;
					}
					break;
			}

			if (filters.match === Zotero.ZotCard.Consts.matchProps.all) {
				if (filters.dates && filters.dates.length === 2) {
					let start = filters.dates[0];
					let end = filters.dates[1];
					if (card.more.date < start || card.more.date > end) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} date ${card.more.date} is no between ${start} - ${end}, be filtered.`);
						return false;
					}
				}

				if (filters.cardtypes && filters.cardtypes.length > 0) {
					if (!filters.cardtypes.includes(card.more.cardtype)) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} cardtype ${card.more.cardtype} is no in ${filters.cardtypes.join(', ')}, be filtered.`);
						return false;
					} 
				}

				if (filters.tags && filters.tags.length > 0) {
					var found = false;
					for (let index = 0; index < filters.tags.length; index++) {
						if ((filters.tags[index] === '0-' && card.more.tags.length === 0) || card.more.tags.find((t) => (t.type + '-' + t.tag) === filters.tags[index])) {
							found = true;
							break;
						}
					}

					if (!found) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} tags ${JSON.stringify(card.more.tags)} is no in ${JSON.stringify(filters.tags)}, be filtered.`);
						return false;
					}
				}

				if (filters.title) {
					if (!card.note.title.includes(filters.title)) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} title is no include ${filters.title}, be filtered.`);
						return false;
					}
				}

				if (filters.content) {
					if (!card.note.text.includes(filters.content)) {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} content is no include ${filters.title}, be filtered.`);
						return false;
					}
				}

				return true;
			} else if (filters.match === Zotero.ZotCard.Consts.matchProps.any) {
				if (filters.dates && filters.dates.length === 2) {
					let start = filters.dates[0];
					let end = filters.dates[1];
					if (card.more.date >= start && card.more.date <= end) {
						return true;
					} else {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} date ${card.more.date} is no between ${start} - ${end}, be filtered.`);
					}
				}

				if (filters.cardtypes && filters.cardtypes.length > 0) {
					if (filters.cardtypes.includes(card.more.cardtype)) {
						return true;
					} else {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} cardtype ${card.more.cardtype} is no in ${filters.cardtypes.join(', ')}, be filtered.`);
					}
				}

				if (filters.tags && filters.tags.length > 0) {
					var found = false;
					for (let index = 0; index < filters.tags.length; index++) {
						if ((filters.tags[index] === '0-' && card.more.tags.length === 0) || card.more.tags.find((t) => (t.type + '-' + t.tag) === filters.tags[index])) {
							found = true;
							break;
						}
					}

					if (found) {
						return true;
					} else {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} cardtype ${card.more.tags.join(', ')} is no in ${filters.tags.join(', ')}, be filtered.`);
					}
				}

				if (filters.title) {
					if (card.note.title.includes(filters.title)) {
						return true;
					} else {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} title is no include ${filters.title}, be filtered.`);
					}
				}

				if (filters.content) {
					if (card.note.text.includes(filters.content)) {
						return true;
					} else {
						Zotero.ZotCard.Logger.log(`The note ${card.note.title} content is no include ${filters.title}, be filtered.`);
					}
				}

				return false;
			} else {
				Zotero.ZotCard.Logger.log(`The match ${filters.match} is incorrect.`);
			}
		}));

		this.sort(cards, filters);
	},

	sort(cards, filters) {
		// 'date', 'dateAdded', 'dateModified', 'title' ,'words', 'lines', 'sizes'
		cards.sort((card1, card2) => {
			switch (filters.orderby) {
				case 'date':
					return this.compare(card1.more.date, card2.more.date, filters.desc);
				case 'dateAdded':
					return this.compare(card1.note.dateAdded, card2.note.dateAdded, filters.desc);
				case 'dateModified':
					return this.compare(card1.note.dateModified, card2.note.dateModified, filters.desc);
				case 'title':
					return this.compare(card1.note.title, card2.note.title, filters.desc);
				case 'words':
					return this.compare(card1.more.statistics.words, card2.more.statistics.words, filters.desc);
				case 'lines':
					return this.compare(card1.more.statistics.lines, card2.more.statistics.lines, filters.desc);
				case 'sizes':
					return this.compare(card1.more.statistics.sizes, card2.more.statistics.sizes, filters.desc);
			}
		});

		Zotero.ZotCard.Logger.log('filtered: ' + cards.length);
	},

	_loadSearchResultIDs(createCard, allCards, searchResultIDs, profiles) {
		searchResultIDs.forEach(id => {
			const item = Zotero.Items.get(id);
			Zotero.ZotCard.Logger.log(item);
			
			let title = item.getDisplayTitle();
			if (!item) {
				Zotero.ZotCard.Logger.log(`The itemID ${id} is incorrect.`);
			} else if(item.deleted) {
				Zotero.ZotCard.Logger.log(`The itemID ${id} is deleted.`);
			} else if (item.isNote()) {
				if (allCards.find((c) => c.id === id)) {
					Zotero.ZotCard.Logger.log(`The note ${title} is loaded, skip.`);
					return;
				}

				let excludeTitle = profiles.excludeTitle?.trim().replaceAll('\n\r', '\n');
				if (excludeTitle) {
					Zotero.ZotCard.Logger.log('excludeTitle: ' + excludeTitle);
					let reg = new RegExp(`(?:${excludeTitle.split('\n').map(e => {
						let ret = e.replaceAll('*', '.*');
						ret = ret.replaceAll('?', '.?');
						ret = ret.replaceAll('+', '.+');
						ret = ret.replaceAll('.', '\.');
						ret = ret.replaceAll('\\', '\\\\');
						ret = ret.replaceAll('[', '\\[');
						ret = ret.replaceAll(']', '\\]');
						ret = ret.replaceAll('(', '\\(');
						ret = ret.replaceAll(')', '\\)');
						ret = ret.replaceAll('^', '\\^');
						ret = ret.replaceAll('$', '\\$');
						ret = ret.replaceAll('{', '\\{');
						ret = ret.replaceAll('}', '\\}');
						ret = ret.replaceAll('|', '\\|');
						return '^' + ret + '$'
					}).join('|')})`);
					if (reg.exec(title)) {
						Zotero.ZotCard.Logger.log(`The note ${title} conform reg ${reg}, it is exclude, skip.`);
						return;
					}
				}

				if (item.parentItem) {
					let excludeItemKeys = this._excludeItemKeys(item.libraryID, profiles);
					if (Zotero.ZotCard.Objects.isNoEmptyArray(excludeItemKeys)) {
						if (excludeItemKeys.includes(item.parentItem.key)) {
							Zotero.ZotCard.Logger.log(`The item ${title} is exclude(${excludeItemKeys.join(',')}), skip.`);
							return;
						}
					}
				}

				let card = {};
				if (createCard) {
					card = createCard() || {};
				}

				Object.assign(card, {
					id: id,
					note: Object.assign({}, card.note),
					more: Object.assign({}, card.more),
					noteLoaded: false,
					moreLoaded: false
				});
				this.loadCardNote(card, item);
				allCards.push(card);
			} else {
				Zotero.ZotCard.Logger.log(`The item ${item.getDisplayTitle()} is not a note, actual ${item.itemType}.`);
			}
		});
	},

	_excludeItemKeys(libraryID, profiles) {
		let excludeItemKeys;
		if (Zotero.ZotCard.Objects.isNoEmptyArray(profiles.excludeCollectionOrItemKeys)) {
			excludeItemKeys = profiles.excludeCollectionOrItemKeys.filter(e => e[e.length - 1].startsWith('item-' + libraryID + '-'));
			if (Zotero.ZotCard.Objects.isNoEmptyArray(excludeItemKeys)) {
				Zotero.ZotCard.Logger.log('excludeItemKeys: ' + excludeItemKeys.join(','));
				excludeItemKeys = excludeItemKeys.map(e => {
					return e[e.length - 1].replaceAll('item-' + libraryID + '-', '');
				});
			}
		} else {
			Zotero.ZotCard.Logger.log('profiles.excludeCollectionOrItemKeys is empty.');
		}
		return excludeItemKeys;
	},

	_excludeCollectionKeys(libraryID, profiles) {
		let excludeCollectionKeys;
		if (Zotero.ZotCard.Objects.isNoEmptyArray(profiles.excludeCollectionOrItemKeys)) {
			excludeCollectionKeys = profiles.excludeCollectionOrItemKeys.filter(e => e[e.length - 1].startsWith('collection-' + libraryID + '-'));
			if (Zotero.ZotCard.Objects.isNoEmptyArray(excludeCollectionKeys)) {
				Zotero.ZotCard.Logger.log('excludeCollectionKeys: ' + excludeCollectionKeys.join(','));
				excludeCollectionKeys = excludeCollectionKeys.map(e => {
					return e[e.length - 1].replaceAll('collection-' + libraryID + '-', '');
				});
			}
		} else {
			Zotero.ZotCard.Logger.log('profiles.excludeCollectionOrItemKeys is empty.');
		}
		return excludeCollectionKeys;
	},

	async loadCardNote(card, item) {
		if (card.noteLoaded) {
			return;
		}

		if (!card.note) card.note = {};

		item = Zotero.ZotCard.Objects.isNumber(item) ? Zotero.Items.get(item) : item;
		let html = item.getNote();
		card.note.title = item.getNoteTitle();
		card.note.titleHtml = Zotero.ZotCard.Notes.grabNoteTitleHtml(html);
		card.note.contentHtml = Zotero.ZotCard.Notes.grabNoteContentHtml(html);
		card.note.displayContentHtml = function () {
			return this.contentHtml.replace(/data-attachment-key="(.*?)"/g, 'data-attachment-key="$1" src="zotero://attachment/library/items/$1"');
		}.bind(card.note);
		card.note.html = html;
		card.note.text = Zotero.ZotCard.Notes.htmlToText(html);

		let dateAdded = item.getField('dateAdded');
		let dateModified = item.getField('dateModified');
		card.note.dateAdded = dateAdded ? Zotero.ZotCard.DateTimes.sqlToDate(dateAdded, Zotero.ZotCard.DateTimes.yyyyMMddHHmmss) : '';
		card.note.dateModified = dateModified ? Zotero.ZotCard.DateTimes.sqlToDate(dateModified, Zotero.ZotCard.DateTimes.yyyyMMddHHmmss) : '';
		card.noteLoaded = true;
	},

	loadCardMore(card, itemID, profiles) {
		if (card.moreLoaded) {
			return;
		}

		if (!card.more) card.more = {};

		const item = Zotero.Items.get(itemID);
		let html = item.getNote();
		let tags = item.getTags().map((e) => {
			return {
				type: 1,//系统
				tag: e.tag,
				color: Zotero.Tags.getColor(item.libraryID, e.tag)?.color
			}
		});

		if (profiles.parseTags) {
			Zotero.ZotCard.Cards.parseCardItemValues(html, ['标签', 'tag', 'tags'], ['日期', 'date']).forEach(e => {
				if (!tags.find(ee => ee.type === 2 && ee.tag === e)) {
					tags.push({
						type: 2,//自定义
						tag: e,
						color: Zotero.Tags.getColor(item.libraryID, e)?.color
					});
				}
			});
		}
		card.more.tags = tags;

		if (profiles.parseCardType) {
			card.more.cardtype = Zotero.ZotCard.Cards.parseCardType(card.note.title);
		}
		if (item.parentItem) {
			card.more.parentItem = {
				id: item.parentItem.id,
				key: item.parentItem.key,
				title: item.parentItem.getDisplayTitle(),
				itemType: item.parentItem.itemType
			};
		} else {
			card.more.parentItem = undefined;
		}
		card.more.collections = (item.getCollections() || []).map(c => {
			let collection = Zotero.Collections.get(c);
			return {
				id: c,
				key: collection.key,
				title: collection.name,
				treeViewImage: collection.treeViewImage
			}
		});
		let relations = [];
		if (Object.hasOwnProperty.call(item.getRelations(), 'dc:relation')) {
			item.getRelations()['dc:relation'].forEach(async r => {
				//"http://zotero.org/users/6727790/items/5Z9RV9PM"
				let _item = await Zotero.URI.getURIItem(r);
				if (_item) {
					let title = _item.itemType === 'note' ? _item.getNoteTitle() : _item.getDisplayTitle();
					relations.push({
						id: _item.id,
						key: _item.key,
						title: title,
						itemType: _item.itemType
					})
				}
			})
		}
		card.more.relations = relations;
		if (profiles.parseWords) {
			let { words, en_words, cn_words, num_words, length, lines, sizes } = Zotero.ZotCard.Notes.statistics(html);
			let { text, title, space } = Zotero.ZotCard.Notes.statisticsToText({ words, en_words, cn_words, num_words, length, lines, sizes });

			if (Zotero.ZotCard.Prefs.get('word_count_style', Zotero.ZotCard.Consts.wordCountStyle.all) === Zotero.ZotCard.Consts.wordCountStyle.onlyWords) {
				text = words.toString();
			}

			card.more.statistics = { words, en_words, cn_words, num_words, length, lines, sizes, text, title, space };
		}
		if (profiles.parseDate) {
			card.more.date = Zotero.ZotCard.Cards.parseCardDate(html);
		}
		if (!card.more.date) {
			card.more.date = Zotero.ZotCard.DateTimes.formatDate(new Date(card.note.dateAdded), 'yyyy-MM-dd');
		}
		card.moreLoaded = true;
	},

	compare(s1, s2, desc) {
		return s1 === s2 ? 0 : (!desc ? (s1 > s2 ? 1 : -1) : (s1 > s2 ? -1 : 1));
	}
});