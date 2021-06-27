// eslint-disable-next-line no-unused-vars
var EXPORTED_SYMBOLS = ['zotcard'];

let zotcard = {
  _bundle: Cc['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://zoterozotcard/locale/zotcard.properties')
}

let isDebug = function () {
  return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled
}

function debug(msg, err) {
  if (err) {
    Zotero.debug(`{Zotcard} ${new Date()} error: ${msg} (${err} ${err.stack})`)
  } else {
    Zotero.debug(`{Zotcard} ${new Date()}: ${msg}`)
  }
}

zotcard.init = function () {
  // Register the callback in Zotero as an item observer
  let notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item'])

  document.getElementById('zotero-itemmenu').addEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)

  this.initPrefs()

  // Unregister callback when the window closes (important to avoid a memory leak)
  window.addEventListener('unload', function (e) {
    Zotero.Notifier.unregisterObserver(notifierID)

    document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)
  }, false)
}

zotcard.refreshZoteroItemPopup = function () {
  var zitems1 = this.getSelectedItems('regular')
  var zitems2 = this.getSelectedItems(['note'])
  var isRegular = zitems1 && zitems1.length > 0
  var onlyOne = zitems1 && zitems1.length === 1
  var hasNotes = zitems2 && zitems2.length > 0

  document.getElementById('zotero-itemmenu-zotcard-card1').setAttribute('label', Zotero.Prefs.get('zotcard.card1.label'))
  document.getElementById('zotero-itemmenu-zotcard-card2').setAttribute('label', Zotero.Prefs.get('zotcard.card2.label'))
  document.getElementById('zotero-itemmenu-zotcard-card3').setAttribute('label', Zotero.Prefs.get('zotcard.card3.label'))
  document.getElementById('zotero-itemmenu-zotcard-card4').setAttribute('label', Zotero.Prefs.get('zotcard.card4.label'))
  document.getElementById('zotero-itemmenu-zotcard-card5').setAttribute('label', Zotero.Prefs.get('zotcard.card5.label'))
  document.getElementById('zotero-itemmenu-zotcard-card6').setAttribute('label', Zotero.Prefs.get('zotcard.card6.label'))

  document.getElementById('zotero-itemmenu-zotcard-quotes').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-concept').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-character').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-not_commonsense').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-skill').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-structure').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-general').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-card1').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-card2').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-card3').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-card4').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-card5').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-card6').hidden = (!isRegular || !onlyOne)
  
  document.getElementById('zotero-itemmenu-zotcard-separator1').hidden = (!isRegular || !onlyOne)
  document.getElementById('zotero-itemmenu-zotcard-separator2').hidden = (!isRegular || !onlyOne || !hasNotes)
  
  document.getElementById('zotero-itemmenu-zotcard-replace').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-copy').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-copyandcreate').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-open').hidden = (!hasNotes)
}

zotcard.initPref = function (item, beforeDefs, def) {
  var pref
  var isDef = false
  var val = Zotero.Prefs.get('zotcard.' + item)
  if (val) {
    if (beforeDefs.indexOf(val) > -1) {
      isDef = true
    } else {
      pref = val
    }
  } else {
    isDef = true
  }
  if (isDef) {
    pref = def
    Zotero.Prefs.set('zotcard.' + item, pref)
  }
  return pref
}

zotcard.initReservedPref = function (item) {
  var pref = Zotero.Prefs.get('zotcard.' + item)
  if (!pref) {
    Zotero.Prefs.set('zotcard.' + item, '')
  }
  if (!Zotero.Prefs.get('zotcard.' + item + '.label')) {
    Zotero.Prefs.set('zotcard.' + item + '.label', this.getString('zotcard.' + item))
  }
  return pref
}

