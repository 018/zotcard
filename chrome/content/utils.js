if (!window.Zotero) window.Zotero = {}
if (!window.Zotero.ZotCard) window.Zotero.ZotCard = {}
if (!window.Zotero.ZotCard.Utils) window.Zotero.ZotCard.Utils = {}

window.Zotero.ZotCard.Utils = {
  _bundle: Cc['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://zoterouread/locale/uread.properties')
}

window.Zotero.ZotCard.Utils.warning = function (message) {
  Zotero.alert(null, Zotero.getString('general.warning'), message)
}

window.Zotero.ZotCard.Utils.success = function (message) {
  Zotero.alert(null, Zotero.getString('general.success'), message)
}

window.Zotero.ZotCard.Utils.error = function (message) {
  Zotero.alert(null, Zotero.getString('general.error'), message)
}

window.Zotero.ZotCard.Utils.confirm = function (message) {
  var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
  return ps.confirm(null, Zotero.getString('general.warning'), message)
}

window.Zotero.ZotCard.Utils.getParam = function (url, name) {
  if (!url) return ''

  var src = new RegExp('[?&]' + name + '=([^&#]*)').exec(url)

  /* eslint-disable no-undef */
  return src && src[1] ? src[1] : ''
}

window.Zotero.ZotCard.Utils.eqisbn = function (val1, val2) {
  if (!val1 || (val1.length !== 13 && val1.length !== 10) || !val2 || (val2.length !== 13 && val2.length !== 10)) return false

  let no1 = this.getISBNNo(val1)
  let no2 = this.getISBNNo(val2)
  return no1 === no2
}

window.Zotero.ZotCard.Utils.getISBNNo = function (val) {
  if (!val || (val.length !== 13 && val.length !== 10)) return

  if (val.length === 13) {
    return val.substr(3, 9)
  } else if (val.length === 10) {
    return val.substr(0, 9)
  }
}

window.Zotero.ZotCard.Utils.opt = function (val) {
  if (!val) return ''

  if (val instanceof Array) {
    if (val.length > 0) {
      return val[0]
    }
  } else {
    return val
  }
}

window.Zotero.ZotCard.Utils.getString = function (name, ...params) {
  if (params !== undefined && params.length > 0) {
    return this._bundle.formatStringFromName(name, params, params.length)
  } else {
    return this._bundle.GetStringFromName(name)
  }
}

window.Zotero.ZotCard.Utils.getSelectedItems = function (itemType) {
  var zitems = window.ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    Zotero.debug('window.Zotero.ZotCard.Utils@zitems.length: ' + zitems.length)
    return false
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType]
    }
    var siftedItems = this.siftItems(zitems, itemType)
    Zotero.debug('window.Zotero.ZotCard.Utils@siftedItems.matched: ' + siftedItems.matched.length)
    return siftedItems.matched
  } else {
    return zitems
  }
}

