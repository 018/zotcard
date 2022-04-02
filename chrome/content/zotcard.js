// eslint-disable-next-line no-unused-vars
Services.scriptloader.loadSubScript('chrome://zoterozotcard/content/utils.js', window, 'utf-8')
Services.scriptloader.loadSubScript('chrome://zoterozotcard/content/cardsearcher.js', window, 'utf-8')

let zotcard = {
}

let isDebug = function () {
  return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled
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

    this.initStandCardMenu()
  }.bind(this))

  if (Zotero.ZotCard.Utils.version() >= 6) {
    Zotero.debug(`zotcard@addListener onSelect: ${Zotero.ZotCard.Utils.version()}`)
    var interval1 = setInterval(() => {
      if (ZoteroPane.itemsView) {
        ZoteroPane.itemsView.onSelect.addListener(this.itemsTreeOnSelect);
        clearInterval(interval1)
      }
    }, 1000);
  } else {
    document.getElementById('zotero-items-tree').addEventListener('select', this.itemsTreeOnSelect.bind(this), false)
  }

  document.getElementById('zotero-note-editor').addEventListener('keyup', this.noteEditorOnKeyup.bind(this), false)
  document.getElementById('zotero-itemmenu').addEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)
  document.getElementById('context-pane-add-child-note-button-popup').addEventListener('popupshowing', this.refreshZoteroPanePopup.bind(this), false)

  document.getElementById('zotero-toolspopup-zotcard-option-notebackgroundcolor').hidden = Zotero.ZotCard.Utils.version() >= 6;
  

  this.initPrefs()

  let tinifyApiKey = Zotero.Prefs.get('zotcard.config.tinify_api_key')
  if (!tinifyApiKey) {
    Zotero.Prefs.set('zotcard.config.tinify_api_key', '')
  }

  // 独立笔记
  this.initStandCardMenu()

  if (Zotero.ZotCard.Utils.version() < 6) {
    this.initNoteLineHeight()
    this.initNoteParagraphSpacing()
  }

  // Unregister callback when the window closes (important to avoid a memory leak)
  window.addEventListener('unload', function (e) {
    Zotero.Notifier.unregisterObserver(notifierID)

    if (Zotero.ZotCard.Utils.version() >= 6) {
      ZoteroPane.itemsView.onSelect.removeListener(this.itemsTreeOnSelect);
    } else {
      document.getElementById('zotero-items-tree').removeEventListener('select', this.itemsTreeOnSelect.bind(this), false)
    }
    document.getElementById('zotero-note-editor').removeEventListener('keyup', this.noteEditorOnKeyup.bind(this), false)
    document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)
    document.getElementById('context-pane-add-child-note-button-popup').removeEventListener('popupshowing', this.refreshZoteroPanePopup.bind(this), false)
  }, false)
}

zotcard.noteEditorOnKeyup = function (e) {
  
  let label = document.getElementById('zotero-view-note-counts')
  if (!label) {
    label = document.createElement('label')
    label.setAttribute('id', 'zotero-view-note-counts')
    label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', 0, 0, 0)
    document.getElementById('zotero-view-note').prepend(label)
  }

  let noteEditor = e.currentTarget
  let note
  if (Zotero.ZotCard.Utils.version() >= 6) {
    let parser = Components.classes['@mozilla.org/xmlextras/domparser;1'].createInstance(Components.interfaces.nsIDOMParser)
    let doc = parser.parseFromString(document.getElementById('zotero-note-editor').editorInstance._iframeWindow.document.body.innerHTML, 'text/html')
    let proseMirror = doc.querySelector('.ProseMirror')
    if (proseMirror) {
      note = proseMirror.innerHTML
    } else {
      note = noteEditor.editorInstance._iframeWindow.document.body.innerHTML
    }

  } else {
    note = noteEditor.value
  }
  Zotero.debug(`zotcard@note: ${note}`)
  let hangzis = Zotero.ZotCard.Utils.hangzi(note)
  let liness = Zotero.ZotCard.Utils.lines(note)
  label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', hangzis, liness, Zotero.Utilities.Internal.byteLength(note))
  Zotero.debug(`zotcard@onkeyup: ${new Date().getTime()} ${hangzis} ${liness}`)
}

zotcard.itemsTreeOnSelect = function () {
  var selectedItems = ZoteroPane.getSelectedItems()
  Zotero.debug(`zotcard@selectedItems: ${selectedItems.length}`)
  if (selectedItems.length === 1) {
    let item = selectedItems[0]
    if (item.isNote()) {
      let label = document.getElementById('zotero-view-note-counts')
      if (!label) {
        label = document.createElement('label')
        label.setAttribute('id', 'zotero-view-note-counts')
        label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', 0, 0, 0)
        let noteEditor = document.getElementById('zotero-view-note')
        noteEditor.prepend(label)
      }
      let hangzis = Zotero.ZotCard.Utils.hangzi(item.getNote())
      let liness = Zotero.ZotCard.Utils.lines(item.getNote())
      label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', hangzis, liness, Zotero.Utilities.Internal.byteLength(item.getNote()))
      Zotero.debug(`onselect: ${hangzis} ${liness}`)
    }
  }
}

zotcard.refreshZoteroPanePopup = function () {
  this.refreshZoteroCardPopup(true)
}

zotcard.refreshZoteroItemPopup = function () {
  this.refreshZoteroCardPopup(false)
}

