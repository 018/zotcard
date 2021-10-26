'use strict'

// [{
//    title: '',
//    key: '',
//    dateAdded: '',
//    dateModified: '',
//    date: '',
//    note: ''
// }, ...]

var cards = window.arguments[0]
var totals = cards.length
Zotero.debug(cards)

function start () {
  document.body.style.fontSize = Zotero.Prefs.get('note.fontSize') + 'px'
  document.getElementById('concentration').style.fontSize = (parseInt(Zotero.Prefs.get('note.fontSize')) + 2) + 'px'
  Zotero.debug(`body font-size: ${document.body.style.fontSize}`)
  document.getElementById('card-width').value = Zotero.Prefs.get('zotcard.config.read.card-width') || '350'
  document.getElementById('card-height').value = Zotero.Prefs.get('zotcard.config.read.card-height') || ''
  document.getElementById('fit-height').checked = Zotero.Prefs.get('zotcard.config.read.fit-height') || false
  let orderby = Zotero.Prefs.get('zotcard.config.read.orderby') || 'date'
  let desc = Zotero.Prefs.get('zotcard.config.read.orderbydesc') || true
  Zotero.debug(`${orderby}, ${desc}`)
  document.querySelectorAll('#orderby .tag').forEach(element => {
    element.textContent = ''
  })
  document.getElementById(`orderby${orderby}`).textContent = (desc === '1' ? '▼' : '▲')

  document.getElementById('concentration').hidden = false
  document.getElementById('totals').textContent = totals
  document.getElementById('cards').textContent = totals
  document.getElementById('hides').textContent = 0
  document.getElementById('title').textContent = (window.arguments.length > 1 ? (window.arguments[1] + '，') : '')
  document.getElementById('desc').hidden = false
  document.getElementById('desc').textContent = (window.arguments.length > 2 ? window.arguments[2] : '')
  if (cards.length === 0) {
    empty()
  } else {
    loadCards()
  }
}

function ok () {
  let width = document.getElementById('card-width')
  let height = document.getElementById('card-height')
  let fitHeight = document.getElementById('fit-height')
  if (!width.value) {
    width.focus()
    return
  }
  if (!height.value && !fitHeight.checked) {
    height.focus()
    return
  }
  Zotero.Prefs.set('zotcard.config.read.card-width', width.value)
  Zotero.Prefs.set('zotcard.config.read.card-height', height.value)
  Zotero.Prefs.set('zotcard.config.read.fit-height', fitHeight.checked)

  loadCards()
}

function loadCards () {
  let orderby = Zotero.Prefs.get('zotcard.config.read.orderby') || 'date'
  let desc = Zotero.Prefs.get('zotcard.config.read.orderbydesc')
  desc = desc === undefined ? true : desc
  Zotero.debug(`${orderby}, ${desc}`)

  if (cards.length === 0) {
    empty()
  } else {
    document.getElementById('read').hidden = false
    document.getElementById('loading').hidden = false
    document.getElementById('content').hidden = true
    document.getElementById('concentration').hidden = true
    cards.sort((a, b) => {
      Zotero.debug(`orderby: ${orderby}, desc: ${desc}, a: ${a[orderby]}, b: ${b[orderby]}, ${a[orderby] > b[orderby] ? (desc ? -1 : 1) : (desc ? 1 : -1)}`)
      return a[orderby] > b[orderby] ? (desc ? -1 : 1) : (desc ? 1 : -1)
    })
    document.getElementById('loading').hidden = true
    document.getElementById('content').hidden = false
    document.getElementById('content-list').innerHTML = ''
    cards.forEach((card, index) => {
      document.getElementById('content-list').append(createCard(card, index))
    })
    Zotero.debug(cards)
  }
}

function orderby (target, by) {
  Zotero.Prefs.set('zotcard.config.read.orderby', by)
  Zotero.Prefs.set('zotcard.config.read.orderbydesc', !Zotero.Prefs.get('zotcard.config.read.orderbydesc'))
  document.querySelectorAll('#orderby .tag').forEach(element => {
    element.textContent = ''
  })
  target.querySelector('.tag').textContent = (Zotero.Prefs.get('zotcard.config.read.orderbydesc') ? '▼' : '▲')
  loadCards()
}

function openNoteWindow (id) {
  Zotero.getMainWindow().ZoteroPane.openNoteWindow(id)
}