zotcard.initPrefs = function (item) {
  var pref
  var beforeDefs
  var def
  switch (item) {
    case 'quotes':
      beforeDefs = ['<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 金句卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span style="color: #bbbbbb;">&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'concept':
      beforeDefs = ['<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 概念卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span style="color: #bbbbbb;">&lt;姓名&gt;</span>, <span style="color: #bbbbbb;">&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'character':
      beforeDefs = ['<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 人物卡 - <span style="color: #bbbbbb;">&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span style="color: #bbbbbb;">&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：</p><p>- <strong>成就</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'not_commonsense':
      beforeDefs = ['<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 反常识卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span style="color: #bbbbbb;">&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span style="color: #bbbbbb;">&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'skill':
      beforeDefs = ['<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 技巧卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'structure':
      beforeDefs = ['<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 结构卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'general':
      beforeDefs = ['<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
        '<h3>## 通用卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
      def = '<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
      pref = this.initPref(item, beforeDefs, def)
      break
    case 'card1':
    case 'card2':
    case 'card3':
    case 'card4':
    case 'card5':
    case 'card6':
      pref = this.initReservedPref(item)
      break
    default:
      this.initPrefs('quotes')
      this.initPrefs('concept')
      this.initPrefs('character')
      this.initPrefs('not_commonsense')
      this.initPrefs('skill')
      this.initPrefs('structure')
      this.initPrefs('general')
      this.initPrefs('card1')
      this.initPrefs('card2')
      this.initPrefs('card3')
      this.initPrefs('card4')
      this.initPrefs('card5')
      this.initPrefs('card6')
      break
  }

  return pref
}

// so citation counts will be queried for >all< items that are added to zotero!? o.O
zotcard.notifierCallback = {
  notify: function (event, type, ids, extraData) {
    // 新增
    if (isDebug()) Zotero.debug('event: ' + JSON.stringify(event))
    if (isDebug()) Zotero.debug('type: ' + JSON.stringify(type))
    if (isDebug()) Zotero.debug('ids: ' + JSON.stringify(ids))
    if (isDebug()) Zotero.debug('extraData: ' + JSON.stringify(extraData))
    if (event === 'add') {
    } else if (event === 'edit') {
    }
  }
}

zotcard.newCard = async function (name) {
  var zitems = this.getSelectedItems('regular')
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.unsupported_entries'))
    return
  }
  if (zitems.length !== 1) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_one'))
    return
  }

  var zitem = zitems[0]
  var creatorsData = zitem.getCreators()
  var authors = []
  var creatorTypeAuthor = Zotero.CreatorTypes.getID('author')
  for (let i = 0; i < creatorsData.length; i++) {
    let creatorTypeID = creatorsData[i].creatorTypeID
    let creatorData = creatorsData[i]
    if (creatorTypeID === creatorTypeAuthor) {
      authors.push(creatorData.lastName || creatorData.firstName)
      if (isDebug()) Zotero.debug('creatorData: ' + JSON.stringify(creatorData))
    }
  }
  var date = new Date()
  var item = new Zotero.Item('note')
  var pref = this.initPrefs(name)
  if (!pref) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.please_configure', 'zotcard.' + name))
    return
  }
  item.setNote(pref.replace(/\{authors\}/g, authors.toString())
    .replace(/\{title\}/g, zitem.getField('title'))
    .replace(/\{today\}/g, this.formatDate(date, 'yyyy-MM-dd'))
    .replace(/\{now\}/g, this.formatDate(date, 'yyyy-MM-dd HH:mm:ss'))
    .replace(/\{shortTitle\}/g, zitem.getField('shortTitle'))
    .replace(/\{archiveLocation\}/g, zitem.getField('archiveLocation'))
    .replace(/\{url\}/g, zitem.getField('url'))
    .replace(/\{date\}/g, zitem.getField('date'))
    .replace(/\{year\}/g, zitem.getField('year'))
    .replace(/\{extra\}/g, zitem.getField('extra'))
    .replace(/\{publisher\}/g, zitem.getField('publisher'))
    .replace(/\{ISBN\}/g, zitem.getField('ISBN'))
    .replace(/\{numPages\}/g, zitem.getField('numPages'))
    .replace(/\\n/g, '\n'))
  item.parentKey = zitem.getField('key')
  item.libraryID = window.ZoteroPane.getSelectedLibraryID()
  var itemID = await item.saveTx()
  if (isDebug()) Zotero.debug('item.id: ' + itemID)
  ZoteroPane.selectItem(itemID)
}

zotcard.quotes = function () {
  this.newCard('quotes')
}

zotcard.concept = function () {
  this.newCard('concept')
}

zotcard.character = function () {
  this.newCard('character')
}

zotcard.not_commonsense = function () {
  this.newCard('not_commonsense')
}

zotcard.skill = function () {
  this.newCard('skill')
}

zotcard.structure = function () {
  this.newCard('structure')
}

zotcard.general = function () {
  this.newCard('general')
}

zotcard.card1 = function () {
  this.newCard('card1')
}

zotcard.card2 = function () {
  this.newCard('card2')
}

zotcard.card3 = function () {
  this.newCard('card3')
}

zotcard.card4 = function () {
  this.newCard('card4')
}

zotcard.card5 = function () {
  this.newCard('card5')
}

zotcard.card6 = function () {
  this.newCard('card6')
}

zotcard.replace = function () {
  window.openDialog(
      'chrome://zoterozotcard/content/replace.xul',
      'zutilo-startup-upgradewindow', 'chrome, centerscreen',
      {upgradeMessage: ''});
}

zotcard.doReplace = function (target) {
  var zitems = this.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_note'))
    return
  }

  console.info(document.getElementById('zoterozotcard-replacedialog'));
  var edit_text = document.getElementById('edit_text');
  if (edit_text) {
    var text = edit_text.value;
    var replaceto = document.getElementById('edit_replaceto').value;
    zitems.forEach(zitem => {
      zitem.setNode(zitem.getNote().replaceAll(text, replaceto));
      var itemID = zitem.saveTx();
      if (isDebug()) Zotero.debug('item.id: ' + itemID);
    })
  }
}

zotcard.copy = function () {
  var zitems = this.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_note'))
    return
  }

  var notes = ''
  zitems.forEach(zitem => {
    notes += zitem.getNote() + '<br /><br />'
  })
  if (!this.copyHtmlToClipboard(notes)) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.failure'))
  } else {
    if (isDebug()) Zotero.debug('copyHtmlToClipboard: false')
  }
}

zotcard.copyandcreate = function () {
  var zitems = this.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_note'))
    return
  }
  if (zitems.length !== 1) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_one'))
    return
  }

  var zitem = zitems[0]
  var item = new Zotero.Item('note')
  item.setNote(zitem.getNote())
  if (isDebug()) Zotero.debug('zitem.parentKey: ' + zitem.parentKey)
  item.parentKey = zitem.parentKey
  item.libraryID = window.ZoteroPane.getSelectedLibraryID()
  item.setCollections(zitem.getCollections())
  if (isDebug()) Zotero.debug('item.parentKey: ' + item.parentKey)
  item.saveTx()
}

