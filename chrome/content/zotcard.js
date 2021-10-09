// eslint-disable-next-line no-unused-vars
Services.scriptloader.loadSubScript('chrome://zoterozotcard/content/utils.js')

let zotcard = {
  _bundle: Cc['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://zoterozotcard/locale/zotcard.properties')
}

let isDebug = function () {
  return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled
}

zotcard.htmlToText = function (html) {
  var	nsIFC = Components.classes['@mozilla.org/widget/htmlformatconverter;1'].createInstance(Components.interfaces.nsIFormatConverter)
  var from = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString)
  from.data = html
  var to = { value: null }
  try {
    nsIFC.convert('text/html', from, from.toString().length, 'text/unicode', to, {})
    to = to.value.QueryInterface(Components.interfaces.nsISupportsString)
    return to.toString().replace(/\n{2}/g, '\n')
  } catch (e) {
    Zotero.debug(e, 1)
    return html
  }
}

zotcard.hangzi = function (html) {
  var content = this.htmlToText(html)
  Zotero.debug(`content: ${content}`)
  let m1 = content.match(/[\u4E00-\u9FA5]/g)
  let m2 = content.match(/[\u9FA6-\u9FEF]/g)
  let m3 = content.match(/\w+/g)
  let l1 = m1 ? m1.length : 0
  let l2 = m2 ? m2.length : 0
  let l3 = m3 ? m3.length : 0
  return l1 + l2 + l3
}

zotcard.lines = function (html) {
  var content = this.htmlToText(html)
  if (content) {
    let m = content.match(/\n/g)
    let l = m ? m.length + 1 : 1
    return l
  } else {
    return 0
  }
}

zotcard.init = function () {
  // Register the callback in Zotero as an item observer
  let notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item'])

  Zotero.Prefs.registerObserver('zotcard.card_quantity', function () {
    var quantity = Zotero.Prefs.get('zotcard.card_quantity')
    for (let index = 0; index < quantity; index++) {
      let name = `card${index + 1}`
      this.initPrefs(name)
    }
    this.resetCard(quantity + 1)
  }.bind(this))

  document.getElementById('zotero-items-tree').addEventListener('select', this.itemsTreeOnSelect.bind(this), false)
  document.getElementById('zotero-note-editor').addEventListener('keyup', this.noteEditorOnKeyup.bind(this), false)
  document.getElementById('zotero-itemmenu').addEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)

  this.initPrefs()

  // Unregister callback when the window closes (important to avoid a memory leak)
  window.addEventListener('unload', function (e) {
    Zotero.Notifier.unregisterObserver(notifierID)

    document.getElementById('zotero-items-tree').removeEventListener('select', this.itemsTreeOnSelect.bind(this), false)
    document.getElementById('zotero-note-editor').removeEventListener('keyup', this.noteEditorOnKeyup.bind(this), false)
    document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)
  }, false)
}

zotcard.noteEditorOnKeyup = function (e) {
  let label = document.getElementById('zotero-view-note-counts')
  if (!label) {
    label = document.createElement('label')
    label.setAttribute('id', 'zotero-view-note-counts')
    label.textContent = `字数: 0  \t行数: 0 \t占空间: 0`
    document.getElementById('zotero-view-note').prepend(label)
  }

  let noteEditor = e.currentTarget
  Zotero.debug(`note: ${noteEditor.value}`)
  let hangzis = this.hangzi(noteEditor.value)
  let liness = this.lines(noteEditor.value)
  label.textContent = `字数: ${hangzis}  \t行数: ${liness} \t占空间: ${Zotero.Utilities.Internal.byteLength(noteEditor.value)}`
  Zotero.debug(`onkeyup: ${hangzis} ${liness}`)
}