function refreshCard (id) {
  let item = Zotero.Items.get(id)
  let cardDiv = document.getElementById(id)
  let cardContentAll = cardDiv.querySelector(`.card-all`)
  cardContentAll.innerHTML = matchNote(item.getNote())
  let cardTitle = cardDiv.querySelector(`.card-title`)
  cardTitle.innerHTML = `<h3 class="linenowrap" style="text-align: center;">${item.getNoteTitle()}</h3>`
  let index = indexOfCards(id)
  cards[index] = Zotero.ZotCard.Utils.toCardItem(item, Zotero.ZotCard.Utils.cardDate(item))
}

function copyCard (id) {
  let card = cardOfCards(id)
  if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(card.note)) {
    Zotero.ZotCard.Utils.error('复制失败。')
  } else {
    Zotero.ZotCard.Utils.success('复制成功，现在可以往编辑软件粘贴了。')
  }
}

function removeCard (id) {
  let card = document.getElementById(id)
  card.remove()
  let index = indexOfCards(id)
  cards.splice(index, 1)

  if (cards.length === 0) {
    empty()
  }
  document.getElementById('cards').textContent = document.getElementById('content-list').children.length
  document.getElementById('hides').textContent = totals - document.getElementById('content-list').children.length
  return cards.length
}

function selectItem (id) {
  Zotero.getMainWindow().ZoteroPane.selectItem(id)
  Zotero.getMainWindow().focus()
}

function clearOrderby () {
  document.querySelectorAll('#orderby .tag').forEach(element => {
    element.textContent = ''
  })
}