zotcard.open = function () {
  var zitems = this.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_note'))
    return
  }

  zitems.forEach(zitem => {
    ZoteroPane.openNoteWindow(zitem.id)
  })
}

zotcard.copyHtmlToClipboard = function (textHtml) {
  var htmlstring = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString)
  if (!htmlstring) {
  if (isDebug()) Zotero.debug('htmlstring is null.')
    return false
  }
  htmlstring.data = textHtml

  var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable)
  if (!trans) {
    if (isDebug()) Zotero.debug('trans is null.')
    return false
  }

  trans.addDataFlavor('text/html')
  trans.setTransferData('text/html', htmlstring, textHtml.length * 2)

  var clipboard = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard)
  if (!clipboard) {
    if (isDebug()) Zotero.debug('clipboard is null.')
    return false
  }

  clipboard.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard)
  return true
}

zotcard.copyStringToClipboard = function (clipboardText) {
  const gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper)
  gClipboardHelper.copyString(clipboardText, document)
}

zotcard.getString = function (name, ...params) {
  if (params !== undefined) {
    return this._bundle.formatStringFromName(name, params, params.length)
  } else {
    return this._bundle.GetStringFromName(name)
  }
}

zotcard.getSelectedItems = function (itemType) {
  var zitems = window.ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    if (isDebug()) Zotero.debug('zitems.length: ' + zitems.length)
    return false
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType]
    }
    var siftedItems = this.siftItems(zitems, itemType)
    if (isDebug()) Zotero.debug('siftedItems.matched: ' + JSON.stringify(siftedItems.matched))
    return siftedItems.matched
  } else {
    return zitems
  }
}