zotcard.refreshZoteroCardPopup = function (pane) {
  let items = Zotero.ZotCard.Utils.getSelectedItems()
  let itemTypes = Zotero.ZotCard.Utils.getSelectedItemTypes()
  let onlyNote = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'note'
  let onlyRegular = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'regular'
  var onlySimple = items && items.length === 1

  Zotero.debug(`${onlyNote}, ${onlyRegular}, ${onlySimple}`)

  if (!pane) {
    let zotcardMenu = document.getElementById('zotero-itemmenu-zotcard')
    zotcardMenu.disabled = false
    if (!items) {
      zotcardMenu.disabled = true
      Zotero.debug(`Not Select Item`)
    } else if (items.length > 1 && !onlyNote) {
      zotcardMenu.disabled = true
      Zotero.debug(`Mutil-Select Items but not onlyNote`)
    } else if (itemTypes.length > 1) {
      zotcardMenu.disabled = true
      Zotero.debug(`Mutil item types`)
    } else if (onlySimple && !onlyRegular && !onlyNote) {
      zotcardMenu.disabled = true
      Zotero.debug(`Simple but not onlyRegular and onlyNote`)
    }

    document.querySelectorAll('.dynamic-menu').forEach(element => {
      element.hidden = false
    })
    document.querySelectorAll('.only-regular').forEach(element => {
      element.hidden = element.hidden ? element.hidden : !onlyRegular
    })
    document.querySelectorAll('.only-note').forEach(element => {
      element.hidden = element.hidden ? element.hidden : !onlyNote
    })
    document.querySelectorAll('.only-simple').forEach(element => {
      element.hidden = element.hidden ? element.hidden : !onlySimple
    })
  }

  this.initDefCardMenu('quotes', pane)
  this.initDefCardMenu('concept', pane)
  this.initDefCardMenu('character', pane)
  this.initDefCardMenu('not_commonsense', pane)
  this.initDefCardMenu('skill', pane)
  this.initDefCardMenu('structure', pane)
  this.initDefCardMenu('abstract', pane)
  this.initDefCardMenu('general', pane)

  document.querySelectorAll(pane ? '.pane-card' : '.card').forEach(element => {
    element.hidden = true
  })
  if (pane || (onlyRegular && onlySimple)) {
    let quantity = this.initPrefs('card_quantity')
    Zotero.debug(`zotcard@${quantity}`)
    for (let index = 0; index < quantity; index++) {
      let name = `card${index + 1}`
      let id = pane ? `zotero-itemmenu-zotcard-pane-${name}` : `zotero-itemmenu-zotcard-${name}`
      let pref = this.initPrefs(name)
      let card = document.getElementById(id)
      if (!card) {
        card = document.createElement('menuitem')
        card.setAttribute('id', id)
        card.setAttribute('name', name)
        card.setAttribute('class', pane ? 'pane-card' : 'card')
        card.onclick = function (e) { this.newCard(pane, e.target.getAttribute('name')) }.bind(this)
        document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup').append(card)
      }
      card.setAttribute('label', `${pref.card ? pref.label : '-'}`)
      card.hidden = !pref.visible
    }
    document.getElementById(pane ? 'zotero-itemmenu-zotcard-pane-separator2' : 'zotero-itemmenu-zotcard-separator2').hidden = quantity === 0
    Zotero.debug(`zotcard@${quantity}`)

    let batchid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch' : 'zotero-itemmenu-zotcard-menupopup-batch'
    if (!document.getElementById(batchid)) {
      let menuitem = document.createElement('menuitem')
      menuitem.setAttribute('id', batchid)
      menuitem.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.batchaddnote'))
      menuitem.setAttribute('class', pane ? 'pane-card' : 'card')
      menuitem.onclick = function () {
        let io = {
          dataIn: {
            items: []
          }
        }

        let pushPref = function (items, type) {
          let pref = this.initPrefs(type)
          if (pref.visible && pref.card.length > 0) {
            Zotero.debug(`zotcard@push ${type}`)
            items.push({
              id: type,
              label: pref.label,
              value: ''
            })
          }
        }.bind(this)

        pushPref(io.dataIn.items, 'quotes')
        pushPref(io.dataIn.items, 'concept')
        pushPref(io.dataIn.items, 'character')
        pushPref(io.dataIn.items, 'not_commonsense')
        pushPref(io.dataIn.items, 'skill')
        pushPref(io.dataIn.items, 'structure')
        pushPref(io.dataIn.items, 'abstract')
        pushPref(io.dataIn.items, 'general')

        let quantity = this.initPrefs('card_quantity')
        Zotero.debug(`zotcard@card_quantity ${quantity}`)
        for (let index = 0; index < quantity; index++) {
          let name = `card${index + 1}`
          Zotero.debug(`zotcard@push ${name}`)
          pushPref(io.dataIn.items, name)
        }

        Zotero.debug(`zotcard@openDialog`)
        window.openDialog('chrome://zoterozotcard/content/batchnewcard.xul', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io)
        if (io.dataOut) {
          var _this = this
          io.dataOut.forEach(async function (element) {
            Zotero.debug('uRead@element: ' + element)
            for (let index = 0; index < element.value; index++) {
              _this.newCard(pane, element.id)
            }
          })
        }
      }.bind(this)
      let menuseparatorid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch-menuseparator' : 'zotero-itemmenu-zotcard-menupopup-batch-menuseparator'
      let menuseparator = document.createElement('menuseparator');
      menuitem.setAttribute('id', menuseparatorid)
      menuseparator.setAttribute('class', pane ? 'pane-card' : 'card')
      document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup').append(menuseparator)
      document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup').append(menuitem)
    } else {
      let batchid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch' : 'zotero-itemmenu-zotcard-menupopup-batch'
      let menuseparatorid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch-menuseparator' : 'zotero-itemmenu-zotcard-menupopup-batch-menuseparator'
      document.getElementById(batchid).hidden = false
      document.getElementById(menuseparatorid).hidden = false
    }
  }

  if (!pane && Zotero.ZotCard.Utils.version() >= 6) {
    document.getElementById('zotero-itemmenu-zotcard-compressimg').hidden = true
    document.getElementById('zotero-itemmenu-zotcard-compressimg-separator').hidden = true
  }
}

zotcard.initStandCardMenu = function () {
  if (!document.getElementById('zotero-tb-note-add-zotcard-separator1')) {
    let menuseparator = document.createElement('menuseparator')
    menuseparator.setAttribute('id', 'zotero-tb-note-add-zotcard-separator1')
    document.getElementById('zotero-tb-note-add').firstChild.append(menuseparator)
  }
  this.initStandDefCardMenu('abstract')
  this.initStandDefCardMenu('quotes')
  this.initStandDefCardMenu('concept')
  this.initStandDefCardMenu('character')
  this.initStandDefCardMenu('not_commonsense')
  this.initStandDefCardMenu('skill')
  this.initStandDefCardMenu('structure')
  this.initStandDefCardMenu('general')
  if (!document.getElementById('zotero-tb-note-add-zotcard-separator2')) {
    let menuseparator = document.createElement('menuseparator')
    menuseparator.setAttribute('id', 'zotero-tb-note-add-zotcard-separator2')
    document.getElementById('zotero-tb-note-add').firstChild.append(menuseparator)
  }

  document.querySelectorAll('.stand-card').forEach(element => {
    element.remove()
  })
  let quantity = this.initPrefs('card_quantity')
  for (let index = 0; index < quantity; index++) {
    let name = `card${index + 1}`
    let id = `zotero-tb-note-add-zotcard-${name}`
    let pref = this.initPrefs(name)
    if (pref.visible) {
      let card = document.getElementById(id)
      if (!card) {
        card = document.createElement('menuitem')
        card.setAttribute('id', id)
        card.setAttribute('name', name)
        card.setAttribute('class', 'stand-card')
        card.onclick = function (e) { this.newCard(false, e.target.getAttribute('name'), true) }.bind(this)
        document.getElementById('zotero-tb-note-add').firstChild.append(card)
      }
      card.setAttribute('label', `${pref.card ? (Zotero.ZotCard.Utils.getString('zotcard.newstandalone', pref.label)) : '-'}`)
    }
  }

  if (!document.getElementById('zotero-tb-note-add-zotcard-batch')) {
    let menuitem = document.createElement('menuitem')
    menuitem.setAttribute('id', `zotero-tb-note-add-zotcard-batch`)
    menuitem.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.batchnewstandalone'))
    menuitem.onclick = function () {
      let io = {
        dataIn: {
          items: []
        }
      }

      let pushPref = function (items, type) {
        let pref = this.initPrefs(type)
        if (pref.visible && pref.card.length > 0) {
          Zotero.debug(`zotcard@push ${type}`)
          items.push({
            id: type,
            label: pref.label,
            value: ''
          })
        }
      }.bind(this)

      pushPref(io.dataIn.items, 'quotes')
      pushPref(io.dataIn.items, 'concept')
      pushPref(io.dataIn.items, 'character')
      pushPref(io.dataIn.items, 'not_commonsense')
      pushPref(io.dataIn.items, 'skill')
      pushPref(io.dataIn.items, 'structure')
      pushPref(io.dataIn.items, 'abstract')
      pushPref(io.dataIn.items, 'general')

      let quantity = this.initPrefs('card_quantity')
      Zotero.debug(`zotcard@card_quantity ${quantity}`)
      for (let index = 0; index < quantity; index++) {
        let name = `card${index + 1}`
        Zotero.debug(`zotcard@push ${name}`)
        pushPref(io.dataIn.items, name)
      }

      Zotero.debug(`zotcard@openDialog`)
      window.openDialog('chrome://zoterozotcard/content/batchnewcard.xul', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io)
      if (io.dataOut) {
        var _this = this
        io.dataOut.forEach(async function (element) {
          Zotero.debug('uRead@element: ' + element)
          for (let index = 0; index < element.value; index++) {
            _this.newCard(false, element.id, true)
          }
        })
      }
    }.bind(this)
    let menuseparator = document.createElement('menuseparator');
    menuitem.setAttribute('id', `zotero-tb-note-add-zotcard-batch-menuseparator`)
    document.getElementById('zotero-tb-note-add').firstChild.append(menuseparator)
    document.getElementById('zotero-tb-note-add').firstChild.append(menuitem)
  }
}