zotcard.itemsTreeOnSelect = function () {
  var selectedItems = ZoteroPane.getSelectedItems()
  if (selectedItems.length === 1) {
    let item = selectedItems[0]
    if (item.isNote()) {
      let label = document.getElementById('zotero-view-note-counts')
      if (!label) {
        label = document.createElement('label')
        label.setAttribute('id', 'zotero-view-note-counts')
        label.textContent = `字数: 0  \t行数: 0 \t占空间: 0`
        let noteEditor = document.getElementById('zotero-view-note')
        noteEditor.prepend(label)
      }
      let hangzis = this.hangzi(item.getNote())
      let liness = this.lines(item.getNote())
      label.textContent = `字数: ${hangzis}     行数: ${liness}    占空间: ${Zotero.Utilities.Internal.byteLength(item.getNote())}`
      Zotero.debug(`onselect: ${hangzis} ${liness}`)
    }
  }
}

zotcard.refreshZoteroItemPopup = function () {
  var zitems1 = this.getSelectedItems('regular')
  var zitems2 = this.getSelectedItems(['note'])
  var isRegular = zitems1 && zitems1.length > 0
  var onlyOne = zitems1 && zitems1.length === 1
  var hasNotes = zitems2 && zitems2.length > 0

  document.getElementById('zotero-itemmenu-zotcard').disabled = (isRegular && !onlyOne) || (!hasNotes && !isRegular)

  let pref = this.initPrefs('quotes')
  document.getElementById('zotero-itemmenu-zotcard-quotes').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-quotes').setAttribute('label', pref.label)
  pref = this.initPrefs('concept')
  document.getElementById('zotero-itemmenu-zotcard-concept').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-concept').setAttribute('label', pref.label)
  pref = this.initPrefs('character')
  document.getElementById('zotero-itemmenu-zotcard-character').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-character').setAttribute('label', pref.label)
  pref = this.initPrefs('not_commonsense')
  document.getElementById('zotero-itemmenu-zotcard-not_commonsense').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-not_commonsense').setAttribute('label', pref.label)
  pref = this.initPrefs('skill')
  document.getElementById('zotero-itemmenu-zotcard-skill').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-skill').setAttribute('label', pref.label)
  pref = this.initPrefs('structure')
  document.getElementById('zotero-itemmenu-zotcard-structure').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-structure').setAttribute('label', pref.label)
  pref = this.initPrefs('general')
  document.getElementById('zotero-itemmenu-zotcard-general').hidden = (!isRegular || !onlyOne) || !pref.visible
  document.getElementById('zotero-itemmenu-zotcard-general').setAttribute('label', pref.label)

  document.querySelectorAll('.card').forEach(element => {
    element.hidden = true
  })
  let quantity = this.initPrefs('card_quantity')
  Zotero.debug(`zotcard@${quantity}`)
  let cardsVisible = false
  for (let index = 0; index < quantity; index++) {
    let name = `card${index + 1}`
    let id = `zotero-itemmenu-zotcard-${name}`
    pref = this.initPrefs(name)
    let card = document.getElementById(id)
    if (!card) {
      card = document.createElement('menuitem')
      card.setAttribute('id', id)
      card.setAttribute('name', name)
      card.setAttribute('class', 'card')
      card.onclick = function (e) { this.newCard(e.target.getAttribute('name')) }.bind(this)
      document.getElementById('zotero-itemmenu-zotcard-separator2').before(card)
    }
    card.setAttribute('label', `${pref.card ? pref.label : '-'}`)
    card.hidden = (!isRegular || !onlyOne) || !pref.visible

    cardsVisible |= pref.visible
  }
  Zotero.debug(`zotcard@${quantity}`)

  document.getElementById('zotero-itemmenu-zotcard-separator1').hidden = (!isRegular || !onlyOne) || !cardsVisible
  document.getElementById('zotero-itemmenu-zotcard-separator2').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-separator3').hidden = (!hasNotes)
  
  document.getElementById('zotero-itemmenu-zotcard-replace').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-copy').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-copyandcreate').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-open').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-adjust').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-close').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-closeall').hidden = (!hasNotes)
  document.getElementById('zotero-itemmenu-zotcard-compressimg').hidden = (!hasNotes)
}

zotcard.initPref = function (name, item, beforeDefs, def) {
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
}

zotcard.initReservedPref = function (item) {
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
  if (!visible) {
    visible = true
    Zotero.Prefs.set(`zotcard.${item}.visible`, visible)
  }
  return { card: card, label: label, visible: visible }
}

