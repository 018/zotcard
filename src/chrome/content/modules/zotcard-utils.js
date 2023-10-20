if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Utils) Zotero.ZotCard.Utils = {};

Zotero.ZotCard.Utils = Object.assign(Zotero.ZotCard.Utils, {

  afterRun(invoke, duration) {
    setTimeout(invoke, duration);
  },

  version() {
    return parseInt(Zotero.version.substr(0, 1))
  },

  getCurrentUsername () {
    return Zotero.ZotCard.Prefs.get('sync.server.username', Zotero.Users.getCurrentUsername());
  },
  
  getParam(url, name) {
    if (!url) return ''
  
    var src = new RegExp('[?&]' + name + '=([^&#]*)').exec(url)
  
    /* eslint-disable no-undef */
    return src && src[1] ? src[1] : ''
  },
  
  eqisbn(val1, val2) {
    if (!val1 || (val1.length !== 13 && val1.length !== 10) || !val2 || (val2.length !== 13 && val2.length !== 10)) return false
  
    let no1 = this.getISBNNo(val1)
    let no2 = this.getISBNNo(val2)
    return no1 === no2
  },
  
  getISBNNo(val) {
    if (!val || (val.length !== 13 && val.length !== 10)) return
  
    if (val.length === 13) {
      return val.substr(3, 9)
    } else if (val.length === 10) {
      return val.substr(0, 9)
    }
  },
  
  opt(val) {
    if (!val) return ''
  
    if (val instanceof Array) {
      if (val.length > 0) {
        return val[0]
      }
    } else {
      return val
    }
  },
  
  async loadDocumentAsync(url, onDone, onError, dontDelete, cookieSandbox) {
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
  },
  
  async requestAsync(url) {
    var xmlhttp = await Zotero.HTTP.request('GET', url)
    return xmlhttp
  },
  
  htmlToText(html) {
    var	nsIFC = Components.classes['@mozilla.org/widget/htmlformatconverter;1'].createInstance(Components.interfaces.nsIFormatConverter);
    var from = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    from.data = html;
    var to = { value: null };
    try {
      nsIFC.convert('text/html', from, from.toString().length, 'text/unicode', to, {});
      to = to.value.QueryInterface(Components.interfaces.nsISupportsString);
      return to.toString();
    } catch (e) {
      return html;
    }
  },
  
  copyHtmlToClipboard(textHtml) {
    var htm,lstring = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString)
    if (!htmlstring) {
      Zotero.ZotCard.Logger.log('htmlstring is null.')
      return false
    }
    htmlstring.data = textHtml
  
    var tra,ns = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable)
    if (!trans) {
      Zotero.ZotCard.Logger.log('trans is null.')
      return false
    }
  
    trans.addDataFlavor('text/html')
    trans.setTransferData('text/html', htmlstring, textHtml.length * 2)
  
    var cli,pboard = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard)
    if (!clipboard) {
      Zotero.ZotCard.Logger.log('clipboard is null.')
      return false
    }
  
    clipboard.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard)
    return true
  },
  
  copyHtmlTextToClipboard(textHtml, text) {
    text = text.replace(/\r\n/g, '\n')
    textHtml = textHtml.replace(/\r\n/g, '\n')
  
    // copy to clipboard
    let transferable = Components.classes['@mozilla.org/widget/transferable;1']
      .createInstance(Components.interfaces.nsITransferable)
    let clipboardService = Components.classes['@mozilla.org/widget/clipboard;1']
      .getService(Components.interfaces.nsIClipboard)
  
    // Add Text
    let str = Components.classes['@mozilla.org/supports-string;1']
      .createInstance(Components.interfaces.nsISupportsString)
    str.data = text
    transferable.addDataFlavor('text/unicode')
    transferable.setTransferData('text/unicode', str, text.length * 2)
  
    // Add HTML
    str = Components.classes['@mozilla.org/supports-string;1']
      .createInstance(Components.interfaces.nsISupportsString)
    str.data = textHtml
    transferable.addDataFlavor('text/html')
    transferable.setTransferData('text/html', str, textHtml.length * 2)
  
    clipboardService.setData(
      transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard
    )
  },
  
  copyTextToClipboard(text) {
    text = text.replace(/\r\n/g, '\n')
    // copy to clipboard
    let transferable = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable)
    let clipboardService = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard)
  
    // Add Text
    let str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    str.data = text
    transferable.addDataFlavor('text/unicode')
    transferable.setTransferData('text/unicode', str, text.length * 2)
  
    clipboardService.setData(
      transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard
    )
  },
  
  getClipboard() {
    return Zotero.Utilities.Internal.getClipboard("text/unicode")
  },
  
  dataURItoBlob(dataURI) {
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
  },
  
  blobToDataURI(blob, callback) {
    var reader = new FileReader()
    reader.onload(e) = function() {
      callback(e.target.result)
    }
    reader.readAsDataURL(blob)
  },
  
  hangzi(html) {
    var content = Zotero.ZotCard.Utils.htmlToText(html)
    Zotero.debug(`zotcard@content: ${content}`)
    let m1 = content.match(/[\u4E00-\u9FA5]/g)
    let m2 = content.match(/[\u9FA6-\u9FEF]/g)
    let m3 = content.match(/\w+/g)
    let l1 = m1 ? m1.length : 0
    let l2 = m2 ? m2.length : 0
    let l3 = m3 ? m3.length : 0
    return l1 + l2 + l3
  },
  
  lines(html) {
    var content = Zotero.ZotCard.Utils.htmlToText(html)
    if (content) {
      let m = content.match(/\n/g)
      let l = m ? m.length + 1 : 1
      return l
    } else {
      return 0
    }
  },
  
  async loadAttachmentImg(note) {
    let noteContent = note.getNote()
    let doc = new DOMParser().parseFromString(noteContent, 'text/html')
    let imgs = doc.querySelectorAll('img[data-attachment-key]')
    if (imgs.length === 0) {
      Zotero.debug('zotcard@loadAttachmentImg no has imgs.')
      return {
        id: note.id,
        note: noteContent
      }
    }
  
    for (let img of imgs) {
      let attachmentKey = img.getAttribute('data-attachment-key')
      if (attachmentKey) {
        let attachment = Zotero.Items.getByLibraryAndKey(note.libraryID, attachmentKey)
        if (attachment && attachment.parentID == note.id) {
          let dataURI = await attachment.attachmentDataURI
          img.setAttribute('src', dataURI)
        }
      }
      img.removeAttribute('data-attachment-key')
    }
    Zotero.debug('zotcard@loadAttachmentImg: ' + doc.body.innerHTML.length)
    return {
      id: note.id,
      note: doc.body.innerHTML
    }
  },
  
  attachmentExistsImg(noteContent) {
    return noteContent.includes('data-attachment-key')
  },
  
  toCardItem(note) {
    let noteTitle = note.getNoteTitle()
    let noteContent = note.getNote()
  
    let match3 = noteTitle.match('[\u4e00-\u9fa5]+卡')
    if (!match3) {
      match3 = noteTitle.match('[a-zA-Z0-9 ]+Card')
    }
    let cardtype = match3 ? match3[0].trim() : Zotero.ZotCard.L10ns.getString('zotcard.other')
  
    let author = Zotero.ZotCard.Utils.getCardItemValue(noteContent, Zotero.ZotCard.L10ns.getString('zotcard.author'))
    let tags = Zotero.ZotCard.Utils.getCardItemValue(noteContent, Zotero.ZotCard.L10ns.getString('zotcard.tag')).split(/[\[ \],，]/).filter(e => e && e !== Zotero.ZotCard.L10ns.getString('zotcard.none'))
  
    note.getTags().forEach(tag => {
      tags.push(tag.tag)
    })
  
    return {
      id: note.id,
      key: note.key,
      title: noteTitle,
      type: cardtype,
      date: Zotero.ZotCard.Utils.cardDate(note),
      tags: ta,gs,
      note: noteContent,
      words: hangzi(noteContent),
      author: author,
      dateAdded: Zotero.ZotCard.DateTimes.sqlToDate(note.dateAdded, 'yyyy-MM-dd HH:mm:ss'),
      dateModified: Zotero.ZotCard.DateTimes.sqlToDate(note.dateModified, 'yyyy-MM-dd HH:mm:ss')
    }
  },
  
  // 标签: [无] [v1]  => [无, v1]
  getCardItemValue(noteContent, name) {
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
  },
  
  refreshOptions(cardItem, options) {
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
  
    _calculateOptionItem(options.cardtypes, cardItem.type)
    if (cardItem.author) {
      _calculateOptionItem(options.cardauthors, cardItem.author)
    }
  
    if (cardItem.tags.length === 0) {
      _calculateOptionItem(options.cardtags, '无')
    } else {
      let, diff = cardItem.tags.filter(e => !options.cardtags.includes(e))
      diff.forEach(element => {
        _calculateOptionItem(options.cardtags, element)
      })
    }
  
    return options
  },
  
  _calculateOptionItem(items, name) {
    let filters = items.filter(e => e.name === name)
    if (filters && filters.length > 0) {
      filters[0].count = filters[0].count + 1
    } else {
      items.push({
        name: name,
        count: 1
      })
    }
  },
  
  bulidOptions(cards) {
    let options = {}
    cards.forEach(element => {
      options = Zotero.ZotCard.Utils.refreshOptions(element, options)
    })
    return options
  },
  
  cardDate(item) {
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
        dateString = Zotero.ZotCard.DateTimes.sqlToDate(item.dateAdded, 'yyyy-MM-dd')
      }
    } else {
      let match2 = match1[0].match(/\d{4}[-/\u5e74.]\d{1,2}[-/\u6708.]\d{1,2}\u65e5{0,1}/g)
      Zotero.debug(`${match2}`)
      dateString = match2[0].replace(/\u5e74|\u6708|\./g, '-').replace(/\u65e5/g, '')
    }
    let now = new Date(dateString)
    return Zotero.ZotCard.DateTimes.formatDate(now, 'yyyy-MM-dd')
  },
  
  swap(array, index1, index2) {
    let e = array[index1]
    array[index1] = array[index2]
    array[index2] = e
  },
  
  clearShadowAndBorder(note) {
    let newNote = note
    let match1 = note.match(/^<div.*style=.*box-shadow:.*?>/g)
    let match2 = note.match(/^<div.*style=.*border-radius:.*?>/g)
    if (match1 && match2 && match1[0] === match2[0]) {
      newNote = note.replace(match1[0], match1[0].replace(/style=".*?"/g, ''))
    }
    return newNote
  },
  
  promptForRestart(message) {
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
  },
  
  openInViewer(uri, features) {
    var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher)
    return ww.openWindow(null, uri, null, features ? features : `menubar=yes,toolbar=no,location=no,scrollbars,centerscreen,resizable,,height=${screen.availHeight},width=${screen.availWidth}`, null)
  },
  
  getGroupIDByKey(key) {
    var groups = Zotero.Groups.getAll()
    var groupID
    for (let index = 0; index < groups.length; index++) {
      const element = groups[index];
      if (Zotero.Items.getIDFromLibraryAndKey(element.libraryID, key)) {
        groupID = element.id
        break
      }
    }
    
    return groupID
  },
  
  async loadAnnotationImg(annotation) {
    let file = Zotero.Annotations.getCacheImagePath(annotation)
    if (await OS.File.exists(file)) {
      let img = await Zotero.File.generateDataURI(file, 'image/png')
      return img
    }
  },
  
  resolveNote(note) {
    let content = ''
    let title = ''
    let titleindex = -1
    let displayTitle = note.getDisplayTitle()
    let matchs = note.getNote().match(/\<(h\d)\>((?!<\/h\d>).)*?\<\/h\d\>/)
    if (matchs) {
      title = matchs[0]
      content = note.getNote().replace(matchs[0], '')
      titleindex = matchs.index
    } else {
      content = note.getNote()
      titleindex = -1
    }
    return {displayTitle, title, content, titleindex}
  }
});