zotcard.initNoteLineHeight = function () {
  if (!document.getElementById('note-line-heigth-menu')) {
    let menu = document.createElement('menu')
    menu.setAttribute('id', 'note-line-heigth-menu')
    menu.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.notelinespacing'))
    let menupopup = document.createElement('menupopup')
    menu.append(menupopup)
    let menuitem1 = document.createElement('menuitem')
    menuitem1.setAttribute('type', 'checkbox')
    menuitem1.setAttribute('label', '1')
    menuitem1.setAttribute('line-height', '1')
    menuitem1.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1")')
    menupopup.append(menuitem1)
    let menuitem12 = document.createElement('menuitem')
    menuitem12.setAttribute('type', 'checkbox')
    menuitem12.setAttribute('label', '1.2')
    menuitem12.setAttribute('line-height', '1.2')
    menuitem12.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.2")')
    menupopup.append(menuitem12)
    let menuitem14 = document.createElement('menuitem')
    menuitem14.setAttribute('type', 'checkbox')
    menuitem14.setAttribute('label', '1.4')
    menuitem14.setAttribute('line-height', '1.4')
    menuitem14.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.4")')
    menupopup.append(menuitem14)
    let menuitem16 = document.createElement('menuitem')
    menuitem16.setAttribute('type', 'checkbox')
    menuitem16.setAttribute('label', '1.6')
    menuitem16.setAttribute('line-height', '1.6')
    menuitem16.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.6")')
    menupopup.append(menuitem16)
    let menuitem18 = document.createElement('menuitem')
    menuitem18.setAttribute('type', 'checkbox')
    menuitem18.setAttribute('label', '1.8')
    menuitem18.setAttribute('line-height', '1.8')
    menuitem18.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.8")')
    menupopup.append(menuitem18)
    let menuitem2 = document.createElement('menuitem')
    menuitem2.setAttribute('type', 'checkbox')
    menuitem2.setAttribute('label', '2')
    menuitem2.setAttribute('line-height', '2')
    menuitem2.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("2")')
    menupopup.append(menuitem2)
    document.getElementById('note-font-size-menu').after(menu)

    this.refreshLineHeigthMenuItemChecked()
  }
}

zotcard.initNoteParagraphSpacing = function () {
  if (!document.getElementById('note-paragraph-spacing-menu')) {
    let menu = document.createElement('menu')
    menu.setAttribute('id', 'note-paragraph-spacing-menu')
    menu.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.noteparagraphspacing'))
    let menupopup = document.createElement('menupopup')
    menu.append(menupopup)
    let menuitem0 = document.createElement('menuitem')
    menuitem0.setAttribute('type', 'checkbox')
    menuitem0.setAttribute('label', '3')
    menuitem0.setAttribute('paragraph-spacing', '3')
    menuitem0.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("3")')
    menupopup.append(menuitem0)
    menuitem0 = document.createElement('menuitem')
    menuitem0.setAttribute('type', 'checkbox')
    menuitem0.setAttribute('label', '5')
    menuitem0.setAttribute('paragraph-spacing', '5')
    menuitem0.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("5")')
    menupopup.append(menuitem0)
    menuitem0 = document.createElement('menuitem')
    menuitem0.setAttribute('type', 'checkbox')
    menuitem0.setAttribute('label', '7')
    menuitem0.setAttribute('paragraph-spacing', '7')
    menuitem0.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("7")')
    menupopup.append(menuitem0)
    let menuitem18 = document.createElement('menuitem')
    menuitem18.setAttribute('type', 'checkbox')
    menuitem18.setAttribute('label', '9')
    menuitem18.setAttribute('paragraph-spacing', '9')
    menuitem18.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("9")')
    menupopup.append(menuitem18)
    let menuitem2 = document.createElement('menuitem')
    menuitem2.setAttribute('type', 'checkbox')
    menuitem2.setAttribute('label', '11')
    menuitem2.setAttribute('paragraph-spacing', '11')
    menuitem2.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("11")')
    menupopup.append(menuitem2)
    let menuitem13 = document.createElement('menuitem')
    menuitem13.setAttribute('type', 'checkbox')
    menuitem13.setAttribute('label', '13')
    menuitem13.setAttribute('paragraph-spacing', '13')
    menuitem13.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("13")')
    menupopup.append(menuitem13)
    let menuitem1 = document.createElement('menuitem')
    menuitem1.setAttribute('type', 'checkbox')
    menuitem1.setAttribute('label', '15')
    menuitem1.setAttribute('paragraph-spacing', '15')
    menuitem1.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("15")')
    menupopup.append(menuitem1)
    let menuitem12 = document.createElement('menuitem')
    menuitem12.setAttribute('type', 'checkbox')
    menuitem12.setAttribute('label', '17')
    menuitem12.setAttribute('paragraph-spacing', '17')
    menuitem12.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("17")')
    menupopup.append(menuitem12)
    let menuitem14 = document.createElement('menuitem')
    menuitem14.setAttribute('type', 'checkbox')
    menuitem14.setAttribute('label', '19')
    menuitem14.setAttribute('paragraph-spacing', '19')
    menuitem14.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("19")')
    menupopup.append(menuitem14)
    let menuitem16 = document.createElement('menuitem')
    menuitem16.setAttribute('type', 'checkbox')
    menuitem16.setAttribute('label', '21')
    menuitem16.setAttribute('paragraph-spacing', '21')
    menuitem16.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("21")')
    menupopup.append(menuitem16)
    let menuitem15 = document.createElement('menuitem')
    menuitem15.setAttribute('type', 'checkbox')
    menuitem15.setAttribute('label', '默认')
    menuitem15.setAttribute('paragraph-spacing', '')
    menuitem15.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("")')
    menupopup.append(menuitem15)
    document.getElementById('note-line-heigth-menu').after(menu)

    this.refreshParagraphSpacingMenuItemChecked()
  }
}