window.Zotero.ZotCard.Utils.siftItems = function (itemArray, itemTypeArray) {
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

window.Zotero.ZotCard.Utils.checkItemType = function (itemObj, itemTypeArray) {
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

window.Zotero.ZotCard.Utils.loadDocumentAsync = async function (url, onDone, onError, dontDelete, cookieSandbox) {
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

window.Zotero.ZotCard.Utils.requestAsync = async function (url) {
  var xmlhttp = await Zotero.HTTP.request('GET', url)
  return xmlhttp
}

window.Zotero.ZotCard.Utils.htmlToText = function (html) {
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

window.Zotero.ZotCard.Utils.copyHtmlToClipboard = function (textHtml) {
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

window.Zotero.ZotCard.Utils.dataURItoBlob = function (dataURI) {
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

window.Zotero.ZotCard.Utils.blobToDataURI = function (blob, callback) {
  var reader = new FileReader()
  reader.onload = function (e) {
    callback(e.target.result)
  }
  reader.readAsDataURL(blob)
}

window.Zotero.ZotCard.Utils.formatDate = function (date, format) {
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

window.Zotero.ZotCard.Utils.hangzi = function (html) {
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

window.Zotero.ZotCard.Utils.lines = function (html) {
  var content = Zotero.ZotCard.Utils.htmlToText(html)
  if (content) {
    let m = content.match(/\n/g)
    let l = m ? m.length + 1 : 1
    return l
  } else {
    return 0
  }
}

window.Zotero.ZotCard.Utils.toCardItem = function (note, date) {
  return {
    id: note.id,
    title: note.getNoteTitle(),
    key: note.key,
    dateAdded: Zotero.ZotCard.Utils.sqlToDate(note.dateAdded, 'yyyy-MM-dd HH:mm:ss'),
    dateModified: Zotero.ZotCard.Utils.sqlToDate(note.dateModified, 'yyyy-MM-dd HH:mm:ss'),
    date: date,
    note: note.getNote()
  }
}

window.Zotero.ZotCard.Utils.cardDate = function (item) {
  let dateString
  let text = Zotero.ZotCard.Utils.htmlToText(item.getNote())
  Zotero.debug(text)
  // let match1 = text.match(/日期[:：] *?(\d{4}[-/年.]\d{1,2}[-/月.]\d{1,2}日{0,1})/g)
  let match1 = text.match(/\u65e5\u671f[:\uff1a] *?(\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1})/g)
  if (!match1) {
    // let match3 = text.match(/日期[:：] *?(\d{8})/g)
    let match3 = text.match(/\u65e5\u671f[:\uff1a] *?(\d{8})/g)
    if (match3) {
      let match4 = match3[0].match(/\d{8}/g)
      Zotero.debug(`${match4}`)
      dateString = `${match4[0].substr(0, 4)}-${match4[0].substr(4, 2)}-${match4[0].substr(6, 2)}`
    } else {
      Zotero.debug(`不包含有效日期，取创建日期。${match3}`)
      dateString = Zotero.ZotCard.Utils.sqlToDate(item.dateAdded, 'yyyy-MM-dd')
    }
  } else {
    // let match2 = match1[0].match(/\d{4}[-/年.]\d{1,2}[-/月.]\d{1,2}日{0,1}/g)
    let match2 = match1[0].match(/\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1}/g)
    Zotero.debug(`${match2}`)
    // dateString = match2[0].replace(/年|月|\./g, '-').replace(/日/g, '')
    dateString = match2[0].replace(/\u5e74|\u6708|\./g, '-').replace(/\u65e5/g, '')
  }
  return dateString
}

window.Zotero.ZotCard.Utils.swap = function (array, index1, index2) {
  let e = array[index1]
  array[index1] = array[index2]
  array[index2] = e
}

window.Zotero.ZotCard.Utils.sqlToDate = function (date, format) {
  let d = Zotero.Date.sqlToDate(date, true)
  let dt = new Date(d - new Date().getTimezoneOffset())
  return format ? Zotero.ZotCard.Utils.formatDate(dt, format) : dt
}

window.Zotero.ZotCard.Utils.sqlToLocale = function (valueText) {
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

window.Zotero.ZotCard.Utils.getSelectedItems = function (itemType) {
  var zitems = window.ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    if (isDebug()) Zotero.debug('zitems.length: ' + zitems.length)
    return false
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType]
    }
    var siftedItems = window.Zotero.ZotCard.Utils.siftItems(zitems, itemType)
    if (isDebug()) Zotero.debug('siftedItems.matched: ' + JSON.stringify(siftedItems.matched))
    return siftedItems.matched
  } else {
    return zitems
  }
}

window.Zotero.ZotCard.Utils.getSelectedItemTypes = function () {
  var zitems = window.ZoteroPane.getSelectedItems()
  if (!zitems.length) {
    if (isDebug()) Zotero.debug('zitems.length: ' + zitems.length)
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

window.Zotero.ZotCard.Utils.siftItems = function (itemArray, itemTypeArray) {
  var matchedItems = []
  var unmatchedItems = []
  while (itemArray.length > 0) {
    if (window.Zotero.ZotCard.Utils.checkItemType(itemArray[0], itemTypeArray)) {
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

window.Zotero.ZotCard.Utils.checkItemType = function (itemObj, itemTypeArray) {
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