zotcard.initPrefs = function (item) {
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
        beforeDefs = ['<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 金句卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span style="color: #bbbbbb;">&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('金句卡', item, beforeDefs, def)
        break
      case 'concept':
        beforeDefs = ['<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 概念卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span style="color: #bbbbbb;">&lt;姓名&gt;</span>, <span style="color: #bbbbbb;">&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('概念卡', item, beforeDefs, def)
        break
      case 'character':
        beforeDefs = ['<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 人物卡 - <span style="color: #bbbbbb;">&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span style="color: #bbbbbb;">&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：</p><p>- <strong>成就</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('人物卡', item, beforeDefs, def)
        break
      case 'not_commonsense':
        beforeDefs = ['<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 反常识卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span style="color: #bbbbbb;">&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span style="color: #bbbbbb;">&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('反常识卡', item, beforeDefs, def)
        break
      case 'skill':
        beforeDefs = ['<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 技巧卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('技巧卡', item, beforeDefs, def)
        break
      case 'structure':
        beforeDefs = ['<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 结构卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('结构卡', item, beforeDefs, def)
        break
      case 'general':
        beforeDefs = ['<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 通用卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>']
        def = '<h3>## 短文卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>正文</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>'
        pref = this.initPref('短文卡', item, beforeDefs, def)
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
}

zotcard.reset = function () {
  if (Zotero.ZotCard.Utils.confirm('重置后会清空所有配置，还原到安装时的配置。确实要重置吗？')) {
    Zotero.Prefs.clear('zotcard.quotes')
    Zotero.Prefs.clear('zotcard.quotes.visible')
    Zotero.Prefs.clear('zotcard.concept')
    Zotero.Prefs.clear('zotcard.concept.visible')
    Zotero.Prefs.clear('zotcard.character')
    Zotero.Prefs.clear('zotcard.character.visible')
    Zotero.Prefs.clear('zotcard.not_commonsense')
    Zotero.Prefs.clear('zotcard.not_commonsense.visible')
    Zotero.Prefs.clear('zotcard.skill')
    Zotero.Prefs.clear('zotcard.skill.visible')
    Zotero.Prefs.clear('zotcard.structure')
    Zotero.Prefs.clear('zotcard.structure.visible')
    Zotero.Prefs.clear('zotcard.general')
    Zotero.Prefs.clear('zotcard.general.visible')
    Zotero.Prefs.clear('zotcard.card_quantity')
    Zotero.Prefs.clear('zotcard.config.column_edt')

    this.resetCard(1)

    Zotero.ZotCard.Utils.success('重置成功，即将重启Zotero。')
    Zotero.Utilities.Internal.quit(true)
  }
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
  var item = new Zotero.Item('note')
  var pref = this.initPrefs(name)
  if (!pref) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.please_configure', 'zotcard.' + name))
    return
  }
  if (!pref.card) {
    Zotero.ZotCard.Utils.warning(`在接下来的about:config窗口中进行配置。
    zotcard.${name}\t\t\t卡片1模版
    zotcard.${name}.label\t卡片1标题
    zotcard.${name}.visible\t卡片1显示

  详情请访问官网: https://github.com/018/zotcard`)
    Zotero.openInViewer(`about:config?filter=zotero.zotcard.${name}`)
  } else {
    let now = new Date()
    let firstDay = new Date()
    firstDay.setMonth(0)
    firstDay.setDate(1)
    firstDay.setHours(0)
    firstDay.setMinutes(0)
    firstDay.setSeconds(0)
    firstDay.setMilliseconds(0)
    let dateGap = now.getTime() - firstDay.getTime() + 1
    let dayOfYear = Math.ceil(dateGap / (24 * 60 * 60 * 1000))

    // 0: 周日开始
    // 1: 周一开始
    let startOfWeek = Zotero.Prefs.get('zotcard.startOfWeek')
    if (!startOfWeek) {
      startOfWeek = 0
      Zotero.Prefs.set('zotcard.startOfWeek', startOfWeek)
    }

    firstDay.setDate(1 + (7 - firstDay.getDay() + startOfWeek) % 7)
    dateGap = now.getTime() - firstDay.getTime()
    let weekOfYear = Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000)) + 1

    let week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
    let weekEn = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.'][now.getDay()]

    item.setNote(pref.card.replace(/\{authors\}/g, authors.toString())
      .replace(/\{title\}/g, zitem.getField('title'))
      .replace(/\{now\}/g, this.formatDate(now, 'yyyy-MM-dd HH:mm:ss'))
      .replace(/\{today\}/g, this.formatDate(now, 'yyyy-MM-dd'))
      .replace(/\{month\}/g, this.formatDate(now, 'yyyy-MM'))
      .replace(/\{dayOfYear\}/g, dayOfYear)
      .replace(/\{weekOfYear\}/g, weekOfYear)
      .replace(/\{week\}/g, week)
      .replace(/\{week_en\}/g, weekEn)
      .replace(/\{shortTitle\}/g, zitem.getField('shortTitle'))
      .replace(/\{archive\}/g, zitem.getField('archive'))
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

zotcard.replace = function () {
  window.openDialog(
    'chrome://zoterozotcard/content/replace.xul',
    'zutilo-startup-upgradewindow', 'chrome, centerscreen',
    { upgradeMessage: '' })
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
      zitem.setNote(zitem.getNote().replaceAll(text, replaceto));
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

zotcard.adjust = function () {
  window.openDialog(
    'chrome://zoterozotcard/content/adjust.xul',
    'zotcard-config', 'chrome, centerscreen',
    {})
}

zotcard.close = function () {
  var zitems = this.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, this.getString('zotcard.warning'), this.getString('zotcard.only_note'))
    return
  }

  zitems.forEach(zitem => {
    let win = ZoteroPane.findNoteWindow(zitem.id)
    if (win) {
      win.close()
    }
  })
}

zotcard.closeall = function () {
  var wm = Services.wm
  var e = wm.getEnumerator('zotero:note')
  while (e.hasMoreElements()) {
    var w = e.getNext()
    w.close()
  }
}

zotcard.compressimg = async function () {
  var zitems = this.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    Zotero.ZotCard.Utils.error(this.getString('zotcard.only_note'))
    return
  }
  if (zitems.length !== 1) {
    Zotero.ZotCard.Utils.error(this.getString('zotcard.only_note'))
    return
  }

  let tinifyApiKey = Zotero.Prefs.get('zotcard.config.tinify_api_key')
  if (!tinifyApiKey) {
    Zotero.Prefs.set('zotcard.config.tinify_api_key', '')
    Zotero.ZotCard.Utils.warning(`请先配置 tinypng 的 api key，可访问 https://tinypng.com/developers/ 进行申请。`)
    Zotero.openInViewer(`about:config?filter=zotero.zotcard.config.tinify_api_key`)
    return
  }
  let compressWithWidthAndHeight = Zotero.Prefs.get('zotcard.config.compress_with_width_and_height')
  if (!compressWithWidthAndHeight) {
    compressWithWidthAndHeight = false
    Zotero.Prefs.set('zotcard.config.compress_with_width_and_height', compressWithWidthAndHeight)
  }

  let pw = new Zotero.ProgressWindow()
  pw.changeHeadline('压缩')
  pw.addDescription(this.getString('zotcard.choose', zitems.length))
  pw.show()
  var zitem = zitems[0]
  let note = zitem.getNote()
  let matchImages = zitem.getNote().match(/<img.*?src="data:.*?;base64,.*?".*?\/>/g)
  if (matchImages) {
    pw.addLines(`${zitem.getNoteTitle()}: 包括 ${matchImages.length} 张图片。`, `chrome://zotero/skin/tick${Zotero.hiDPISuffix}.png`)
    for (let index = 0; index < matchImages.length; index++) {
      let itemProgress = new pw.ItemProgress(
        `chrome://zotero/skin/spinner-16px${Zotero.hiDPISuffix}.png`,
        `第 ${index + 1} 张图片压缩中 ...`
      )
      itemProgress.setProgress(50)
      let matchImageSrcs = matchImages[index].match(/src="data:.*?;base64,.*?"/g)
      const element = matchImageSrcs[0]
      let width
      let height
      let matchImageWidths = matchImages[index].match(/width=".*?"/g)
      if (matchImageWidths) {
        width = matchImageWidths[0].replace('width=', '').replace(/"/g, '')
      }
      let matchImageHeights = matchImages[index].match(/height=".*?"/g)
      if (matchImageHeights) {
        height = matchImageHeights[0].replace('height=', '').replace(/"/g, '')
      }
      let content = element.replace('src="', '').replace('"', '')
      let authorization = 'Basic ' + Zotero.Utilities.Internal.Base64.encode('api:' + tinifyApiKey)
      try {
        let request = await Zotero.HTTP.request('POST', 'https://api.tinify.com/shrink',
          {
            body: Zotero.ZotCard.Utils.dataURItoBlob(content),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': authorization
            }
          })
        if (request.status === 200 || request.status === 201) {
          let res = JSON.parse(request.responseText)
          if (res.error) {
            itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
            itemProgress.setText(`第 ${index + 1} 张图片压缩失败，${res.error} - ${res.message}`)
            itemProgress.setProgress(100)
          } else {
            let image
            if (!compressWithWidthAndHeight || (!width && !height)) {
              image = await Zotero.HTTP.request('GET', res.output.url,
                {
                  responseType: 'blob',
                  followRedirects: false
                })
            } else {
              Zotero.debug(`zotcard@width: ${width}, height: ${height}`)
              image = await Zotero.HTTP.request('POST', res.output.url,
                {
                  body: JSON.stringify({ resize: { method: 'fit', width: width ? parseInt(width) : 0, height: height ? parseInt(height) : 0 } }),
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                  },
                  responseType: 'blob',
                  followRedirects: false
                })
            }

            if (image.status === 200 || image.status === 201) {
              Zotero.ZotCard.Utils.blobToDataURI(image.response, function (base64) {
                note = note.replace(content, base64)
                zitem.setNote(note)
                zitem.saveTx()
                itemProgress.setIcon(`chrome://zotero/skin/tick${Zotero.hiDPISuffix}.png`)
                itemProgress.setText(`第 ${index + 1} 张图片大小 ${res.input.size}${compressWithWidthAndHeight && (width || height) ? ('(' + (width || '') + ',' + (height || '') + ')') : ''}, 压缩成 ${compressWithWidthAndHeight && (width || height) ? image.response.size : res.output.size}, 压缩率: ${res.output.ratio}。`)
                itemProgress.setProgress(100)
              })
            } else if (image.status === 0) {
              itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
              itemProgress.setText(`第 ${index + 1} 张图片获取结果失败 - 网络错误。`)
              itemProgress.setProgress(100)
            } else {
              itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
              itemProgress.setText(`第 ${index + 1} 张图片获取结果失败，${image.status} - ${image.statusText}`)
              itemProgress.setProgress(100)
            }
          }
        } else if (request.status === 0) {
          itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
          itemProgress.setText(`第 ${index + 1} 张图片压缩出错 - 网络错误。`)
          itemProgress.setProgress(100)
        } else {
          itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
          itemProgress.setText(`第 ${index + 1} 张图片压缩出错，${request.status} - ${request.statusText}`)
          itemProgress.setProgress(100)
        }
      } catch (e) {
        Zotero.debug(e)
        itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
        itemProgress.setText(`第 ${index + 1} 张图片压缩出错，${e}。`)
        itemProgress.setProgress(100)
      }
    }
  } else {
    pw.addLines(`${zitem.getNoteTitle()} 不包含图片。`, `chrome://zotero/skin/warning${Zotero.hiDPISuffix}.png`)
  }
  pw.addDescription(Utils.getString('uread.click_on_close'))
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

zotcard.config = function () {
  Zotero.ZotCard.Utils.warning(`在接下来的about:config窗口中进行配置。
默认：
  zotcard.quotes\t\t\t\t\t金句卡模版
  zotcard.quotes.label\t\t\t\t金句卡标题
  zotcard.quotes.visible\t\t\t\t金句卡显示
  zotcard.concept\t\t\t\t\t概念卡
  zotcard.character\t\t\t\t\t人物卡
  zotcard.not_commonsense\t\t\t反常识卡
  zotcard.skill\t\t\t\t\t\t技巧卡
  zotcard.structure\t\t\t\t\t结构卡
  zotcard.general\t\t\t\t\t短文卡
  
自定义：
  zotcard.card_quantity\t\t\t\t自定义卡片数
  zotcard.card1\t\t\t\t\t\t卡片1模版
  zotcard.card1.label\t\t\t\t\t卡片1标题
  zotcard.card1.visible\t\t\t\t卡片1显示
  ...
  
详情请访问官网: https://github.com/018/zotcard`)

  Zotero.openInViewer('about:config?filter=zotero.zotcard')
}

zotcard.backup = function () {
  let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
  fp.init(window, '备份', Ci.nsIFilePicker.modeSave)
  fp.appendFilter('ZotCard Backup', '*.zotcard')
  fp.open(function (returnConstant) {
    if (returnConstant === 0) {
      let file = fp.file
      file.QueryInterface(Ci.nsIFile)
      let backup = this.initPrefs()
      backup.last_updated = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
      Zotero.File.putContents(Zotero.File.pathToFile(file.path + '.zotcard'), JSON.stringify(backup))
      Zotero.ZotCard.Utils.success('备份成功。')
    }
  }.bind(this))
}

zotcard.restore = function () {
  let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
  fp.init(window, '还原', Ci.nsIFilePicker.modeOpen)
  fp.appendFilter('ZotCard Backup', '*.zotcard')
  fp.open(function (returnConstant) {
    if (returnConstant === 0) {
      let file = fp.file
      file.QueryInterface(Ci.nsIFile)
      let content = Zotero.File.getContents(file.path)
      if (content) {
        try {
          let json = JSON.parse(content)
          if (json.quotes && json.quotes.card &&
              json.concept && json.concept.card &&
              json.character && json.character.card &&
              json.not_commonsense && json.not_commonsense.card &&
              json.skill && json.skill.card &&
              json.structure && json.structure.card &&
              json.general && json.general.card &&
              json.card_quantity !== undefined) {
            for (let index = 0; index < json.card_quantity; index++) {
              let name = `card${index + 1}`
              if (!json[name]) {
                Zotero.ZotCard.Utils.warning('自定义卡片的内容已经被破坏，无法还原。')
                return
              }
            }
            Zotero.Prefs.set(`zotcard.quotes`, json.quotes.card)
            Zotero.Prefs.set(`zotcard.quotes.visible`, json.quotes.visible === undefined ? true : json.quotes.visible)
            Zotero.Prefs.set(`zotcard.concept`, json.concept.card)
            Zotero.Prefs.set(`zotcard.concept.visible`, json.concept.visible === undefined ? true : json.concept.visible)
            Zotero.Prefs.set(`zotcard.character`, json.character.card)
            Zotero.Prefs.set(`zotcard.character.visible`, json.character.visible === undefined ? true : json.character.visible)
            Zotero.Prefs.set(`zotcard.not_commonsense`, json.not_commonsense.card)
            Zotero.Prefs.set(`zotcard.not_commonsense.visible`, json.not_commonsense.visible === undefined ? true : json.not_commonsense.visible)
            Zotero.Prefs.set(`zotcard.skill`, json.skill.card)
            Zotero.Prefs.set(`zotcard.skill.visible`, json.skill.visible === undefined ? true : json.skill.visible)
            Zotero.Prefs.set(`zotcard.structure`, json.structure.card)
            Zotero.Prefs.set(`zotcard.structure.visible`, json.structure.visible === undefined ? true : json.structure.visible)
            Zotero.Prefs.set(`zotcard.general`, json.general.card)
            Zotero.Prefs.set(`zotcard.general.visible`, json.general.visible === undefined ? true : json.general.visible)
            Zotero.Prefs.set(`zotcard.card_quantity`, json.card_quantity)

            let index = 0
            for (; index < json.card_quantity; index++) {
              let name = `card${index + 1}`
              let pref = json[name]
              if (pref) {
                Zotero.Prefs.set(`zotcard.${name}`, pref.card)
                Zotero.Prefs.set(`zotcard.${name}.label`, pref.label)
                Zotero.Prefs.set(`zotcard.${name}.visible`, pref.visible)
              }
            }
            this.resetCard(index + 1)
            Zotero.ZotCard.Utils.success(`还原成功。\n备份时间: ${json.last_updated}`)
          } else {
            Zotero.ZotCard.Utils.warning('内容已经被破坏，无法还原。')
          }
        } catch (e) {
          Zotero.ZotCard.Utils.warning(e)
        }
      } else {
        Zotero.ZotCard.Utils.warning('文件无内容。')
      }
    }
  }.bind(this))
}

zotcard.transitionstyle = function () {
  let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
  fp.init(window, '还原', Ci.nsIFilePicker.modeOpen)
  fp.appendFilter('ZotCard Default Style', '*.zotcardstyle')
  fp.open(function (returnConstant) {
    if (returnConstant === 0) {
      let file = fp.file
      file.QueryInterface(Ci.nsIFile)
      let content = Zotero.File.getContents(file.path)
      if (content) {
        try {
          let json = JSON.parse(content)
          if (json.quotes && json.quotes.card &&
              json.concept && json.concept.card &&
              json.character && json.character.card &&
              json.not_commonsense && json.not_commonsense.card &&
              json.skill && json.skill.card &&
              json.structure && json.structure.card &&
              json.general && json.general.card) {
            Zotero.Prefs.set(`zotcard.quotes`, json.quotes.card)
            Zotero.Prefs.set(`zotcard.quotes.visible`, json.quotes.visible === undefined ? true : json.quotes.visible)
            Zotero.Prefs.set(`zotcard.concept`, json.concept.card)
            Zotero.Prefs.set(`zotcard.concept.visible`, json.concept.visible === undefined ? true : json.concept.visible)
            Zotero.Prefs.set(`zotcard.character`, json.character.card)
            Zotero.Prefs.set(`zotcard.character.visible`, json.character.visible === undefined ? true : json.character.visible)
            Zotero.Prefs.set(`zotcard.not_commonsense`, json.not_commonsense.card)
            Zotero.Prefs.set(`zotcard.not_commonsense.visible`, json.not_commonsense.visible === undefined ? true : json.not_commonsense.visible)
            Zotero.Prefs.set(`zotcard.skill`, json.skill.card)
            Zotero.Prefs.set(`zotcard.skill.visible`, json.skill.visible === undefined ? true : json.skill.visible)
            Zotero.Prefs.set(`zotcard.structure`, json.structure.card)
            Zotero.Prefs.set(`zotcard.structure.visible`, json.structure.visible === undefined ? true : json.structure.visible)
            Zotero.Prefs.set(`zotcard.general`, json.general.card)
            Zotero.Prefs.set(`zotcard.general.visible`, json.general.visible === undefined ? true : json.general.visible)

            Zotero.ZotCard.Utils.success(`更换默认卡片样式成功。\n样式最后更新时间: ${json.last_updated}`)
          } else {
            Zotero.ZotCard.Utils.warning('内容已经被破坏，无法更换默认卡片样式。')
          }
        } catch (e) {
          Zotero.ZotCard.Utils.warning(e)
        }
      } else {
        Zotero.ZotCard.Utils.warning('文件无内容。')
      }
    }
  }.bind(this))
}

zotcard.resetCard = function (index) {
  let val = Zotero.Prefs.get(`zotcard.card${index}.visible`)
  while (val) {
    Zotero.Prefs.clear(`zotcard.card${index}`)
    Zotero.Prefs.clear(`zotcard.card${index}.label`)
    Zotero.Prefs.clear(`zotcard.card${index}.visible`)

    index++
    val = Zotero.Prefs.get(`zotcard.card${index}.visible`)
  }
}

zotcard.noteBGColor = function (color) {
  let val = Zotero.Prefs.get('note.css')
  if (val) {
    if (color) {
      val = val.replace(/body +{.*?}/g, `body { background-color: ${color}; }`)
    } else {
      val = val.replace(/body +{.*?}/g, '')
    }
  } else {
    if (color) {
      val = `body { background-color: ${color}; }`
    }
  }
  Zotero.Prefs.set('note.css', val)

  let fontSize = Zotero.Prefs.get('note.fontSize')
  // Fix empty old font prefs before a value was enforced
  if (fontSize < 6) {
    fontSize = 11;
  }
  var css = 'body#zotero-tinymce-note, '
    + 'body#zotero-tinymce-note p, '
    + 'body#zotero-tinymce-note th, '
    + 'body#zotero-tinymce-note td, '
    + 'body#zotero-tinymce-note pre { '
    + 'font-size: ' + fontSize + 'px; '
    + '} '
    + 'body#zotero-tinymce-note, '
    + 'body#zotero-tinymce-note p { '
    + 'font-family: '
    + Zotero.Prefs.get('note.fontFamily') + '; '
    + '} '
    + Zotero.Prefs.get('note.css')

  var editor = document.getElementById('zotero-note-editor').noteField._editor
  var doc = editor.contentDocument
  var head = doc.getElementsByTagName('head')[0]
  var style = doc.createElement('style')
  style.innerHTML = css
  head.appendChild(style)
}

zotcard.resetNoteBGColor = function () {
  this.noteBGColor()
}

zotcard.darkNoteBGColor = function () {
  this.noteBGColor('#5E5E5E')
}

zotcard.grayNoteBGColor = function () {
  this.noteBGColor('#F5F5F5')
}

zotcard.yellowNoteBGColor = function () {
  this.noteBGColor('#EFEB93')
}

zotcard.blueNoteBGColor = function () {
  this.noteBGColor('#D3DEF3')
}

zotcard.brownNoteBGColor = function () {
  this.noteBGColor('#B49D84')
}

zotcard.pinkNoteBGColor = function () {
  this.noteBGColor('#DCADA5')
}

zotcard.cyanNoteBGColor = function () {
  this.noteBGColor('#A8B799')
}

zotcard.purpleNoteBGColor = function () {
  this.noteBGColor('#C0ADC5')
}

zotcard.copyStringToClipboard = function (clipboardText) {
  const gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper)
  gClipboardHelper.copyString(clipboardText, document)
}

zotcard.getString = function (name, ...params) {
  if (params !== undefined && params.length > 0) {
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
  window.Zotero.ZotCard.replace = function () { zotcard.replace() }
  window.Zotero.ZotCard.doReplace = function () { zotcard.doReplace() }
  window.Zotero.ZotCard.copy = function () { zotcard.copy() }
  window.Zotero.ZotCard.copyandcreate = function () { zotcard.copyandcreate() }
  window.Zotero.ZotCard.open = function () { zotcard.open() }
  window.Zotero.ZotCard.adjust = function () { zotcard.adjust() }
  window.Zotero.ZotCard.close = function () { zotcard.close() }
  window.Zotero.ZotCard.closeall = function () { zotcard.closeall() }
  window.Zotero.ZotCard.compressimg = function () { zotcard.compressimg() }

  window.Zotero.ZotCard.config = function () { zotcard.config() }
  window.Zotero.ZotCard.reset = function () { zotcard.reset() }
  window.Zotero.ZotCard.backup = function () { zotcard.backup() }
  window.Zotero.ZotCard.restore = function () { zotcard.restore() }
  window.Zotero.ZotCard.transitionstyle = function () { zotcard.transitionstyle() }

  window.Zotero.ZotCard.resetNoteBGColor = function () { zotcard.resetNoteBGColor() }
  window.Zotero.ZotCard.darkNoteBGColor = function () { zotcard.darkNoteBGColor() }
  window.Zotero.ZotCard.grayNoteBGColor = function () { zotcard.grayNoteBGColor() }

  window.Zotero.ZotCard.yellowNoteBGColor = function () { zotcard.yellowNoteBGColor() }
  window.Zotero.ZotCard.blueNoteBGColor = function () { zotcard.blueNoteBGColor() }
  window.Zotero.ZotCard.brownNoteBGColor = function () { zotcard.brownNoteBGColor() }
  window.Zotero.ZotCard.pinkNoteBGColor = function () { zotcard.pinkNoteBGColor() }
  window.Zotero.ZotCard.cyanNoteBGColor = function () { zotcard.cyanNoteBGColor() }
  window.Zotero.ZotCard.purpleNoteBGColor = function () { zotcard.purpleNoteBGColor() }
}

if (typeof module !== 'undefined') module.exports = zotcard