zotcard.initDefCardMenu = function (type, pane) {
  let pref = this.initPrefs(type)
  let quotes = document.getElementById(pane ? `context-pane-add-child-note-button-popup-zotcard-${type}` : `zotero-itemmenu-zotcard-${type}`)
  if (pane) {
    quotes.hidden = !pref.visible
  } else {
    quotes.hidden = quotes.hidden ? quotes.hidden : !pref.visible
  }
  quotes.setAttribute('label', pref.label)
}

zotcard.initStandDefCardMenu = function (type) {
  let pref = this.initPrefs(type)
  if (pref.visible && !document.getElementById(`zotero-tb-note-add-zotcard-${type}`)) {
    let menuitem = document.createElement('menuitem')
    menuitem.setAttribute('id', `zotero-tb-note-add-zotcard-${type}`)
    menuitem.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.newstandalone', pref.label))
    menuitem.onclick = function () {
      this.newCard(false, type, true)
    }.bind(this)
    document.getElementById('zotero-tb-note-add').firstChild.append(menuitem)
  }
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
  if (visible === undefined || visible.length === 0) {
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
        beforeDefs = ['<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 金句卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span style="color: #bbbbbb;">&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 金句卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>原文</strong>：<span>&lt;摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 金句卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>原文</strong>：<span>${text ? text : "&lt;摘抄&gt;"}</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Quotes Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Original</strong>: <span>${text ? text : "&lt;extract&gt;"}</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.quotescard'), item, beforeDefs, def)
        break
      case 'concept':
        beforeDefs = ['<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 概念卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span style="color: #bbbbbb;">&lt;姓名&gt;</span>, <span style="color: #bbbbbb;">&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span style="color: #bbbbbb;">&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 概念卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p>- <strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p>- <strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 概念卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p><strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 概念卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>提出者</strong>：<span>&lt;姓名&gt;</span>, <span>&lt;年份&gt;</span></p><p><strong>描述</strong>：<span>&lt;具体描述或摘抄&gt;</span></p><p><strong>复述</strong>：<span>&lt;用自己的话复述&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Concept Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Presenter</strong>: <span>&lt;:Name&gt;</span>, <span>&lt;Year&gt;</span></p><p><strong>Description</strong>: <span>&lt;Describe or extract&gt;</span></p><p><strong>Repeat</strong>: <span>&lt;Repeat it in your own words&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.conceptcard'), item, beforeDefs, def)
        break
      case 'character':
        beforeDefs = ['<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 人物卡 - <span style="color: #bbbbbb;">&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span style="color: #bbbbbb;">&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>成就</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;*&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：</p><p>- <strong>成就</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 人物卡 - <span>&lt;姓名&gt;</span></h3>\\n<p>- <strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p>- <strong>作品</strong>：</p><p>- <strong>成就</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 人物卡 - <span>&lt;姓名&gt;</span></h1>\\n<p><strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p><strong>作品</strong>：</p><p><strong>成就</strong>：</p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 人物卡 - <span>&lt;姓名&gt;</span></h1>\\n<p><strong>简介</strong>：<span>&lt;出生日期，出生地，毕业院校，生平等&gt;</span></p><p><strong>作品</strong>：</p><p><strong>成就</strong>：</p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Personage Card - <span>&lt;Name&gt;</span></h1>\\n<p><strong>Introductory</strong>: <span>&lt;Date of birth, place of birth, university, biography, etc&gt;</span></p><p><strong>Works</strong>: </p><p><strong>Achievement</strong>: </p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.personagecard'), item, beforeDefs, def)
        break
      case 'not_commonsense':
        beforeDefs = ['<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 反常识卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span style="color: #bbbbbb;">&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span style="color: #bbbbbb;">&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span style="color: #bbbbbb;">&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 反常识卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p>- <strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p>- <strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 反常识卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p><strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 反常识卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>常识</strong>：<span>&lt;认知中的常识&gt;</span></p><p><strong>反常识</strong>：<span>&lt;需要刷新的认知&gt;</span></p><p><strong>启发</strong>：<span>&lt;有什么启发&gt;</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Uncommonsense Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Commonsense</strong>: <span>&lt;Common sense in cognition&gt;</span></p><p><strong>Uncommonsense</strong>: <span>&lt;Perceptions that need to be refreshed&gt;</span></p><p><strong>Implications</strong>: <span>&lt;What are the implications&gt;</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>标签</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.uncommonsensecard'), item, beforeDefs, def)
        break
      case 'skill':
        beforeDefs = ['<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 技巧卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 技巧卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 技巧卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 技巧卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>步骤</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Skill Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Steps</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.skillcard'), item, beforeDefs, def)
        break
      case 'structure':
        beforeDefs = ['<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 结构卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span style="color: #bbbbbb;">&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span style="color: #bbbbbb;">...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 结构卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p>- <strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 结构卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 结构卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>描述</strong>：<span>&lt;描述作用&gt;</span></p><p><strong>内容</strong>：<br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Structure Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Description</strong>: <span>&lt;Describe the role&gt;</span></p><p><strong>Content</strong>: <br />&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;<span>...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;<span>...</span></p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.structurecard'), item, beforeDefs, def)
        break
      case 'abstract':
        beforeDefs = ['<h3>## 摘要卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>摘要</strong>：<span>&lt;原文句子&gt;</span></p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
        '<h1>## 摘要卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>摘要</strong>：<span>&lt;原文句子&gt;</span></p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 摘要卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>摘要</strong>：<span>${text ? text : "&lt;原文句子&gt;"}</span></p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Abstract Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Abstract</strong>：<span>${text ? text : "&lt;The original sentence&gt;"}</span></p><p><strong>Reference</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>：[none]</p><p><strong>Date</strong>：${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.abstractcard'), item, beforeDefs, def)
        break
      case 'general':
        beforeDefs = ['<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 通用卡 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 通用卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>想法</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h3>## 短文卡 - <span>&lt;标题&gt;</span></h3>\\n<p>- <strong>正文</strong>：</p><p>- <strong>出处</strong>：{authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p>- <strong>标签</strong>：[无]</p><p>- <strong>日期</strong>：{today}</p>',
          '<h1>## 短文卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>正文</strong>：</p><p><strong>出处</strong>：${authors}《{title}》({year}) P<span>&lt;页码&gt;</span></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：{today}</p>']
        def = Zotero.locale.startsWith('zh') ? '<h1>## 短文卡 - <span>&lt;标题&gt;</span></h1>\\n<p><strong>正文</strong>：</p><p><strong>出处</strong>：${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;页码&gt;</span>` : ""}</p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：${today}</p>'
          : '<h1>## Essay Card - <span>&lt;Title&gt;</span></h1>\\n<p><strong>Body</strong>: </p><p><strong>Reference</strong>: ${authors}《${title}》${itemType === "book" ? `(${year}) P<span>&lt;Page&gt;</span>` : ""}</p><p><strong>Tag</strong>: [none]</p><p><strong>Date</strong>: ${today}</p>'
        pref = this.initPref(Zotero.ZotCard.Utils.getString('zotcard.essaycard'), item, beforeDefs, def)
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
  if (Zotero.ZotCard.Utils.confirm(Zotero.ZotCard.Utils.getString('zotcard.resetconfig'))) {
    Zotero.Prefs.clear('zotcard.quotes')
    Zotero.Prefs.clear('zotcard.quotes.visible')
    Zotero.Prefs.clear('zotcard.quotes.label')
    Zotero.Prefs.clear('zotcard.concept')
    Zotero.Prefs.clear('zotcard.concept.visible')
    Zotero.Prefs.clear('zotcard.concept.label')
    Zotero.Prefs.clear('zotcard.character')
    Zotero.Prefs.clear('zotcard.character.visible')
    Zotero.Prefs.clear('zotcard.character.label')
    Zotero.Prefs.clear('zotcard.not_commonsense')
    Zotero.Prefs.clear('zotcard.not_commonsense.visible')
    Zotero.Prefs.clear('zotcard.not_commonsense.label')
    Zotero.Prefs.clear('zotcard.skill')
    Zotero.Prefs.clear('zotcard.skill.visible')
    Zotero.Prefs.clear('zotcard.skill.label')
    Zotero.Prefs.clear('zotcard.structure')
    Zotero.Prefs.clear('zotcard.structure.visible')
    Zotero.Prefs.clear('zotcard.structure.label')
    Zotero.Prefs.clear('zotcard.abstract')
    Zotero.Prefs.clear('zotcard.abstract.visible')
    Zotero.Prefs.clear('zotcard.abstract.label')
    Zotero.Prefs.clear('zotcard.general')
    Zotero.Prefs.clear('zotcard.general.visible')
    Zotero.Prefs.clear('zotcard.general.label')
    Zotero.Prefs.clear('zotcard.card_quantity')
    Zotero.Prefs.clear('zotcard.config.column_edt')

    this.resetCard(1)

    Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.resetsuccessful'))
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

zotcard.newCard = async function (pane, name, stand) {
  var pref = this.initPrefs(name)
  if (!pref) {
    Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.please_configure', 'zotcard.' + name))
    return
  }
  if (!pref.card) {
    Zotero.ZotCard.Utils.warning(`${Zotero.ZotCard.Utils.getString('zotcard.aboutconfig')}
    zotcard.${name}\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.cardtemplate')}
    zotcard.${name}.label\t${Zotero.ZotCard.Utils.getString('zotcard.cardtitle')}
    zotcard.${name}.visible\t${Zotero.ZotCard.Utils.getString('zotcard.visibletitle')}

    ${Zotero.ZotCard.Utils.getString('zotcard.visitwebsite')}: https://github.com/018/zotcard`)
    Zotero.openInViewer(`about:config?filter=zotero.zotcard.${name}`)
    return
  }

  if (stand && !ZoteroPane.getSelectedCollection()) {
    Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.selectcollection'))
  }

  var itemType = ''
  var authors = []
  var title = ''
  var shortTitle = ''
  var archive = ''
  var archiveLocation = ''
  var url = ''
  var date = ''
  var year = ''
  var extra = ''
  var publisher = ''
  var publicationTitle = ''
  var ISBN = ''
  var numPages = ''
  var nowDate = new Date()
  var now = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd HH:mm:ss')
  var today = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd')
  var month = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM')
  var text = ''
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
  if (!stand) {
    var zitem
    if (pane) {
      var reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)
      if (reader) {
        zitem = Zotero.Items.get(Zotero.Items.get(reader.itemID).parentID)
      }
      if (!zitem) {
        Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.unsupported_entries'))
        return
      }

      text = Zotero.getMainWindow().Zotero.ZotCard.Utils.getReaderSelectedText()
    } else {
      var zitems = Zotero.ZotCard.Utils.getSelectedItems('regular')
      if (!zitems || zitems.length <= 0) {
        Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.unsupported_entries'))
        return
      }
      if (zitems.length !== 1) {
        Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.only_one'))
        return
      }
      zitem = zitems[0]
    }

    var creatorsData = zitem.getCreators()
    var creatorTypeAuthor = Zotero.CreatorTypes.getID('author')
    for (let i = 0; i < creatorsData.length; i++) {
      let creatorTypeID = creatorsData[i].creatorTypeID
      let creatorData = creatorsData[i]
      if (creatorTypeID === creatorTypeAuthor) {
        authors.push(creatorData.lastName || creatorData.firstName)
        if (isDebug()) Zotero.debug('creatorData: ' + JSON.stringify(creatorData))
      }
    }

    itemType = zitem.itemType
    title = zitem.getField('title')
    shortTitle = zitem.getField('shortTitle')
    archive = zitem.getField('archive')
    archiveLocation = zitem.getField('archiveLocation')
    url = zitem.getField('url')
    date = zitem.getField('date')
    year = zitem.getField('year')
    extra = zitem.getField('extra')
    publisher = zitem.getField('publisher')
    publicationTitle = zitem.getField('publicationTitle')
    ISBN = zitem.getField('ISBN')
    numPages = zitem.getField('numPages')
  }

  var item = new Zotero.Item('note')
  var content = pref.card

  let econtent = 'function jscontent() {var itemType = "' + itemType +
    '", authors = [' + authors.map(e => '"' + e + '"').join(',') + '], title = "' + title +
    '", shortTitle = "' + shortTitle +
    '", archive = "' + archive +
    '", archiveLocation = "' + archiveLocation +
    '", url = "' + url +
    '", date = "' + date +
    '", year = "' + year +
    '", dayOfYear = ' + dayOfYear +
    ', weekOfYear = ' + weekOfYear +
    ', week = "' + week +
    '", week_en = "' + weekEn +
    '", extra = "' + extra +
    '", publisher = "' + publisher +
    '", publicationTitle = "' + publicationTitle +
    '", ISBN = "' + ISBN +
    '", numPages = ' + (numPages || '0') +
    ', now = "' + now +
    '", today = "' + today +
    '", month = "' + month +
    '", text = "' + text + '"; return `' + content + '`}; jscontent()'
  Zotero.debug(econtent)
  content = Zotero.getMainWindow().eval(econtent)
  
  content = content.replace(/\{authors\}/g, authors.toString())
    .replace(/\{itemType\}/g, itemType)
    .replace(/\{title\}/g, title)
    .replace(/\{now\}/g, now)
    .replace(/\{today\}/g, today)
    .replace(/\{month\}/g, month)
    .replace(/\{dayOfYear\}/g, dayOfYear)
    .replace(/\{weekOfYear\}/g, weekOfYear)
    .replace(/\{week\}/g, week)
    .replace(/\{week_en\}/g, weekEn)
    .replace(/\{shortTitle\}/g, shortTitle)
    .replace(/\{archive\}/g, archive)
    .replace(/\{archiveLocation\}/g, archiveLocation)
    .replace(/\{url\}/g, url)
    .replace(/\{date\}/g, date)
    .replace(/\{year\}/g, year)
    .replace(/\{extra\}/g, extra)
    .replace(/\{publisher\}/g, publisher)
    .replace(/\{publicationTitle\}/g, publicationTitle)
    .replace(/\{ISBN\}/g, ISBN)
    .replace(/\{numPages\}/g, numPages)
    .replace(/\\n/g, '\n')
    .replace(/\{text\}/g, text)
  item.setNote(content)
  if (stand) {
    item.addToCollection(ZoteroPane.getSelectedCollection().id)
  } else {
    item.parentKey = zitem.getField('key')
  }
  item.libraryID = ZoteroPane.getSelectedLibraryID()
  var itemID = await item.saveTx()
  if (isDebug()) Zotero.debug('item.id: ' + itemID)
  if (pane) {
    var reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)
    if (reader) {
      reader._window.ZoteroContextPane.update()
    }
  } else {
    ZoteroPane.selectItem(itemID)
    document.getElementById('zotero-note-editor').focus()
  }
}