function createCard (card, index) {
  let cardDiv = document.createElement('div')
  cardDiv.setAttribute('id', card.id)
  cardDiv.setAttribute('class', 'card')
  cardDiv.style.width = (Zotero.Prefs.get('zotcard.config.read.card-width') || '350') + 'px'
  cardDiv.style.maxWidth = cardDiv.style.width

  let cardBar = document.createElement('div')
  cardBar.setAttribute('class', 'card-bar')
  let divWarp = document.createElement('div')
  
  let span0 = document.createElement('span')
  span0.setAttribute('id', card.id)
  span0.setAttribute('class', 'pointer uread')
  span0.textContent = '编辑'
  span0.onclick = function (e) {
    openNoteWindow(e.target.getAttribute('id'))
  }
  divWarp.appendChild(span0)

  let span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)
  
  let span6 = document.createElement('span')
  span6.setAttribute('card-id', card.id)
  span6.setAttribute('class', 'pointer uread')
  span6.textContent = '刷新'
  span6.onclick = function (e) {
    refreshCard(e.target.getAttribute('card-id'))
  }
  divWarp.appendChild(span6)

  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)
  
  let span11 = document.createElement('span')
  span11.setAttribute('card-id', card.id)
  span11.setAttribute('class', 'pointer uread')
  span11.textContent = '复制'
  span11.onclick = function (e) {
    copyCard(e.target.getAttribute('card-id'))
  }
  divWarp.appendChild(span11)

  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span2 = document.createElement('span')
  span2.setAttribute('class', 'pointer uread')
  span2.setAttribute('card-id', card.id)
  span2.textContent = '隐藏'
  span2.onclick = function (e) {
    removeCard(e.target.getAttribute('card-id'))
  }
  divWarp.appendChild(span2)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span9 = document.createElement('span')
  span9.setAttribute('class', 'pointer uread')
  span9.setAttribute('card-id', card.id)
  span9.textContent = '置顶'
  span9.onclick = function (e) {
    let id = e.target.getAttribute('card-id')
    let card = document.getElementById(id)
    card.parentElement.prepend(card)
    clearOrderby()
  }
  divWarp.appendChild(span9)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span7 = document.createElement('span')
  span7.setAttribute('class', 'pointer uread previous')
  span7.setAttribute('card-id', card.id)
  span7.textContent = '上移'
  span7.onclick = function (e) {
    let id = e.target.getAttribute('card-id')
    let card = document.getElementById(id)
    let previousElementSibling = card.previousElementSibling
    if (previousElementSibling) {
      previousElementSibling.before(card)
    }
    clearOrderby()
  }
  divWarp.appendChild(span7)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span8 = document.createElement('span')
  span8.setAttribute('class', 'pointer uread previous')
  span8.setAttribute('card-id', card.id)
  span8.textContent = '下移'
  span8.onclick = function (e) {
    let id = e.target.getAttribute('card-id')
    let card = document.getElementById(id)
    let nextElementSibling = card.nextElementSibling
    if (nextElementSibling) {
      nextElementSibling.after(card)
    }
    clearOrderby()
  }
  divWarp.appendChild(span8)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span10 = document.createElement('span')
  span10.setAttribute('class', 'pointer uread')
  span10.setAttribute('card-id', card.id)
  span10.textContent = '置底'
  span10.onclick = function (e) {
    let id = e.target.getAttribute('card-id')
    let card = document.getElementById(id)
    card.parentElement.append(card)
    clearOrderby()
  }
  divWarp.appendChild(span10)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span1 = document.createElement('span')
  span1.setAttribute('card-id', card.id)
  span1.setAttribute('class', 'pointer uread')
  span1.textContent = '定位条目'
  span1.onclick = function (e) {
    selectItem(e.target.getAttribute('card-id'))
  }
  divWarp.appendChild(span1)

  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span3 = document.createElement('span')
  span3.setAttribute('class', 'pointer uread')
  span3.setAttribute('card-id', card.id)
  span3.textContent = '收起'
  span3.onclick = function (e) {
    let cardID = e.target.getAttribute('card-id')
    let card = document.getElementById(cardID)
    let cardAll = card.querySelector('.card-all')
    let cardTitle = card.querySelector('.card-title')
    cardAll.hidden = !cardAll.hidden
    e.target.textContent = cardAll.hidden ? '展开' : '收起'

    cardTitle.hidden = !cardAll.hidden
  }
  divWarp.appendChild(span3)
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)
  let span4 = document.createElement('span')
  span4.setAttribute('card-id', card.id)
  span4.setAttribute('class', 'pointer uread')
  span4.textContent = '专注模式'
  span4.onclick = function (e) {
    let id = e.target.getAttribute('card-id')
    Zotero.debug(`id: ${id}`)
    showConcentration(cardOfCards(id), indexOfCardLists(id) + 1)
  }
  divWarp.appendChild(span4)
  let span5 = document.createElement('span')
  span5.setAttribute('id', `tag-${card.id}`)
  span5.textContent = ''
  cardBar.appendChild(divWarp)
  cardBar.appendChild(span5)
  cardDiv.appendChild(cardBar)

  let hr = document.createElement('hr')
  cardDiv.appendChild(hr)

  let cardContent = document.createElement('div')
  cardContent.setAttribute('class', 'card-content')
  let note = matchNote(card.note)
  let cardContentAll = document.createElement('div')
  cardContentAll.setAttribute('class', 'card-all')
  if (!Zotero.Prefs.get('zotcard.config.read.fit-height')) {
    cardContentAll.style.height = (Zotero.Prefs.get('zotcard.config.read.card-height') || '400') + 'px'
    cardContentAll.style.maxHeight = cardContentAll.style.height
  }
  cardContentAll.innerHTML = note
  cardContent.appendChild(cardContentAll)
  let cardTitle = document.createElement('div')
  cardTitle.setAttribute('class', 'card-title')
  cardTitle.hidden = true
  cardTitle.innerHTML = `<h3 class="linenowrap" style="text-align: center;">${card.title}</h3>`
  cardContent.appendChild(cardTitle)
  cardDiv.appendChild(cardContent)

  return cardDiv
}

function matchNote (note) {
  let newNote = note
  let match1 = note.match(/^<div.*style=.*box-shadow:.*?>/g)
  let match2 = note.match(/^<div.*style=.*border-radius:.*?>/g)
  if (match1 && match2 && match1[0] === match2[0]) {
    newNote = note.replace(match1[0], match1[0].replace(/style=".*?"/g, ''))
  }
  return newNote
}

function indexOfCards (id) {
  for (let index = 0; index < cards.length; index++) {
    if (`${cards[index].id}` === id) {
      return index
    }
  }

  Zotero.debug(`Cards Not found ${id}`)
  return -1
}

function cardOfCards (id) {
  for (let index = 0; index < cards.length; index++) {
    if (`${cards[index].id}` === id) {
      Zotero.debug(`Find cards index ${index}`)
      return cards[index]
    }
  }

  Zotero.debug(`Cards Not found ${id}`)
}

