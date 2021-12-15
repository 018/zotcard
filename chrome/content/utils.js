if (!Zotero.getMainWindow().Zotero) Zotero.getMainWindow().Zotero = {}
if (!Zotero.getMainWindow().Zotero.ZotCard) Zotero.getMainWindow().Zotero.ZotCard = {}
if (!Zotero.getMainWindow().Zotero.ZotCard.Utils) Zotero.getMainWindow().Zotero.ZotCard.Utils = {}

Zotero.getMainWindow().Zotero.ZotCard.Utils = {
  _bundle: Cc['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://zoterouread/locale/uread.properties')
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug = function () {
  return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.warning = function (message) {
  Zotero.alert(null, Zotero.getString('general.warning'), message)
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.success = function (message) {
  Zotero.alert(null, Zotero.getString('general.success'), message)
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.error = function (message) {
  Zotero.alert(null, Zotero.getString('general.error'), message)
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.confirm = function (message) {
  var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
  return ps.confirm(null, Zotero.getString('general.warning'), message)
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.getParam = function (url, name) {
  if (!url) return ''

  var src = new RegExp('[?&]' + name + '=([^&#]*)').exec(url)

  /* eslint-disable no-undef */
  return src && src[1] ? src[1] : ''
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.eqisbn = function (val1, val2) {
  if (!val1 || (val1.length !== 13 && val1.length !== 10) || !val2 || (val2.length !== 13 && val2.length !== 10)) return false

  let no1 = this.getISBNNo(val1)
  let no2 = this.getISBNNo(val2)
  return no1 === no2
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.getISBNNo = function (val) {
  if (!val || (val.length !== 13 && val.length !== 10)) return

  if (val.length === 13) {
    return val.substr(3, 9)
  } else if (val.length === 10) {
    return val.substr(0, 9)
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.opt = function (val) {
  if (!val) return ''

  if (val instanceof Array) {
    if (val.length > 0) {
      return val[0]
    }
  } else {
    return val
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.getString = function (name, ...params) {
  if (params !== undefined && params.length > 0) {
    return this._bundle.formatStringFromName(name, params, params.length)
  } else {
    return this._bundle.GetStringFromName(name)
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.getSelectedItems = function (itemType) {
  var zitems = Zotero.getMainWindow().ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    Zotero.debug('Zotero.getMainWindow().Zotero.ZotCard.Utils@zitems.length: ' + zitems.length)
    return false
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType]
    }
    var siftedItems = this.siftItems(zitems, itemType)
    Zotero.debug('Zotero.getMainWindow().Zotero.ZotCard.Utils@siftedItems.matched: ' + siftedItems.matched.length)
    return siftedItems.matched
  } else {
    return zitems
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.siftItems = function (itemArray, itemTypeArray) {
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

Zotero.getMainWindow().Zotero.ZotCard.Utils.checkItemType = function (itemObj, itemTypeArray) {
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

Zotero.getMainWindow().Zotero.ZotCard.Utils.loadDocumentAsync = async function (url, onDone, onError, dontDelete, cookieSandbox) {
  let doc = await new Zotero.Promise(function (resolve, reject) {
    var browser = Zotero.HTTP.loadDocuments(url,
      Zotero.Promise.coroutine(function* () {
        try {
          resolve(browser.contentDocument)
        } catch (e) {
          reject(e)
        } finally {
          Zotero.Browser.deleteHiddenBrowser(browser)
        }
      }),
      onDone,
      onError,
      dontDelete,
      cookieSandbox
    )
  })
  return doc
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.requestAsync = async function (url) {
  var xmlhttp = await Zotero.HTTP.request('GET', url)
  return xmlhttp
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.htmlToText = function (html) {
  var	nsIFC = Components.classes['@mozilla.org/widget/htmlformatconverter;1'].createInstance(Components.interfaces.nsIFormatConverter)
  var from = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString)
  from.data = html
  var to = { value: null }
  try {
    nsIFC.convert('text/html', from, from.toString().length, 'text/unicode', to, {})
    to = to.value.QueryInterface(Components.interfaces.nsISupportsString)
    return to.toString()
  } catch (e) {
    Zotero.debug(e, 1)
    return html
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.copyHtmlToClipboard = function (textHtml) {
  var htmlstring = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString)
  if (!htmlstring) {
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug()) Zotero.debug('htmlstring is null.')
    return false
  }
  htmlstring.data = textHtml

  var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable)
  if (!trans) {
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug()) Zotero.debug('trans is null.')
    return false
  }

  trans.addDataFlavor('text/html')
  trans.setTransferData('text/html', htmlstring, textHtml.length * 2)

  var clipboard = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard)
  if (!clipboard) {
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug()) Zotero.debug('clipboard is null.')
    return false
  }

  clipboard.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard)
  return true
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.dataURItoBlob = function (dataURI) {
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  var byteString = atob(dataURI.split(',')[1])
  var arrayBuffer = new ArrayBuffer(byteString.length)
  var intArray = new Uint8Array(arrayBuffer)
  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }
  return new Blob([intArray], { type: mimeString })
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.blobToDataURI = function (blob, callback) {
  var reader = new FileReader()
  reader.onload = function (e) {
    callback(e.target.result)
  }
  reader.readAsDataURL(blob)
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.formatDate = function (date, format) {
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

Zotero.getMainWindow().Zotero.ZotCard.Utils.hangzi = function (html) {
  var content = Zotero.ZotCard.Utils.htmlToText(html)
  Zotero.debug(`content: ${content}`)
  let m1 = content.match(/[\u4E00-\u9FA5]/g)
  let m2 = content.match(/[\u9FA6-\u9FEF]/g)
  let m3 = content.match(/\w+/g)
  let l1 = m1 ? m1.length : 0
  let l2 = m2 ? m2.length : 0
  let l3 = m3 ? m3.length : 0
  return l1 + l2 + l3
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.lines = function (html) {
  var content = Zotero.ZotCard.Utils.htmlToText(html)
  if (content) {
    let m = content.match(/\n/g)
    let l = m ? m.length + 1 : 1
    return l
  } else {
    return 0
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.toCardItem = function (note) {
  let noteTitle = note.getNoteTitle()
  let noteContent = note.getNote()

  let match3 = noteTitle.match('[\u4e00-\u9fa5]+卡')
  let cardtype = match3 ? match3[0] : '其他'

  let author = Zotero.ZotCard.Utils.getCardItemValue(noteContent, '作者')
  let tags = Zotero.ZotCard.Utils.getCardItemValue(noteContent, '标签').split(/[\[ \],，]/).filter(e => e && e !== '无')

  note.getTags().forEach(tag => {
    tags.push(tag.tag)
  })

  return {
    id: note.id,
    key: note.key,
    title: noteTitle,
    type: cardtype,
    date: Zotero.ZotCard.Utils.cardDate(note),
    tags: tags,
    note: noteContent,
    words: Zotero.getMainWindow().Zotero.ZotCard.Utils.hangzi(noteContent),
    author: author,
    dateAdded: Zotero.ZotCard.Utils.sqlToDate(note.dateAdded, 'yyyy-MM-dd HH:mm:ss'),
    dateModified: Zotero.ZotCard.Utils.sqlToDate(note.dateModified, 'yyyy-MM-dd HH:mm:ss')
  }
}

// 标签: [无] [v1]  => [无, v1]
Zotero.getMainWindow().Zotero.ZotCard.Utils.getCardItemValue = function (noteContent, name) {
  let reg = new RegExp(`(?:^|\n| )${name}[:：](.*)`)
  let match1 = reg.exec(Zotero.ZotCard.Utils.htmlToText(noteContent))
  let content = ''
  if (match1) {
    if (match1[1].match(/[:：]/)) {
      content = match1[1].replace(/[^\s]*[:：].*$/, '').trim()
    } else {
      content = match1[1]
    }
  }
  return content
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.refreshOptions = function (cardItem, options) {
  // options:
  // {
  //    startDate: '',
  //    endDate: '',
  //    cardtypes: [{name: '', count: 0}, ...],
  //    cardtags: [{name: '', count: 0}, ...],
  //    cardauthors: [{name: '', count: 0}, ...]
  // }
  if (!options) {
    options = {}
  }
  options = Object.assign({
    startDate: '',
    endDate: '',
    cardtypes: [],
    cardtags: [],
    cardauthors: []
  }, options)

  if (!options.startDate || cardItem.date < options.startDate) {
    options.startDate = cardItem.date
  }
  if (!options.endDate || cardItem.date > options.endDate) {
    options.endDate = cardItem.date
  }

  Zotero.getMainWindow().Zotero.ZotCard.Utils._calculateOptionItem(options.cardtypes, cardItem.type)
  if (cardItem.author) {
    Zotero.getMainWindow().Zotero.ZotCard.Utils._calculateOptionItem(options.cardauthors, cardItem.author)
  }

  if (cardItem.tags.length === 0) {
    Zotero.getMainWindow().Zotero.ZotCard.Utils._calculateOptionItem(options.cardtags, '无')
  } else {
    let diff = cardItem.tags.filter(e => !options.cardtags.includes(e))
    diff.forEach(element => {
      Zotero.getMainWindow().Zotero.ZotCard.Utils._calculateOptionItem(options.cardtags, element)
    })
  }

  return options
}

Zotero.getMainWindow().Zotero.ZotCard.Utils._calculateOptionItem = function (items, name) {
  let filters = items.filter(e => e.name === name)
  if (filters && filters.length > 0) {
    filters[0].count = filters[0].count + 1
  } else {
    items.push({
      name: name,
      count: 1
    })
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.bulidOptions = function (cards) {
  let options = {}
  cards.forEach(element => {
    options = Zotero.ZotCard.Utils.refreshOptions(element, options)
  })
  return options
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.cardDate = function (item) {
  let dateString
  let noteContent = Zotero.ZotCard.Utils.htmlToText(item.getNote())
  let dateContent = Zotero.ZotCard.Utils.getCardItemValue(noteContent, '日期')
  let match1 = dateContent.match(/\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1}/g)
  if (!match1) {
    let match3 = dateContent.match(/\d{8}/g)
    if (match3) {
      dateString = `${match3[0].substr(0, 4)}-${match3[0].substr(4, 2)}-${match3[0].substr(6, 2)}`
    } else {
      Zotero.debug(`不包含有效日期，取创建日期。${match3}`)
      dateString = Zotero.ZotCard.Utils.sqlToDate(item.dateAdded, 'yyyy-MM-dd')
    }
  } else {
    let match2 = match1[0].match(/\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1}/g)
    Zotero.debug(`${match2}`)
    dateString = match2[0].replace(/\u5e74|\u6708|\./g, '-').replace(/\u65e5/g, '')
  }
  let now = new Date(dateString)
  return Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.swap = function (array, index1, index2) {
  let e = array[index1]
  array[index1] = array[index2]
  array[index2] = e
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.sqlToDate = function (date, format) {
  let d = Zotero.Date.sqlToDate(date, true)
  let dt = new Date(d - new Date().getTimezoneOffset())
  return format ? Zotero.ZotCard.Utils.formatDate(dt, format) : dt
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.sqlToLocale = function (valueText) {
  var date = Zotero.Date.sqlToDate(valueText, true)
  if (date) {
    if (Zotero.Date.isSQLDate(valueText)) {
      date = Zotero.Date.sqlToDate(valueText + ' 12:00:00')
      valueText = date.toLocaleDateString()
    } else {
      valueText = date.toLocaleString()
    }
  } else {
    valueText = ''
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.clearShadowAndBorder = function (note) {
  let newNote = note
  let match1 = note.match(/^<div.*style=.*box-shadow:.*?>/g)
  let match2 = note.match(/^<div.*style=.*border-radius:.*?>/g)
  if (match1 && match2 && match1[0] === match2[0]) {
    newNote = note.replace(match1[0], match1[0].replace(/style=".*?"/g, ''))
  }
  return newNote
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.getSelectedItems = function (itemType) {
  var zitems = Zotero.getMainWindow().ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug()) Zotero.debug('zitems.length: ' + zitems.length)
    return false
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType]
    }
    var siftedItems = Zotero.ZotCard.Utils.siftItems(zitems, itemType)
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug()) Zotero.debug('siftedItems.matched: ' + JSON.stringify(siftedItems.matched))
    return siftedItems.matched
  } else {
    return zitems
  }
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.getSelectedItemTypes = function () {
  var zitems = Zotero.getMainWindow().ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.isDebug()) Zotero.debug('zitems.length: ' + zitems.length)
    return false
  }

  itemTypes = []
  zitems.forEach(zitem => {
    let itemType
    if (zitem.isRegularItem()) {
      itemType = 'regular'
    } else {
      itemType = Zotero.ItemTypes.getName(zitem.itemTypeID)
    }
    if (!itemTypes.includes(itemType)) {
      itemTypes.push(itemType)
    }
  })
  return itemTypes
}

Zotero.getMainWindow().Zotero.ZotCard.Utils.siftItems = function (itemArray, itemTypeArray) {
  var matchedItems = []
  var unmatchedItems = []
  while (itemArray.length > 0) {
    if (Zotero.getMainWindow().Zotero.ZotCard.Utils.checkItemType(itemArray[0], itemTypeArray)) {
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

Zotero.getMainWindow().Zotero.ZotCard.Utils.checkItemType = function (itemObj, itemTypeArray) {
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

Zotero.getMainWindow().Zotero.ZotCard.Utils.promptForRestart = function (message) {
  // Prompt to restart
  var ps = Services.prompt
  var buttonFlags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING + ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING;
  var index = ps.confirmEx(
    null,
    Zotero.getString('general.restartRequired'),
    Zotero.getString('general.restartRequiredForChange', [message]),
    buttonFlags,
    Zotero.getString('general.restartNow'),
    Zotero.getString('general.restartLater'),
    null, null, {}
  )

  if (index === 0) {
    Zotero.Utilities.Internal.quitZotero(true)
  }
}