zotcard.quotes = function (pane) {
  this.newCard(pane, 'quotes')
}

zotcard.concept = function (pane) {
  this.newCard(pane, 'concept')
}

zotcard.character = function (pane) {
  this.newCard(pane, 'character')
}

zotcard.not_commonsense = function (pane) {
  this.newCard(pane, 'not_commonsense')
}

zotcard.skill = function (pane) {
  this.newCard(pane, 'skill')
}

zotcard.structure = function (pane) {
  this.newCard(pane, 'structure')
}

zotcard.abstract = function (pane) {
  this.newCard(pane, 'abstract')
}

zotcard.general = function (pane) {
  this.newCard(pane, 'general')
}

zotcard.readcard = function () {
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    Zotero.ZotCard.Utils.warning(Utils.getString('zotcard.only_note'))
    return
  }

  this.showReadCard(zitems, Zotero.ZotCard.Utils.getString('zotcard.yourchoice'))
}

zotcard.readcollectioncard = function () {
  let selectedCollection = ZoteroPane.getSelectedCollection()
  let selectedSavedSearch = ZoteroPane.getSelectedSavedSearch()

  Zotero.showZoteroPaneProgressMeter(Zotero.ZotCard.Utils.getString('zotcard.loding'))
  let callback = (ids, name) => {
    var items = Zotero.Items.get(ids)
    Zotero.debug(`搜索到：${items.length}`)
    var cards = []
    var options = {}
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      if (!item.isNote()) {
        Zotero.debug(`跳过统计。`)
        continue
      }

      let noteTitle = item.getNoteTitle()

      if (['目录', '豆瓣短评', '初步评价'].includes(noteTitle)) {
        Zotero.debug(`${noteTitle}跳过统计。`)
        continue
      }
      let cardItem = Zotero.ZotCard.Utils.toCardItem(item)
      cards.push(cardItem)
      options = Zotero.ZotCard.Utils.refreshOptions(cardItem, options)
      Zotero.updateZoteroPaneProgressMeter((index + 1) / items.length)
    }

    Zotero.hideZoteroPaneOverlays()
    if (cards.length > 0) {
      let options = Zotero.ZotCard.Utils.bulidOptions(cards)
      let io = {
        dataIn: {
          title: name,
          cards: cards,
          options: options
        }
      }

      Zotero.getMainWindow().Zotero.ZotCard.read = io
      Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/read.html' : 'chrome://zoterozotcard/content/read_en.html')
    } else {
      Zotero.ZotCard.Utils.error(Zotero.ZotCard.Utils.getString('zotcard.nocard'))
    }
  }

  Zotero.ZotCard.CardSearcher.search(ZoteroPane.getSelectedLibraryID(), selectedCollection, selectedSavedSearch, callback)
}

