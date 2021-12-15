'use strict'

function start () {
  let id = getQueryVariable('id')
  let note = Zotero.Items.get(id)
  if (note) {
    document.title = note.getNoteTitle()
    let noteContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.clearShadowAndBorder(note.getNote())
    document.getElementById('words').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.hangzi(noteContent)
    Zotero.debug(noteContent)
    document.getElementById('readcontent').innerHTML = noteContent

    let config = Zotero.Prefs.get('zotcard.config.print')
    Zotero.debug(`config: ${config}`)
    if (config && config.length > 0) {
      let configJSON = JSON.parse(config)
      Zotero.debug(configJSON)
      document.getElementById('fontsize').value = configJSON.fontsize
      document.getElementById('linespacing').value = configJSON.linespacing
      document.getElementById('paragraphspacing').value = configJSON.paragraphspacing
    } else {
      document.getElementById('fontsize').value = Zotero.Prefs.get('note.fontSize')
      document.getElementById('linespacing').value = Zotero.ZotCard.getNoteLineHeight() || '1'
      document.getElementById('paragraphspacing').value = Zotero.Prefs.get('note.fontSize')
    }

    document.getElementById('readcontent').style.fontSize = document.getElementById('fontsize').value + 'px'
    document.getElementById('readcontent').style.lineHeight = document.getElementById('linespacing').value 
    document.querySelectorAll('#readcontent p').forEach(e => e.style.margin = document.getElementById('paragraphspacing').value + 'px 0')
  } else {
    document.title = '异常'
    document.getElementById('readcontent').innerHTML = '错误的笔记id。'
  }
}

function fontsizechange() {
  let value = document.getElementById('fontsize').value
  document.getElementById('readcontent').style.fontSize = value + 'px'

  saveConfig()
}

function linespacingchange() {
  let value = document.getElementById('linespacing').value
  document.getElementById('readcontent').style.lineHeight = value

  saveConfig()
}

function paragraphspacingchange() {
  let value = document.getElementById('paragraphspacing').value
  document.querySelectorAll('#readcontent p').forEach(e => e.style.margin = value + 'px 0')

  saveConfig()
}

function saveConfig() {
  let config = {
    fontsize: document.getElementById('fontsize').value,
    linespacing: document.getElementById('linespacing').value,
    paragraphspacing: document.getElementById('paragraphspacing').value
  }
  Zotero.Prefs.set('zotcard.config.print', JSON.stringify(config))
}

function print1() {
  document.getElementById('header').style.display = 'none'
  window.print()
  
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  var e = wm.getEnumerator('zotero:basicViewer');
  while (e.hasMoreElements()) {
    var w = e.getNext();
    if (w.document.getElementsByTagName('browser')[0].contentDocument.baseURI.includes('cardcontent.html')) {
      w.close()
    }
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
}

window.addEventListener('load', start)