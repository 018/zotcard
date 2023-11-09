if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Utils) Zotero.ZotCard.Utils = {};

Zotero.ZotCard.Utils = Object.assign(Zotero.ZotCard.Utils, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Utils inited.');
	},

  afterRun(invoke, duration) {
    Zotero.Promise.delay(duration).then(invoke);
  },

  TimedRun(invoke, duration) {
    return setInterval(invoke, duration);
  },

  clearTimedRun(interval) {
    clearInterval(interval);
  },

  // 0.32433 -> 32.4
  scale(number, n) {
    return (number.toFixed(n + 1) * 100).toFixed(n).toString().replace(/\.0*$/g, '');
  },

  // 1024 -> 1KB
  displayStore(size) {
    var data = "";
    if (size < 0.1 * 1024) { //如果小于0.1KB转化成B  
      data = size.toFixed(2).replace(/\.0*$/g, '') + "B";
    } else if (size < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB  
      data = (size / 1024).toFixed(2).replace(/\.0*$/g, '') + "KB";
    } else if (size < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
      data = (size / (1024 * 1024)).toFixed(2).replace(/\.0*$/g, '') + "MB";
    } else {
      data = (size / (1024 * 1024 * 1024)).toFixed(2).replace(/\.0*$/g, '') + "GB";
    }
    return data;
  },


  version() {
    return parseInt(Zotero.version.substr(0, 1))
  },

  getCurrentUsername() {
    return Zotero.ZotCard.Prefs.get('sync.server.username', Zotero.Users.getCurrentUsername());
  },

  getUrlParam(url, name) {
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
    reader.onload(e) = function () {
      callback(e.target.result)
    }
    reader.readAsDataURL(blob)
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
    return ww.openWindow(null, uri, null, features ? features : `menubar=yes,toolbar=no,location=no,scrollbars,centerscreen,resizable,height=${screen.availHeight},width=${screen.availWidth}`, null)
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
    return { displayTitle, title, content, titleindex }
  }
});