zotcard.collectionreport = function () {
  let selectedCollection = ZoteroPane.getSelectedCollection()
  let selectedSavedSearch = ZoteroPane.getSelectedSavedSearch()

  let io = {
    libraryID: ZoteroPane.getSelectedLibraryID(),
    name: '',
    type: ''
  }
  if (selectedCollection) {
    io.type = 'collection'
    io.selectedCollection = selectedCollection
    io.name = selectedCollection.name
  } else if (selectedSavedSearch) {
    io.type = 'savedSearch'
    io.selectedSavedSearch = selectedSavedSearch
    io.name = selectedSavedSearch.name
  } else {
    let lib = Zotero.Libraries.get(io.libraryID)
    io.type = 'library'
    io.name = lib.name
  }

  Zotero.getMainWindow().Zotero.ZotCard.report = io
  Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/report.html' : 'chrome://zoterozotcard/content/report_en.html')
}

zotcard.showReadCard = function (items, title) {
  Zotero.showZoteroPaneProgressMeter(Zotero.ZotCard.Utils.getString('zotcard.loding'))
  var cards = []
  var options = {}
  items.forEach((item, index) => {
    let cardItem = Zotero.ZotCard.Utils.toCardItem(item)
    cards.push(cardItem)
    options = Zotero.ZotCard.Utils.refreshOptions(cardItem, options)
    Zotero.updateZoteroPaneProgressMeter((index + 1) / items.length)
  })

  let io = {
    window: 'read',
    dataIn: {
      title: title,
      cards: cards,
      options: options
    }
  }
  Zotero.hideZoteroPaneOverlays()

  Zotero.getMainWindow().Zotero.ZotCard.read = io
  Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/read.html' : 'chrome://zoterozotcard/content/read_en.html')
}

zotcard.replace = function () {
  window.openDialog(
    'chrome://zoterozotcard/content/replace.xul',
    'replace', 'chrome, centerscreen')
}

zotcard.doReplace = function (target) {
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
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
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
    return
  }

  var notes = ''
  zitems.forEach(zitem => {
    notes += zitem.getNote() + '<br /><br />'
  })
  if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(notes)) {
    Zotero.ZotCard.Utils.error(Zotero.ZotCard.Utils.getString('zotcard.readcard.copythefailure'))
  } else {
    Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.readcard.copysucceeded'))
  }
}

zotcard.copyandcreate = function () {
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
    return
  }
  if (zitems.length !== 1) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_one'))
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
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
    return
  }

  zitems.forEach(zitem => {
    ZoteroPane.openNoteWindow(zitem.id)
  })

  if (zitems.length > 1) {
    this.adjust()
  }
}

