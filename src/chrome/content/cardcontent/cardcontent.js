'use strict'

let cards = []

async function start () {
  Zotero.debug(Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.wordnumbertitle'))
  document.getElementById('wordnumbertitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.wordnumbertitle')
  document.getElementById('fontsizetitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.fontsizetitle')
  document.getElementById('linespacingtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.linespacingtitle')
  document.getElementById('paragraphspacingtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.paragraphspacingtitle')
  document.getElementById('titlestyletitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyletitle')
  document.getElementById('titlestyle_nonetitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyle_nonetitle')
  document.getElementById('titlestyle_h1title').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyle_h1title')
  document.getElementById('titlestyle_h2title').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyle_h2title')
  document.getElementById('titlestyle_h3title').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyle_h3title')
  document.getElementById('titlestyle_bodytitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyle_bodytitle')
  document.getElementById('titlestyle_bodyboldtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.titlestyle_bodyboldtitle')
  document.getElementById('pagecsstitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.pagecsstitle')
  document.getElementById('pagecss_defaulttitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.pagecss_defaulttitle')
  document.getElementById('pagecss_nonetitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.pagecss_nonetitle')
  document.getElementById('printtitle').textContent = Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.printtitle')

  let ids = getQueryVariable('ids')
  let notes = Zotero.Items.get(ids.split(','))
  if (notes && notes.length > 0) {
    document.title = notes.length === 1 ? notes[0].getNoteTitle() : Zotero.getMainWindow().Zotero.ZotCard.L10ns.getString('zotcard.cardcontent.prints', notes.length)
    let words = 0
    for (let index = 0; index < notes.length; index++) {
      const note = notes[index]
      let noteContent = note.getNote()
      /*if (Zotero.ZotCard.Utils.attachmentExistsImg(noteContent)) {
        let ret = await Zotero.ZotCard.Utils.loadAttachmentImg(note)
        Zotero.debug(`zotcard@loadAttachmentImg${ret}`)
        noteContent = ret.note
      }*/
      noteContent = Zotero.getMainWindow().Zotero.ZotCard.Utils.clearShadowAndBorder(noteContent)
      let noteTitle = note.getNoteTitle()
      words += Zotero.getMainWindow().Zotero.ZotCard.Utils.hangzi(noteContent)
      Zotero.debug(noteContent)

      cards.push({
        id: note.id,
        title: noteTitle,
        content: noteContent
      })

      let div = document.createElement('div')
      div.setAttribute('id', `card${note.id}`)
      div.setAttribute('class', 'cardcontent')
      div.style.pageBreakAfter = 'always'
      div.innerHTML = noteContent

      document.getElementById('readcontent').append(div)
    }
    document.getElementById('words').textContent = words

    let config = Zotero.Prefs.get('zotcard.config.print')
    Zotero.debug(`config: ${config}`)
    if (config && config.length > 0) {
      let configJSON = JSON.parse(config)
      Zotero.debug(configJSON)
      document.getElementById('fontsize').value = configJSON.fontsize
      document.getElementById('linespacing').value = configJSON.linespacing
      document.getElementById('paragraphspacing').value = configJSON.paragraphspacing
      document.getElementById('titlestyle').value = configJSON.titlestyle
      document.getElementById('pagecss').value = configJSON.pagecss
    } else {
      document.getElementById('fontsize').value = Zotero.Prefs.get('note.fontSize')
      document.getElementById('linespacing').value = Zotero.ZotCard.getNoteLineHeight() || '1'
      document.getElementById('paragraphspacing').value = Zotero.Prefs.get('note.fontSize')
      document.getElementById('titlestyle').value = 'sample'
      document.getElementById('pagecss').value = 'none'
    }

    document.getElementById('readcontent').style.fontSize = document.getElementById('fontsize').value + 'px'
    document.getElementById('readcontent').style.lineHeight = document.getElementById('linespacing').value
    document.querySelectorAll('#readcontent p').forEach(e => e.style.margin = document.getElementById('paragraphspacing').value + 'px 0')
    reftitlestyle()
  } else {
    document.title = 'Error'
    document.getElementById('readcontent').innerHTML = `Error ids(${ids})。`
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

  cards.forEach(card => {
    
    switch (value) {
      case 'h1':
        titleReplace(card, `<h1>${card.title}</h1>`)
        break
      case 'h2':
        titleReplace(card, `<h2>${card.title}</h2>`)
        break
      case 'h3':
        titleReplace(card, `<h3>${card.title}</h3>`)
        break
      case 'h4':
        titleReplace(card, `<h4>${card.title}</h4>`)
        break
      case 'body':
        titleReplace(card, `<p>${card.title}</p>`)
        break
      case 'bodybold':
        titleReplace(card, `<p style="font-weight: bold;">${card.title}</p>`)
        break
      case 'sample':
      default:
        document.getElementById(`card${card.id}`).innerHTML = card.content
        break
    }
  })
}

function refpagestyle () {
  let value = document.getElementById('pagecss').value

  document.styleSheets[0].deleteRule(0)
  switch (value) {
    case 'none':
      document.styleSheets[0].insertRule('@page { margin: 0px 3px; padding: 0px; }', 0)
      break;
    case 'default':
      document.styleSheets[0].insertRule('@page { }', 0)
      break;
  }
  Zotero.debug('document.styleSheets[0].cssRules.item(0).cssText: ' + value + ', ' + document.styleSheets[0].cssRules.item(0).cssText)
}

function titlestylechange () {
  reftitlestyle()
  saveConfig()
}

function pagecsschange () {
  refpagestyle()
  saveConfig()
}

function titleReplace (card, newTitleHtml) {
  let newNoteContent = ''
  let matchs = card.content.match(/\<(h\d)\>((?!<\/h\d>).)*?\<\/h\d\>/)
  if (matchs) {
    newNoteContent = card.content.replace(matchs[0], newTitleHtml)
  } else {
    newNoteContent = card.content
  }

  document.getElementById(`card${card.id}`).innerHTML = newNoteContent
}

function saveConfig() {
  let config = {
    fontsize: document.getElementById('fontsize').value,
    linespacing: document.getElementById('linespacing').value,
    paragraphspacing: document.getElementById('paragraphspacing').value,
    titlestyle: document.getElementById('titlestyle').value,
    pagecss: document.getElementById('pagecss').value
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