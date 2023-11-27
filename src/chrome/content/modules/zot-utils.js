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
    if (!n) {
      n = 0;
    }
    return (number.toFixed(n + 1) * 100).toFixed(n).toString().replace(/\.0*$/g, '');
  },

  // 1024 -> 1KB
  displayStore(size) {
    var value;
    var unit;
    if (size < 0.1 * 1024) { //如果小于0.1KB转化成B  
      value = size.toFixed(2).replace(/\.0*$/g, '');
      unit = 'B';
    } else if (size < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB  
      value = (size / 1024).toFixed(2).replace(/\.0*$/g, '');
      unit = 'KB';
    } else if (size < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
      value = (size / (1024 * 1024)).toFixed(2).replace(/\.0*$/g, '');
      unit = 'MB';
    } else {
      value = (size / (1024 * 1024 * 1024)).toFixed(2).replace(/\.0*$/g, '');
      unit = 'GB';
    }
    var text = value + unit;
    return {value, unit, text};
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
    reader.readAsDataURL(blob);
  },

  async getImageBlob(path) {
    var imageData = await Zotero.File.getBinaryContentsAsync(path);
    var array = new Uint8Array(imageData.length);
    for (let i = 0; i < imageData.length; i++) {
      array[i] = imageData.charCodeAt(i);
    }
    return new Blob([array], { type: 'image/png' });
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
});