zotcard.adjust = function () {
  window.openDialog(
    'chrome://zoterozotcard/content/adjust.xul',
    'zotcard-config', 'chrome, centerscreen',
    {})
}

zotcard.close = function () {
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
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
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
    return
  }
  if (zitems.length !== 1) {
    Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
    return
  }

  let tinifyApiKey = Zotero.Prefs.get('zotcard.config.tinify_api_key')
  if (!tinifyApiKey) {
    Zotero.Prefs.set('zotcard.config.tinify_api_key', '')
    Zotero.ZotCard.Utils.warning(Utils.getString('zotcard.configuretinypng'))
    Zotero.openInViewer(`about:config?filter=zotero.zotcard.config.tinify_api_key`)
    return
  }
  let compressWithWidthAndHeight = Zotero.Prefs.get('zotcard.config.compress_with_width_and_height')
  if (!compressWithWidthAndHeight) {
    compressWithWidthAndHeight = false
    Zotero.Prefs.set('zotcard.config.compress_with_width_and_height', compressWithWidthAndHeight)
  }

  let pw = new Zotero.ProgressWindow()
  pw.changeHeadline(Utils.getString('zotcard.compression'))
  pw.addDescription(Utils.getString('zotcard.choose', zitems.length))
  pw.show()
  var zitem = zitems[0]
  let note = zitem.getNote()
  let matchImages = zitem.getNote().match(/<img.*?src="data:.*?;base64,.*?".*?\/>/g)
  if (matchImages) {
    pw.addLines(`${zitem.getNoteTitle()}: ${Utils.getString('zotcard.includesimages', matchImages.length)}`, `chrome://zotero/skin/tick${Zotero.hiDPISuffix}.png`)
    for (let index = 0; index < matchImages.length; index++) {
      let itemProgress = new pw.ItemProgress(
        `chrome://zotero/skin/spinner-16px${Zotero.hiDPISuffix}.png`,
        Utils.getString('zotcard.imagecompressed', index + 1)
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
            itemProgress.setText(Utils.getString('zotcard.imagecompressionfailed', index + 1) + `${res.error} - ${res.message}`)
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
                itemProgress.setText(Utils.getString('zotcard.imagesize', index + 1) + ` ${res.input.size}${compressWithWidthAndHeight && (width || height) ? ('(' + (width || '') + ',' + (height || '') + ')') : ''}, 压缩成 ${compressWithWidthAndHeight && (width || height) ? image.response.size : res.output.size}, 压缩率: ${res.output.ratio}。`)
                itemProgress.setProgress(100)
              })
            } else if (image.status === 0) {
              itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
              itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + ` - Net Error。`)
              itemProgress.setProgress(100)
            } else {
              itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
              itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + `，${image.status} - ${image.statusText}`)
              itemProgress.setProgress(100)
            }
          }
        } else if (request.status === 0) {
          itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
          itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + ` - Net Error。`)
          itemProgress.setProgress(100)
        } else {
          itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
          itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + `，${image.status} - ${image.statusText}`)
          itemProgress.setProgress(100)
        }
      } catch (e) {
        Zotero.debug(e)
        itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
        itemProgress.setText(Utils.getString('zotcard.imagecompressionfailed', index + 1) + e)
        itemProgress.setProgress(100)
      }
    }
  } else {
    pw.addLines(`${zitem.getNoteTitle()} ${Utils.getString('zotcard.noimagesincluded')}`, `chrome://zotero/skin/warning${Zotero.hiDPISuffix}.png`)
  }
  pw.addDescription(Utils.getString('uread.click_on_close'))
}

zotcard.print = async function () {
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
    return
  }
  if (zitems.length !== 1) {
    Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
    return
  }

  var zitem = zitems[0]
  Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer('chrome://zoterozotcard/content/cardcontent.html?id=' + zitem.id)
}


zotcard.notesourcecode = async function () {
  var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
    return
  }
  if (zitems.length !== 1) {
    Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
    return
  }

  var zitem = zitems[0]
  let io = {
    dataIn: zitem.id
  }

  window.openDialog('chrome://zoterozotcard/content/notesourcecode.xul', 'notesourcecode', 'chrome,modal,centerscreen,scrollbars', io)
}

zotcard.config = function () {
  Zotero.ZotCard.Utils.warning(`${Zotero.ZotCard.Utils.getString('zotcard.aboutconfig')}
  ${Zotero.ZotCard.Utils.getString('zotcard.default')}：
  zotcard.abstract\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.abstractcard')}
  zotcard.quotes\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.quotescard')}
  zotcard.concept\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.conceptcard')}
  zotcard.character\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.personagecard')}
  zotcard.not_commonsense\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.uncommonsensecard')}
  zotcard.skill\t\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.skillcard')}
  zotcard.structure\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.structurecard')}
  zotcard.general\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.essaycard')}
  
${Zotero.ZotCard.Utils.getString('zotcard.custom')}：
  zotcard.card_quantity\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.customizecards')}
  zotcard.card1\t\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.cardtemplate')}
  ...
  
  ${Zotero.ZotCard.Utils.getString('zotcard.visitwebsite')}: https://github.com/018/zotcard`)

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
      Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.backupsucceeded'))
    }
  }.bind(this))
}

zotcard.restore = function () {
  let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
  fp.init(window, Zotero.ZotCard.Utils.getString('zotcard.restore'), Ci.nsIFilePicker.modeOpen)
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
              json.abstract && json.abstract.card &&
              json.general && json.general.card &&
              json.card_quantity !== undefined) {
            for (let index = 0; index < json.card_quantity; index++) {
              let name = `card${index + 1}`
              if (!json[name]) {
                Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.restorefailed'))
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
            Zotero.Prefs.set(`zotcard.abstract`, json.abstract.card)
            Zotero.Prefs.set(`zotcard.abstract.visible`, json.abstract.visible === undefined ? true : json.abstract.visible)
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
            Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.restoresucceeded') + json.last_updated)
          } else {
            Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.contentcorrupted'))
          }
        } catch (e) {
          Zotero.ZotCard.Utils.warning(e)
        }
      } else {
        Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.filenocontent'))
      }
    }
  }.bind(this))
}

