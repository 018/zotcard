'use strict'

let noteContent
let noteTitle

function start () {
  Zotero.debug(Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.wordnumbertitle'))
  document.getElementById('wordnumbertitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.wordnumbertitle')
  document.getElementById('fontsizetitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.fontsizetitle')
  document.getElementById('linespacingtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.linespacingtitle')
  document.getElementById('paragraphspacingtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.paragraphspacingtitle')
  document.getElementById('titlestyletitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyletitle')
  document.getElementById('titlestyle_nonetitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_nonetitle')
  document.getElementById('titlestyle_h1title').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_h1title')
  document.getElementById('titlestyle_h2title').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_h2title')
  document.getElementById('titlestyle_h3title').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_h3title')
  document.getElementById('titlestyle_h4title').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_h4title')
  document.getElementById('titlestyle_bodytitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_bodytitle')
  document.getElementById('titlestyle_bodyboldtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.titlestyle_bodyboldtitle')
  document.getElementById('printtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.getString('zotcard.cardcontent.printtitle')

  let id = getQueryVariable('id')
  let note = Zotero.Items.get(id)
  if (note) {
    document.title = note.getNoteTitle()
    noteContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.clearShadowAndBorder(note.getNote())
    noteTitle = note.getNoteTitle()
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
      document.getElementById('titlestyle').value = configJSON.titlestyle
    } else {
      document.getElementById('fontsize').value = Zotero.Prefs.get('note.fontSize')
      document.getElementById('linespacing').value = Zotero.ZotCard.getNoteLineHeight() || '1'
      document.getElementById('paragraphspacing').value = Zotero.Prefs.get('note.fontSize')
      document.getElementById('titlestyle').value = 'sample'
    }

    document.getElementById('readcontent').style.fontSize = document.getElementById('fontsize').value + 'px'
    document.getElementById('readcontent').style.lineHeight = document.getElementById('linespacing').value
    document.querySelectorAll('#readcontent p').forEach(e => e.style.margin = document.getElementById('paragraphspacing').value + 'px 0')
    reftitlestyle()
  } else {
    document.title = '异常'
    document.getElementById('readcontent').innerHTML = '错误的笔记id。'
  }
}

function fontsizechange () {
  let value = document.getElementById('fontsize').value
  document.getElementById('readcontent').style.fontSize = value + 'px'

  saveConfig()
}

function linespacingchange () {
  let value = document.getElementById('linespacing').value
  document.getElementById('readcontent').style.lineHeight = value

  saveConfig()
}

function paragraphspacingchange () {
  let value = document.getElementById('paragraphspacing').value
  document.querySelectorAll('#readcontent p').forEach(e => e.style.margin = value + 'px 0')

  saveConfig()
}

function reftitlestyle () {
  let value = document.getElementById('titlestyle').value
  switch (value) {
    case 'h1':
      titleReplace(`<h1>${noteTitle}</h1>`)
      break
    case 'h2':
      titleReplace(`<h2>${noteTitle}</h2>`)
      break
    case 'h3':
      titleReplace(`<h3>${noteTitle}</h3>`)
      break
    case 'h4':
      titleReplace(`<h4>${noteTitle}</h4>`)
      break
    case 'body':
      titleReplace(`<p>${noteTitle}</p>`)
      break
    case 'bodybold':
      titleReplace(`<p style="font-weight: bold;">${noteTitle}</p>`)
      break
    case 'sample':
    default:
      document.getElementById('readcontent').innerHTML = noteContent
      break
  }
}

function titlestylechange () {
  reftitlestyle()
  saveConfig()
}

function titleReplace (titleHtml) {
  let newNoteContent = ''
  noteContent.split('\n').forEach(line => {
    if (line.replace(/\<.*?\>/g, '') === noteTitle) {
      newNoteContent += titleHtml + '\n'
    } else {
      newNoteContent += line + '\n'
    }
  })
  document.getElementById('readcontent').innerHTML = newNoteContent
}

function saveConfig() {
  let config = {
    fontsize: document.getElementById('fontsize').value,
    linespacing: document.getElementById('linespacing').value,
    paragraphspacing: document.getElementById('paragraphspacing').value,
    titlestyle: document.getElementById('titlestyle').value
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