zotcard.siftItems = function (itemArray, itemTypeArray) {
  var matchedItems = []
  var unmatchedItems = []
  while (itemArray.length > 0) {
    if (this.checkItemType(itemArray[0], itemTypeArray)) {
      matchedItems.push(itemArray.shift())
    } else {
      unmatchedItems.push(itemArray.shift())
    }
  }

  return {
    matched: matchedItems,
    unmatched: unmatchedItems
  }
}

zotcard.checkItemType = function (itemObj, itemTypeArray) {
  var matchBool = false

  for (var idx = 0; idx < itemTypeArray.length; idx++) {
    switch (itemTypeArray[idx]) {
      case 'attachment':
        matchBool = itemObj.isAttachment()
        break
      case 'note':
        matchBool = itemObj.isNote()
        break
      case 'regular':
        matchBool = itemObj.isRegularItem()
        break
      default:
        matchBool = Zotero.ItemTypes.getName(itemObj.itemTypeID) === itemTypeArray[idx]
    }

    if (matchBool) {
      break
    }
  }

  return matchBool
}

zotcard.formatDate = function (date, format) {
  var o = {
    'M+' : date.getMonth() + 1,
    'd+' : date.getDate(),
    'h+' : date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+' : date.getHours(),
    'm+' : date.getMinutes(),
    's+' : date.getSeconds(),
    'q+' : Math.floor((date.getMonth() + 3) / 3),
    'S' : date.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', function (e) { zotcard.init() }, false)

  // API export for Zotero UI
  // Can't imagine those to not exist tbh
  if (!window.Zotero) window.Zotero = {}
  if (!window.Zotero.ZotCard) window.Zotero.ZotCard = {}
  // note sure about any of this
  window.Zotero.ZotCard.quotes = function () { zotcard.quotes() }
  window.Zotero.ZotCard.concept = function () { zotcard.concept() }
  window.Zotero.ZotCard.character = function () { zotcard.character() }
  window.Zotero.ZotCard.not_commonsense = function () { zotcard.not_commonsense() }
  window.Zotero.ZotCard.skill = function () { zotcard.skill() }
  window.Zotero.ZotCard.structure = function () { zotcard.structure() }
  window.Zotero.ZotCard.general = function () { zotcard.general() }
  window.Zotero.ZotCard.card1 = function () { zotcard.card1() }
  window.Zotero.ZotCard.card2 = function () { zotcard.card2() }
  window.Zotero.ZotCard.card3 = function () { zotcard.card3() }
  window.Zotero.ZotCard.card4 = function () { zotcard.card4() }
  window.Zotero.ZotCard.card5 = function () { zotcard.card5() }
  window.Zotero.ZotCard.card6 = function () { zotcard.card6() }
  window.Zotero.ZotCard.replace = function () { zotcard.replace() }
  window.Zotero.ZotCard.doReplace = function () { zotcard.doReplace() }
  window.Zotero.ZotCard.copy = function () { zotcard.copy() }
  window.Zotero.ZotCard.copyandcreate = function () { zotcard.copyandcreate() }
  window.Zotero.ZotCard.open = function () { zotcard.open() }
}

if (typeof module !== 'undefined') module.exports = zotcard