zotcard.transitionstyle = function () {
  let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
  fp.init(window, Zotero.ZotCard.Utils.getString('zotcard.restore'), Ci.nsIFilePicker.modeOpen)
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
            Zotero.Prefs.set(`zotcard.abstract`, json.abstract.card)
            Zotero.Prefs.set(`zotcard.abstract.visible`, json.abstract.visible === undefined ? true : json.abstract.visible)
            Zotero.Prefs.set(`zotcard.general`, json.general.card)
            Zotero.Prefs.set(`zotcard.general.visible`, json.general.visible === undefined ? true : json.general.visible)

            Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.changingsucceeded') + json.last_updated)
          } else {
            Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.contentcorrupted'))
          }
        } catch (e) {
          Zotero.ZotCard.Utils.warning(e)
        }
      } else {
        Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.filenocontent'))
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

zotcard.effectNoteCss = function () {
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
  if (editor) {
    var doc = editor.contentDocument
    var head = doc.getElementsByTagName('head')[0]
    var style = doc.createElement('style')
    style.innerHTML = css
    head.appendChild(style)
  }
}

zotcard.refreshLineHeigthMenuItemChecked = function () {
  let height = this.getNoteLineHeight()
  for (let menuitem of document.querySelectorAll(`#note-line-heigth-menu menuitem`)) {
    if (menuitem.getAttribute('line-height') === height) {
      menuitem.setAttribute('checked', true)
    } else {
      menuitem.removeAttribute('checked')
    }
  }
}

zotcard.noteLineHeight = function (height) {
  Zotero.debug(`height = ${height}`)
  let val = Zotero.Prefs.get('note.css')
  if (val) {
    if (height) {
      if (val.match(/body +{ line-height: .*?; }/g)) {
        val = val.replace(/line-height: (.*?);/, `line-height: ${height};`)
      } else {
        val += ` body { line-height: ${height}; }`
      }
    } else {
      val = val.replace(/body +{ line-height: .*?; }/g, '')
    }
  } else {
    if (height) {
      val = `body { line-height: ${height}; }`
    }
  }
  Zotero.debug(`note.css = ${val}`)
  Zotero.Prefs.set('note.css', val)

  this.refreshLineHeigthMenuItemChecked()
  this.effectNoteCss()
}

zotcard.getNoteLineHeight = function () {
  let val = Zotero.Prefs.get('note.css')
  if (val) {
    let match = val.match(/body +{ line-height: (.*?); }/)
    if (match) {
      return match[1].split(';')[0]
    }
  }
  return '1'
}

zotcard.refreshParagraphSpacingMenuItemChecked = function () {
  let height = this.getNoteParagraphSpacing()
  for (let menuitem of document.querySelectorAll(`#note-paragraph-spacing-menu menuitem`)) {
    if (menuitem.getAttribute('paragraph-spacing') === height) {
      menuitem.setAttribute('checked', true)
    } else {
      menuitem.removeAttribute('checked')
    }
  }
}

zotcard.noteParagraphSpacing = function (paragraphSpacing) {
  Zotero.debug(`paragraphSpacing = ${paragraphSpacing}`)
  let val = Zotero.Prefs.get('note.css')
  if (val) {
    if (paragraphSpacing) {
      if (val.match(/p +{ padding: 0; margin: (\d*)px 0; }/g)) {
        val = val.replace(/p +{ padding: 0; margin: (\d*)px 0; }/, `p { padding: 0; margin: ${paragraphSpacing}px 0; }`)
      } else {
        val += ` p { padding: 0; margin: ${paragraphSpacing}px 0; }`
      }
    } else {
      val = val.replace(/p +{ padding: 0; margin: (\d*)px 0; }/g, '')
    }
  } else {
    if (paragraphSpacing) {
      val = `p { padding: 0; margin: ${paragraphSpacing}px 0; }`
    }
  }
  Zotero.debug(`note.css = ${val}`)
  Zotero.Prefs.set('note.css', val)

  this.refreshParagraphSpacingMenuItemChecked()
  this.effectNoteCss()
}

zotcard.getNoteParagraphSpacing = function () {
  let val = Zotero.Prefs.get('note.css')
  if (val) {
    let match = val.match(/p +{ padding: 0; margin: (\d*)px 0; }/)
    if (match) {
      return match[1].split(';')[0]
    }
  }
  return ''
}

zotcard.noteBGColor = function (color) {
  let val = Zotero.Prefs.get('note.css')
  if (val) {
    if (color) {
      if (val.match(/body +{ background-color: .*?; }/g)) {
        val = val.replace(/background-color: (.*?);/, `background-color: ${color};`)
      } else {
        val += ` body { background-color: ${color}; }`
      }
    } else {
      val = val.replace(/body +{ background-color: .*?; }/g, '')
    }
  } else {
    if (color) {
      val = `body { background-color: ${color}; }`
    }
  }
  Zotero.Prefs.set('note.css', val)

  this.effectNoteCss()
}

zotcard.resetNoteBGColor = function () {
  this.noteBGColor()
  Zotero.ZotCard.Utils.promptForRestart(Zotero.ZotCard.Utils.getString('zotcard.resetnotebackground'))
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

if (typeof window !== 'undefined') {
  window.addEventListener('load', function (e) { zotcard.init() }, false)

  // API export for Zotero UI
  // Can't imagine those to not exist tbh
  if (!window.Zotero) window.Zotero = {}
  if (!window.Zotero.ZotCard) window.Zotero.ZotCard = {}
  // note sure about any of this
  window.Zotero.ZotCard.getNoteLineHeight = function () { return zotcard.getNoteLineHeight() }
  window.Zotero.ZotCard.getNoteParagraphSpacing = function () { return zotcard.getNoteParagraphSpacing() }


  window.Zotero.ZotCard.quotes = function (pane) { zotcard.quotes(pane) }
  window.Zotero.ZotCard.concept = function (pane) { zotcard.concept(pane) }
  window.Zotero.ZotCard.character = function (pane) { zotcard.character(pane) }
  window.Zotero.ZotCard.not_commonsense = function (pane) { zotcard.not_commonsense(pane) }
  window.Zotero.ZotCard.skill = function (pane) { zotcard.skill(pane) }
  window.Zotero.ZotCard.structure = function (pane) { zotcard.structure(pane) }
  window.Zotero.ZotCard.abstract = function (pane) { zotcard.abstract(pane) }
  window.Zotero.ZotCard.general = function (pane) { zotcard.general(pane) }

  window.Zotero.ZotCard.readcard = function () { zotcard.readcard() }
  window.Zotero.ZotCard.replace = function () { zotcard.replace() }
  window.Zotero.ZotCard.doReplace = function () { zotcard.doReplace() }
  window.Zotero.ZotCard.copy = function () { zotcard.copy() }
  window.Zotero.ZotCard.copyandcreate = function () { zotcard.copyandcreate() }
  window.Zotero.ZotCard.open = function () { zotcard.open() }
  window.Zotero.ZotCard.adjust = function () { zotcard.adjust() }
  window.Zotero.ZotCard.close = function () { zotcard.close() }
  window.Zotero.ZotCard.closeall = function () { zotcard.closeall() }
  window.Zotero.ZotCard.compressimg = function () { zotcard.compressimg() }
  window.Zotero.ZotCard.print = function () { zotcard.print() }
  window.Zotero.ZotCard.notesourcecode = function () { zotcard.notesourcecode() }
  
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

  window.Zotero.ZotCard.readcollectioncard = function () { zotcard.readcollectioncard() }
  window.Zotero.ZotCard.collectionreport = function () { zotcard.collectionreport() }
  window.Zotero.ZotCard.noteLineHeight = function (height) { zotcard.noteLineHeight(height) }
  window.Zotero.ZotCard.noteParagraphSpacing = function (paragraphSpacing) { zotcard.noteParagraphSpacing(paragraphSpacing) }
}

if (typeof module !== 'undefined') module.exports = zotcard