function indexOfCardLists (id) {
  for (let index = 0; index < document.getElementById('content-list').children.length; index++) {
    const element = document.getElementById('content-list').children[index]
    if (element.id === id) {
      return index
    }
  }

  Zotero.debug(`CardLists Not found ${id}`)
  return -1
}

function copyAll () {
  if (document.getElementById('content-list').children.length > 0) {
    let htmls = ''
    for (let index = 0; index < document.getElementById('content-list').children.length; index++) {
      const element = document.getElementById('content-list').children[index]
      htmls += element.querySelector('.card-all').innerHTML
    }
    if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(htmls)) {
      Zotero.ZotCard.Utils.error('复制失败。')
    } else {
      Zotero.ZotCard.Utils.success(`成功复制 ${cards.length} 张卡，现在可以往编辑软件粘贴了。`)
    }
  }
}

function showConcentration (card, index) {
  document.getElementById('read').hidden = true
  document.body.style.backgroundColor = '#272727'
  document.getElementById('concentration').hidden = false
  document.getElementById('concentration').setAttribute('card-id', card.id)
  document.getElementById('one-card-progress').textContent = `${index}/${document.getElementById('content-list').children.length}`
  document.getElementById('one-card-content').innerHTML = matchNote(card.note)
  document.getElementById('one-card-dateAdded').textContent = card.dateAdded
  document.getElementById('one-card-dateModified').textContent = card.dateModified
  document.getElementById('one-card-date').textContent = card.date ? card.date : '无'
  document.getElementById('one-card-hangzis').textContent = Zotero.ZotCard.Utils.hangzi(card.note)
  document.getElementById(`tag-${card.id}`).setAttribute('class', 'readed')
  document.getElementById(`tag-${card.id}`).textContent = '◉'
}

function oneCardPrevious () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  let previousElementSibling = document.getElementById(id).previousElementSibling
  if (previousElementSibling) {
    let card = cardOfCards(previousElementSibling.id)
    let index = indexOfCardLists(previousElementSibling.id)
    showConcentration(card, index + 1)
  }
}

function oneCardNext () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  let nextElementSibling = document.getElementById(id).nextElementSibling
  if (nextElementSibling) {
    let card = cardOfCards(nextElementSibling.id)
    let index = indexOfCardLists(nextElementSibling.id)
    showConcentration(card, index + 1)
  }
}

function oneCardLocation () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  selectItem(id)
}

function empty () {
  document.getElementById('read').hidden = false
  document.getElementById('loading').hidden = false
  document.getElementById('loading').textContent = '无卡片数据。'
  document.getElementById('content').hidden = true
  document.getElementById('concentration').hidden = true
  document.body.style.backgroundColor = '#F5F5F5'
}

function oneCardRemove () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  let cardDiv = document.getElementById(id)
  let current = cardDiv.nextElementSibling || cardDiv.previousElementSibling
  if (removeCard(id) > 0) {
    let card = cardOfCards(current.id)
    showConcentration(card, indexOfCardLists(current.id) + 1)
  }
}

function oneCardExit () {
  document.getElementById('read').hidden = false
  document.getElementById('concentration').hidden = true

  let id = document.getElementById('concentration').getAttribute('card-id')
  window.scrollTo(0, document.getElementById(id).offsetTop)
  document.body.style.backgroundColor = '#F5F5F5'
}

function oneCardEdit () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  openNoteWindow(id)
}

function oneCardRefresh () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  let item = Zotero.Items.get(id)
  let note = item.getNote()
  document.getElementById('one-card-content').innerHTML = matchNote(note)
  document.getElementById('one-card-dateModified').textContent = item.dateModified
  document.getElementById('one-card-hangzis').textContent = Zotero.ZotCard.Utils.hangzi(note)

  refreshCard(id)
}

function oneCardCopy () {
  let html = document.getElementById('one-card-content').innerHTML
  if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(html)) {
    Zotero.ZotCard.Utils.error('复制失败。')
  } else {
    Zotero.ZotCard.Utils.success('复制成功，现在可以往编辑软件粘贴了。')
  }
}

window.addEventListener('load', start)

window.addEventListener('keypress', function (event) {
  if (document.getElementById('concentration').hidden) {
    return
  }

  Zotero.debug(event.key)
  if (event.key === 'Escape') {
    oneCardExit()
  } else if (event.key === 'ArrowLeft') {
    oneCardPrevious()
  } else if (event.key === 'ArrowRight') {
    oneCardNext()
  }
  event.stopPropagation()
})
