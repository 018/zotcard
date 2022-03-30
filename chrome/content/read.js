'use strict'

// io.dataIn.title: ...
// io.dataIn.desc: ...
// io.dataIn.cards:
// [{
//    id: '',
//    key: '',
//    title: '',
//    type: '',
//    date: '',
//    tags: [],
//    note: '',
//    author: '',
//    dateAdded: '',
//    dateModified: ''
// }, ...]
// io.dataIn.options:
// {
//    startDate: '',
//    endDate: '',
//    cardtypes: [],
//    cardtags: [],
//    cardauthors: []
// }
// io.dataIn.filters:
// {
//    startDate: '',
//    endDate: '',
//    cardtype: '',
//    cardauthor: '',
//    cardtag: '',
//    text: ''
// }

var io = window.arguments[0]
var cards = io.dataIn.cards
var title = io.dataIn.title
var results = cards
var options = Object.assign({
  startDate: '',
  endDate: '',
  cardtypes: [],
  cardtags: [],
  cardauthors: []
}, io.dataIn.options)
var filters = Object.assign({
  startDate: '',
  endDate: '',
  cardtype: 'all',
  cardtag: 'all',
  cardauthor: '',
  text: ''
}, io.dataIn.filters)
var totals = cards.length
var showHidden = false
var extra = {}//[{id: {hidden: true, expand: true}, ...] 
Zotero.debug(io.dataIn)

function start () {
  document.body.style.fontSize = Zotero.Prefs.get('note.fontSize') + 'px'
  document.getElementById('concentration').style.fontSize = (parseInt(Zotero.Prefs.get('note.fontSize')) + 2) + 'px'
  Zotero.debug(`body font-size: ${document.body.style.fontSize}`)
  document.getElementById('card-width').value = Zotero.Prefs.get('zotcard.config.read.card-width') || '350'
  document.getElementById('card-height').value = Zotero.Prefs.get('zotcard.config.read.card-height') || ''
  document.getElementById('highlight').checked = Zotero.Prefs.get('zotcard.config.read.highlight') || false
  document.getElementById('fit-height').checked = Zotero.Prefs.get('zotcard.config.read.fit-height') || false
  document.getElementById('setting-bar').style.display = 'none'
  document.getElementById('title').textContent = title
  
  document.getElementById('start-date').value = filters.startDate || options.startDate
  document.getElementById('end-date').value = filters.endDate || options.endDate
  document.getElementById('start-date').hidden = !filters.startDate && !filters.endDate
  document.getElementById('end-date').hidden = document.getElementById('start-date').hidden
  document.getElementById('split-date').hidden = document.getElementById('start-date').hidden
  document.getElementById('dateselect').value = !filters.startDate && !filters.endDate ? 'all' : ''
  if (options.cardtypes.length > 0) {
    options.cardtypes.sort((e1, e2) => {
      return e2.count - e1.count
    })
    options.cardtypes.forEach(element => {
      let option = document.createElement('option')
      option.setAttribute('value', element.name)
      option.textContent = `${element.name}(${element.count})`
      document.getElementById('typeselect').append(option)
    })
    document.getElementById('typeselect').value = filters.cardtype
  } else {
    document.getElementById('typeselect').value = ''
  }
  if (options.cardauthors.length > 0) {
    options.cardauthors.sort((e1, e2) => {
      return e2.count - e1.count
    })
    options.cardauthors.forEach(element => {
      let option = document.createElement('option')
      option.setAttribute('value', element.name)
      option.textContent = `${element.name}(${element.count})`
      document.getElementById('authorselect').append(option)
    })
    document.getElementById('authorselect').value = filters.cardauthor
  } else {
    document.getElementById('authorselect').value = ''
    document.querySelectorAll('.author').forEach(element => {
      element.hidden = true
    })
  }
  if (options.cardtags.length > 0) {
    options.cardtags.sort((e1, e2) => {
      return e2.count - e1.count
    })
    options.cardtags.forEach(element => {
      let option = document.createElement('option')
      option.setAttribute('value', element.name)
      option.textContent = `${element.name}(${element.count})`
      document.getElementById('tagselect').append(option)
    })
    document.getElementById('tagselect').value = filters.cardtag
  } else {
    document.getElementById('tagselect').value = 'all'
  }

  document.getElementById('filter-text').value = filters.text

  let orderby = Zotero.Prefs.get('zotcard.config.read.orderby') || 'date'
  let desc = Zotero.Prefs.get('zotcard.config.read.orderbydesc') || true
  Zotero.debug(`${orderby}, ${desc}`)
  document.querySelectorAll('#orderby .tag').forEach(element => {
    element.textContent = ''
  })
  document.getElementById(`orderby${orderby}`).textContent = (desc === '1' ? '▼' : '▲')

  document.getElementById('concentration').hidden = false
  loadNum()

  if (cards.length === 0) {
    empty()
  } else {
    search()
  }
}

function loadNum () {
  document.getElementById('filters').textContent = results.length
  document.getElementById('totals').textContent = totals
  document.getElementById('copys').textContent = document.getElementById('content-list').children.length
  let hides = results.filter(e => !extra[e.id] || extra[e.id].hidden).length
  document.getElementById('hides').textContent = hides
  let expands = results.filter(e => !extra[e.id] || extra[e.id].expand).length
  document.getElementById('expands').textContent = results.length - expands
  document.getElementById('collapses').textContent = expands
}

function search () {
  let startDate = document.getElementById('start-date').value
  let endDate = document.getElementById('end-date').value
  let type = document.getElementById('typeselect').value
  let author = document.getElementById('authorselect').value
  let tag = document.getElementById('tagselect').value
  let filter = document.getElementById('filter-text').value
  Zotero.debug(`${startDate} ~ ${endDate}, ${type}, ${author}, ${tag}, ${filter}`)
  results = cards.filter(e => {
    if (e.date < startDate || e.date > endDate) {
      return false
    }
    if (type !== 'all' && e.type !== type) {
      return false
    }
    if (author && author !== 'all' && e.author !== author) {
      return false
    }
    if (author === 'all' && !e.author) {
      return false
    }
    if (tag !== 'all') {
      if (tag && tag !== '无' && !e.tags.includes(tag)) {
        return false
      }
      if (tag === '无' && e.tags.length > 0) {
        return false
      }
    }
    if (filter && !e.note.includes(filter)) {
      return false
    }

    return true
  })

  Zotero.debug(results)
  loadCards()

  Zotero.Prefs.set('zotcard.config.read.highlight', document.getElementById('highlight').checked)
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

  document.getElementById('setting-bar').style.display = 'none'
}

function loadCards () {
  Zotero.debug(extra)

  let orderby = Zotero.Prefs.get('zotcard.config.read.orderby') || 'date'
  let desc = Zotero.Prefs.get('zotcard.config.read.orderbydesc')
  desc = desc === undefined ? false : desc
  Zotero.debug(`${orderby}, ${desc}`)

  document.getElementById('content-list').innerHTML = ''
  if (results.length === 0) {
    emptyResult()
  } else {
    document.getElementById('read').hidden = false
    document.getElementById('loading').hidden = false
    document.getElementById('content').hidden = true
    document.getElementById('concentration').hidden = true
    document.getElementById('content-empty').hidden = true
    results.sort((a, b) => {
      Zotero.debug(`orderby: ${orderby}, desc: ${desc}, a: ${a[orderby]}, b: ${b[orderby]}, ${a[orderby] > b[orderby] ? (desc ? -1 : 1) : (desc ? 1 : -1)}`)
      return a[orderby] > b[orderby] ? (desc ? -1 : 1) : (desc ? 1 : -1)
    })
    document.getElementById('loading').hidden = true
    document.getElementById('content').hidden = false
    results.forEach((card, index) => {
      if (!extra.hasOwnProperty(card.id)) {
        extra[card.id] = {
          hidden: false,
          expand: true
        }
      }

      if (document.getElementById('showHidden').checked || !extra[card.id].hidden) {
        document.getElementById('content-list').append(createCard(card, index))
      }
    })
  }
  document.getElementById('searching').hidden = true
  loadNum()
}

function orderby (target, by) {
  document.getElementById('searching').hidden = false
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

function dateselectchange (event) {
  let now = new Date()
  switch (event.target.value) {
    case 'all':
      document.getElementById('start-date').value = options.startDate
      document.getElementById('end-date').value = options.endDate
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    case 'today':
      document.getElementById('start-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('end-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    case 'yesterday':
      now.setDate(now.getDate() - 1)
      document.getElementById('start-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('end-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    case 'week':
      let start = new Date()
      let week = (start.getDay() === 0 ? 7 : start.getDay() - 1)
      start.setDate(start.getDate() - week)
      document.getElementById('start-date').value = Zotero.ZotCard.Utils.formatDate(start, 'yyyy-MM-dd')
      document.getElementById('end-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    case 'mouth':
      document.getElementById('start-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM') + '-01'
      document.getElementById('end-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    case 'quarter':
      let mouth = now.getMonth() + 1
      let year = now.getYear() + 1900
      let startMouth = 1
      if (mouth <= 3) {
        startMouth = 1
      } else if (mouth <= 6) {
        startMouth = 4
      } else if (mouth <= 9) {
        startMouth = 7
      } else if (mouth <= 12) {
        startMouth = 10
      }
      document.getElementById('start-date').value = `${year}-${startMouth}-01`
      document.getElementById('end-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    case 'year':
      document.getElementById('start-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy') + '-01-01'
      document.getElementById('end-date').value = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
      document.getElementById('start-date').hidden = true
      document.getElementById('end-date').hidden = true
      document.getElementById('split-date').hidden = true
      break
    default:
      document.getElementById('start-date').hidden = false
      document.getElementById('end-date').hidden = false
      document.getElementById('split-date').hidden = false
      break
  }
}

function datechange (event) {
  document.getElementById('dateselect').value = ''
}

function refreshCard (id) {
  let item = Zotero.Items.get(id)
  let cardDiv = document.getElementById(id)
  let cardContentAll = cardDiv.querySelector(`.card-all`)
  cardContentAll.innerHTML = matchNote(item.getNote())
  let cardTitle = cardDiv.querySelector(`.card-title`)
  cardTitle.innerHTML = `<h1 class="linenowrap" style="text-align: center;">${item.getNoteTitle()}</h1>`

  let index = indexOfCards(id)
  cards[index] = Zotero.ZotCard.Utils.toCardItem(item)
  cardDiv.querySelector(`#dateModified`).textContent = `修改时间：${cards[index].dateModified}`
  cardDiv.querySelector(`#words`).textContent = `字数：${cards[index].words}`

  options = Zotero.ZotCard.Utils.refreshOptions(cards[index], options)
}

function copyCard (id) {
  let card = cardOfCards(id)
  if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(card.note)) {
    Zotero.ZotCard.Utils.error('复制失败。')
  } else {
    Zotero.ZotCard.Utils.success('复制成功，现在可以往编辑软件粘贴了。')
  }
}

function hideOrShowCard (id) {
  let card = document.getElementById(id)

  extra[id].hidden = !extra[id].hidden

  if (!document.getElementById('showHidden').checked && extra[id].hidden) {
    card.remove()

    if (document.getElementById('content-list').children.length === 0) {
      emptyResult()
    }
  } else if (document.getElementById('showHidden').checked) {
    card.querySelector('.hidden').innerHTML = !extra[id].hidden ? '<svg t="1637915315755" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5198" width="16" height="16"><path d="M944.1 462.9c-0.2-0.1-0.4-0.2-0.5-0.4-3.7-2.8-17-12.8-34.4-24.8-1.6-1.1-2-2.7-2-3.5-0.1-0.8 0-2.3 1.4-3.7 13.5-13 26.6-26.6 39-40.6 0.6-0.6 1-1.2 1.5-1.8 12.5-16.6 13-39.2 1.2-56.3-2-2.9-4.4-5.4-7.2-7.3-5.4-3.8-11.7-5.2-18-4.2-12 1.9-20.8 12.1-26.4 19.7-46.3 58.6-205.3 210.2-385.6 210.3-48-0.5-95.1-8.9-140.1-25l-39.7-16.1c-37.8-17.1-74-38-107.5-62.2l-28.1-21.1c-25.5-19.6-49.1-41.8-70-66-0.7-0.8-1.4-1.6-2.2-2.3l-1.8-1.7c-6.2-5.8-11.5-10.8-17.8-13.5-5.3-2.3-15.8-4.6-26.6 5-19 17-14.2 41.3-3.3 58.4 1.1 1.7 2.4 3.3 3.8 4.8 15.9 16 32.7 31.5 50.1 46 1.5 1.3 1.7 2.9 1.7 3.7 0 0.8-0.3 2.4-2 3.6-12.7 9-22.1 15.9-24.7 17.8-0.1 0-0.2 0.1-0.7 0.4-7.8 4.5-13.3 11.7-15.5 20.2-2.4 8.9-0.8 18.4 4.3 26.1 9.5 15.5 29.7 20.8 46 12.1 5.6-3 11.8-7.6 20.5-14 7.4-5.5 16.6-12.3 28.2-20.1 1.7-1.2 4-1.1 5.8 0.1 28.8 19.9 59.4 37.9 90.8 53.6 1.6 0.8 2.3 2.2 2.5 2.9 0.2 0.7 0.5 2.1-0.4 3.6l-28.7 48.3c-4.6 7.6-5.8 16.6-3.5 25.1 2.3 8.6 7.9 15.8 15.9 20.3l0.2 0.1c16.2 8.9 37 3.5 46.5-12l32.9-56.2c1.2-2.1 3.8-2.9 6.1-2.1 38.2 14 78.1 23.2 118.7 27.4 2.6 0.3 4.5 2.3 4.5 4.7V671c0 18.3 15.4 33.3 34.3 33.3s34.3-14.9 34.3-33.3v-49.6c0-2.4 1.9-4.4 4.5-4.7 40.1-4.2 79.5-13.7 117-28.2 2.3-0.9 5 0 6.2 2l34.2 58.5 0.1 0.1c9.5 15.7 29.7 21.1 46.1 12.4l0.3-0.2c7.9-4.5 13.5-11.7 15.8-20.3 2.3-8.5 1.1-17.4-3.5-25L737 562.4c-1.3-2.2-0.5-5.1 1.9-6.4 38.7-21.1 75.7-45.8 110-73.3 1.7-1.4 4.2-1.5 6-0.3 25.1 16.5 45.5 31.2 51.1 35.4 1.9 1.4 3.8 2.5 5.8 3.3 15.9 6.7 34.5 0.9 43.3-13.6 9.2-15.3 4.4-34.9-11-44.6z" p-id="5199" fill="#009193"></path></svg>' : '<svg t="1637915376666" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6173" width="16" height="16"><path d="M514.1 291.6c60 0 122.2 21 184.9 62.5 67.6 44.6 110.5 97 121.9 111.9 11.3 14.8 17.6 30.9 18.1 46.8-0.5 16.4-6.8 32.9-18.1 47.6-11.5 15-54.3 67.3-121.9 111.9-62.7 41.4-125 62.5-185.1 62.5-60 0-122.3-21-185-62.5-67.6-44.6-110.4-96.9-121.9-111.9-11.3-14.9-17.5-31-18-46.8 0.5-16.4 6.7-32.8 18-47.7 11.6-15.1 54.5-67.3 122-111.9 62.7-41.4 125-62.4 185.1-62.4m0-96.2c-79.2 0-159.4 26.4-238.1 78.4-77.9 51.4-127.5 110.6-145.3 133.6l-0.1 0.2-0.1 0.2C106.8 439 93.8 475 92.9 511.9v3.8c0.9 36.2 13.9 71.9 37.6 103.1l0.1 0.2 0.1 0.2c17.7 23 67.3 82.1 145.2 133.6 78.7 52 158.8 78.4 238 78.4 79.3 0 159.3-26.4 238.1-78.4C829.9 701.1 879.4 642 897.1 619c24-31.2 37.1-67.3 38-104.3v-2l-0.1-2c-0.9-36.4-14.1-72.2-38-103.3-17.8-23.1-67.4-82.2-145.2-133.6-78.5-52-158.6-78.4-237.7-78.4z" p-id="6174" fill="#009193"></path><path d="M514 513.2m-161.1 0a161.1 161.1 0 1 0 322.2 0 161.1 161.1 0 1 0-322.2 0Z" p-id="6175" fill="#009193"></path></svg>'
  }
  loadNum()

  return cards.length
}

function selectItem (id) {
  Zotero.getMainWindow().ZoteroPane.selectItem(id)
  Zotero.getMainWindow().focus()
}

function deleteItem (id) {
  var toTrash = {
    title: Zotero.getString('pane.items.trash.title'),
    text: Zotero.getString('pane.items.trash')
  };
  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
  if (promptService.confirm(window, toTrash.title, toTrash.text)) {
    Zotero.Items.trashTx(id)
    extra[id].deleted = true
    hideOrShowCard(id)
  }
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
  cardBar.style.display = 'flex'
  cardBar.style.justifyContent = 'space-between'
  cardBar.style.alignItems = 'center'
  let divWarp = document.createElement('div')

  let span1 = document.createElement('span')
  span1.setAttribute('class', 'pointer')
  span1.setAttribute('title', '定位条目')
  span1.setAttribute('cardid', card.id)
  span1.innerHTML = '<svg t="1637916032653" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15303" width="16" height="16"><path d="M512 947.2c-96.290133 0-332.8-355.191467-332.8-520.533333 0-183.808 148.992-332.8 332.8-332.8s332.8 148.992 332.8 332.8c0 165.341867-236.509867 520.533333-332.8 520.533333z m0-51.2c62.600533 0 281.6-328.9088 281.6-469.333333a281.6 281.6 0 1 0-563.2 0c0 140.424533 218.999467 469.333333 281.6 469.333333z m0-358.4a128 128 0 1 1 0-256 128 128 0 0 1 0 256z m0-51.2a76.8 76.8 0 1 0 0-153.6 76.8 76.8 0 0 0 0 153.6z" p-id="15304" fill="#009193"></path></svg>'
  span1.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    selectItem(span.getAttribute('cardid'))
  }
  divWarp.appendChild(span1)

  span1 = document.createElement('span')
  span1.setAttribute('class', 'pointer')
  span1.setAttribute('title', !extra[card.id].deleted ? '删除条目' : '已删除')
  span1.setAttribute('candelete', !extra[card.id].deleted ? '1' : '0')
  span1.setAttribute('cardid', card.id)
  span1.innerHTML = !extra[card.id].deleted ? '<svg t="1645782356108" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1254" width="16" height="16"><path d="M928.16 144H736V64a32 32 0 0 0-32-32H320a32 32 0 0 0-32 32v80H95.84a32 32 0 0 0 0 64H129.6l77.92 698.656A96 96 0 0 0 302.912 992h418.144a96.032 96.032 0 0 0 95.424-85.344L894.4 208h33.728a32 32 0 0 0 0.032-64zM352 96h320v48H352V96z m400.896 803.552a32 32 0 0 1-31.808 28.448H302.912a32 32 0 0 1-31.808-28.448L193.984 208h636.032l-77.12 691.552z" p-id="1255" fill="#009193"></path><path d="M608 820.928a32 32 0 0 0 32-32V319.104a32 32 0 0 0-64 0v469.824a32 32 0 0 0 32 32zM432 820.928a32 32 0 0 0 32-32V319.104a32 32 0 0 0-64 0v469.824a32 32 0 0 0 32 32z" p-id="1256" fill="#009193"></path></svg>' : '<svg t="1645782356108" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1254" width="16" height="16"><path d="M928.16 144H736V64a32 32 0 0 0-32-32H320a32 32 0 0 0-32 32v80H95.84a32 32 0 0 0 0 64H129.6l77.92 698.656A96 96 0 0 0 302.912 992h418.144a96.032 96.032 0 0 0 95.424-85.344L894.4 208h33.728a32 32 0 0 0 0.032-64zM352 96h320v48H352V96z m400.896 803.552a32 32 0 0 1-31.808 28.448H302.912a32 32 0 0 1-31.808-28.448L193.984 208h636.032l-77.12 691.552z" p-id="1255" fill="#dbdbdb"></path><path d="M608 820.928a32 32 0 0 0 32-32V319.104a32 32 0 0 0-64 0v469.824a32 32 0 0 0 32 32zM432 820.928a32 32 0 0 0 32-32V319.104a32 32 0 0 0-64 0v469.824a32 32 0 0 0 32 32z" p-id="1256" fill="#dbdbdb"></path></svg>'
  span1.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    if (span.getAttribute('candelete') === '1') {
      deleteItem(span.getAttribute('cardid'))
    }
  }
  divWarp.appendChild(span1)

  let span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)
  
  let span0 = document.createElement('span')
  span0.setAttribute('class', 'pointer bicon')
  span0.setAttribute('title', '编辑')
  span0.setAttribute('cardid', card.id)
  span0.innerHTML = '<svg t="1637914560073" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1217" width="16" height="16"><path d="M358.165868 554.624796c-0.533143 0.680499-1.066285 1.391696-1.303692 2.251274l-41.104163 150.700257c-2.400676 8.772804 0.059352 18.226107 6.550183 24.892947 4.860704 4.742001 11.261485 7.350408 18.077727 7.350408 2.252297 0 4.504594-0.267083 6.727215-0.860601l149.630902-40.808428c0.23843 0 0.357134 0.207731 0.534166 0.207731 1.718131 0 3.408633-0.62217 4.683672-1.927909l400.113747-400.054395c11.883655-11.897981 18.404162-28.109198 18.404162-45.74281 0-19.989263-8.476045-39.963177-23.324218-54.767348l-37.786605-37.844933c-14.81645-14.848173-34.822087-23.338544-54.797024-23.338544-17.631566 0-33.842783 6.520507-45.75816 18.388812L358.758362 553.232077C358.344946 553.615816 358.462626 554.179658 358.165868 554.624796M862.924953 257.19778l-39.742143 39.71349-64.428382-65.451688 39.180348-39.179324c6.193049-6.222725 18.194384-5.318122 25.308409 1.822508l37.813211 37.845956c3.943822 3.941775 6.195096 9.18622 6.195096 14.372336C867.223862 250.574942 865.710392 254.42769 862.924953 257.19778M429.322487 560.907896l288.712541-288.728914 64.459081 65.49569L494.314711 625.838721 429.322487 560.907896zM376.718409 677.970032l20.863167-76.580143 55.656601 55.657624L376.718409 677.970032z" p-id="1218" fill="#009193"></path><path d="M888.265084 415.735539c-15.144932 0-27.562752 12.313443-27.620058 27.665083l0 372.98283c0 19.559475-15.885805 35.444257-35.475979 35.444257L194.220958 851.827709c-19.559475 0-35.504632-15.883759-35.504632-35.444257L158.716326 207.602222c0-19.575848 15.945157-35.474956 35.504632-35.474956l406.367171 0c15.231913 0 27.592428-12.371772 27.592428-27.606755 0-15.202237-12.360516-27.590382-27.592428-27.590382L190.013123 116.930129c-47.684022 0-86.49291 38.779212-86.49291 86.49291L103.520213 820.59231c0 47.713698 38.808888 86.47756 86.49291 86.47756l639.334083 0c47.715745 0 86.509283-38.763862 86.509283-86.47756L915.856489 443.222567C915.794068 428.048983 903.408993 415.735539 888.265084 415.735539" p-id="1219" fill="#009193"></path></svg>'
  span0.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    openNoteWindow(span.getAttribute('cardid'))
  }
  divWarp.appendChild(span0)
  
  let span6 = document.createElement('span')
  span6.setAttribute('class', 'pointer bicon')
  span6.setAttribute('title', '刷新')
  span6.setAttribute('cardid', card.id)
  span6.innerHTML = '<svg t="1637915170102" class="icon" viewBox="0 0 1282 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3401" width="16" height="16"><path d="M1276.284799 473.062139l-150.178456 149.495828a33.244049 33.244049 0 0 1-44.848749 0l-149.427564-149.495828c-17.748363-20.47888-5.870612-27.987803 6.826293-39.592502h136.52587A443.2995 443.2995 0 0 0 254.456926 304.45269l-74.679651-29.353062a523.440185 523.440185 0 0 1 976.15997 158.370009h113.862576a26.417756 26.417756 0 0 1 6.484978 39.592502zM203.669302 440.97856l150.178457 149.495827a26.486019 26.486019 0 0 1-6.484978 39.592503H217.048838a443.709077 443.709077 0 0 0 791.850045 120.825395l75.430543 29.353062a523.235396 523.235396 0 0 1-949.332636-150.178457H15.604917c-12.355591-11.604699-24.233342-19.113622-6.826294-39.592503l149.427565-149.495827a33.244049 33.244049 0 0 1 45.463114 0z" p-id="3402" fill="#009193"></path></svg>'
  span6.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    refreshCard(span.getAttribute('cardid'))
  }
  divWarp.appendChild(span6)
  
  let span11 = document.createElement('span')
  span11.setAttribute('class', 'pointer')
  span11.setAttribute('title', '复制')
  span11.setAttribute('cardid', card.id)
  span11.innerHTML = '<svg t="1637915219750" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4289" width="16" height="16"><path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z" p-id="4290" fill="#009193"></path><path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="4291" fill="#009193"></path><path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="4292" fill="#009193"></path></svg>'
  span11.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    copyCard(span.getAttribute('cardid'))
  }
  divWarp.appendChild(span11)

  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span2 = document.createElement('span')
  span2.setAttribute('class', 'pointer bicon hidden')
  span2.setAttribute('cardid', card.id)
  span2.setAttribute('title', !extra[card.id].hidden ? '隐藏' : '显示')
  span2.setAttribute('title', '隐藏')
  span2.innerHTML = !extra[card.id].hidden ? '<svg t="1637915315755" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5198" width="16" height="16"><path d="M944.1 462.9c-0.2-0.1-0.4-0.2-0.5-0.4-3.7-2.8-17-12.8-34.4-24.8-1.6-1.1-2-2.7-2-3.5-0.1-0.8 0-2.3 1.4-3.7 13.5-13 26.6-26.6 39-40.6 0.6-0.6 1-1.2 1.5-1.8 12.5-16.6 13-39.2 1.2-56.3-2-2.9-4.4-5.4-7.2-7.3-5.4-3.8-11.7-5.2-18-4.2-12 1.9-20.8 12.1-26.4 19.7-46.3 58.6-205.3 210.2-385.6 210.3-48-0.5-95.1-8.9-140.1-25l-39.7-16.1c-37.8-17.1-74-38-107.5-62.2l-28.1-21.1c-25.5-19.6-49.1-41.8-70-66-0.7-0.8-1.4-1.6-2.2-2.3l-1.8-1.7c-6.2-5.8-11.5-10.8-17.8-13.5-5.3-2.3-15.8-4.6-26.6 5-19 17-14.2 41.3-3.3 58.4 1.1 1.7 2.4 3.3 3.8 4.8 15.9 16 32.7 31.5 50.1 46 1.5 1.3 1.7 2.9 1.7 3.7 0 0.8-0.3 2.4-2 3.6-12.7 9-22.1 15.9-24.7 17.8-0.1 0-0.2 0.1-0.7 0.4-7.8 4.5-13.3 11.7-15.5 20.2-2.4 8.9-0.8 18.4 4.3 26.1 9.5 15.5 29.7 20.8 46 12.1 5.6-3 11.8-7.6 20.5-14 7.4-5.5 16.6-12.3 28.2-20.1 1.7-1.2 4-1.1 5.8 0.1 28.8 19.9 59.4 37.9 90.8 53.6 1.6 0.8 2.3 2.2 2.5 2.9 0.2 0.7 0.5 2.1-0.4 3.6l-28.7 48.3c-4.6 7.6-5.8 16.6-3.5 25.1 2.3 8.6 7.9 15.8 15.9 20.3l0.2 0.1c16.2 8.9 37 3.5 46.5-12l32.9-56.2c1.2-2.1 3.8-2.9 6.1-2.1 38.2 14 78.1 23.2 118.7 27.4 2.6 0.3 4.5 2.3 4.5 4.7V671c0 18.3 15.4 33.3 34.3 33.3s34.3-14.9 34.3-33.3v-49.6c0-2.4 1.9-4.4 4.5-4.7 40.1-4.2 79.5-13.7 117-28.2 2.3-0.9 5 0 6.2 2l34.2 58.5 0.1 0.1c9.5 15.7 29.7 21.1 46.1 12.4l0.3-0.2c7.9-4.5 13.5-11.7 15.8-20.3 2.3-8.5 1.1-17.4-3.5-25L737 562.4c-1.3-2.2-0.5-5.1 1.9-6.4 38.7-21.1 75.7-45.8 110-73.3 1.7-1.4 4.2-1.5 6-0.3 25.1 16.5 45.5 31.2 51.1 35.4 1.9 1.4 3.8 2.5 5.8 3.3 15.9 6.7 34.5 0.9 43.3-13.6 9.2-15.3 4.4-34.9-11-44.6z" p-id="5199" fill="#009193"></path></svg>' : '<svg t="1637915376666" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6173" width="16" height="16"><path d="M514.1 291.6c60 0 122.2 21 184.9 62.5 67.6 44.6 110.5 97 121.9 111.9 11.3 14.8 17.6 30.9 18.1 46.8-0.5 16.4-6.8 32.9-18.1 47.6-11.5 15-54.3 67.3-121.9 111.9-62.7 41.4-125 62.5-185.1 62.5-60 0-122.3-21-185-62.5-67.6-44.6-110.4-96.9-121.9-111.9-11.3-14.9-17.5-31-18-46.8 0.5-16.4 6.7-32.8 18-47.7 11.6-15.1 54.5-67.3 122-111.9 62.7-41.4 125-62.4 185.1-62.4m0-96.2c-79.2 0-159.4 26.4-238.1 78.4-77.9 51.4-127.5 110.6-145.3 133.6l-0.1 0.2-0.1 0.2C106.8 439 93.8 475 92.9 511.9v3.8c0.9 36.2 13.9 71.9 37.6 103.1l0.1 0.2 0.1 0.2c17.7 23 67.3 82.1 145.2 133.6 78.7 52 158.8 78.4 238 78.4 79.3 0 159.3-26.4 238.1-78.4C829.9 701.1 879.4 642 897.1 619c24-31.2 37.1-67.3 38-104.3v-2l-0.1-2c-0.9-36.4-14.1-72.2-38-103.3-17.8-23.1-67.4-82.2-145.2-133.6-78.5-52-158.6-78.4-237.7-78.4z" p-id="6174" fill="#009193"></path><path d="M514 513.2m-161.1 0a161.1 161.1 0 1 0 322.2 0 161.1 161.1 0 1 0-322.2 0Z" p-id="6175" fill="#009193"></path></svg>'
  span2.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    hideOrShowCard(span.getAttribute('cardid'))
  }
  divWarp.appendChild(span2)

  let span3 = document.createElement('span')
  span3.setAttribute('class', 'pointer expand')
  span3.setAttribute('cardid', card.id)
  span3.setAttribute('title', extra[card.id].expand ? '收起' : '展开')
  span3.innerHTML = extra[card.id].expand ? '<svg t="1637915636352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10917" width="16" height="16"><path d="M711.131429 615.570286L512 482.816l-199.131429 132.754286a36.571429 36.571429 0 0 1-40.594285-60.854857l219.428571-146.285715a36.571429 36.571429 0 0 1 40.594286 0l219.428571 146.285715a36.571429 36.571429 0 0 1-40.594285 60.854857zM512 950.857143c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z m0 73.142857C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z" p-id="10918" fill="#009193"></path></svg>' : '<svg t="1637915636352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10917" width="16" height="16"><path d="M711.131429 408.429714a36.571429 36.571429 0 0 1 40.594285 60.854857l-219.428571 146.285715a36.571429 36.571429 0 0 1-40.594286 0l-219.428571-146.285715a36.571429 36.571429 0 1 1 40.594285-60.854857L512 541.184l199.131429-132.754286zM512 950.857143c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z m0 73.142857C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z" p-id="12112" fill="#009193"></path></svg>'
  span3.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let cardID = span.getAttribute('cardid')
    let card = document.getElementById(cardID)
    let cardAll = card.querySelector('.card-all')
    let cardTitle = card.querySelector('.card-title')

    cardAll.hidden = !cardAll.hidden
    cardTitle.hidden = !cardAll.hidden

    extra[cardID].expand = !cardAll.hidden
    loadNum()

    span.parentElement.setAttribute('title', extra[cardID].expand ? '收起' : '展开')
    span.innerHTML = extra[cardID].expand ? '<svg t="1637915636352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10917" width="16" height="16"><path d="M711.131429 615.570286L512 482.816l-199.131429 132.754286a36.571429 36.571429 0 0 1-40.594285-60.854857l219.428571-146.285715a36.571429 36.571429 0 0 1 40.594286 0l219.428571 146.285715a36.571429 36.571429 0 0 1-40.594285 60.854857zM512 950.857143c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z m0 73.142857C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z" p-id="10918" fill="#009193"></path></svg>' : '<svg t="1637915636352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10917" width="16" height="16"><path d="M711.131429 408.429714a36.571429 36.571429 0 0 1 40.594285 60.854857l-219.428571 146.285715a36.571429 36.571429 0 0 1-40.594286 0l-219.428571-146.285715a36.571429 36.571429 0 1 1 40.594285-60.854857L512 541.184l199.131429-132.754286zM512 950.857143c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z m0 73.142857C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z" p-id="12112" fill="#009193"></path></svg>'
  }
  divWarp.appendChild(span3)
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span9 = document.createElement('span')
  span9.setAttribute('class', 'pointer bicon')
  span9.setAttribute('title', '置顶')
  span9.setAttribute('cardid', card.id)
  span9.innerHTML = '<svg t="1637915396930" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7026" width="16" height="16"><path d="M862.72 147.2H161.28c-18.432 0-33.28-14.848-33.28-33.28s14.848-33.28 33.28-33.28h701.44c18.432 0 33.28 14.848 33.28 33.28s-14.848 33.28-33.28 33.28zM549.376 323.84v580.608c0 21.504-17.408 38.912-38.912 38.912-21.504 0-38.912-17.408-38.912-38.912V323.84c0-21.504 17.408-38.912 38.912-38.912 21.504 0 38.912 17.408 38.912 38.912z" p-id="7027" fill="#009193"></path><path d="M542.72 262.144L207.872 661.248c-13.824 16.384-38.4 18.688-54.784 4.864-16.384-13.824-18.688-38.4-4.864-54.784L483.072 212.224c13.824-16.384 38.4-18.688 54.784-4.864 16.384 13.824 18.688 38.4 4.864 54.784z" p-id="7028" fill="#009193"></path><path d="M481.28 262.144l334.848 398.848c13.824 16.384 38.4 18.688 54.784 4.864 16.384-13.824 18.688-38.4 4.864-54.784L540.928 212.224c-13.824-16.384-38.4-18.688-54.784-4.864-16.384 13.824-18.688 38.4-4.864 54.784z" p-id="7029" fill="#009193"></path></svg>'
  span9.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let id = span.getAttribute('cardid')
    let card = document.getElementById(id)
    card.parentElement.prepend(card)
    clearOrderby()
  }
  divWarp.appendChild(span9)

  let span7 = document.createElement('span')
  span7.setAttribute('class', 'pointer previous bicon')
  span7.setAttribute('title', '上移')
  span7.setAttribute('cardid', card.id)
  span7.innerHTML = '<svg t="1637916289701" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16156" width="16" height="16"><path d="M876.2 434.3L536.7 94.9c-6.6-6.6-15.5-10.3-24.7-10.3-9.3 0-18.2 3.7-24.7 10.3L147.8 434.3c-13.7 13.7-13.7 35.8 0 49.5 13.7 13.7 35.8 13.7 49.5 0L477 204.1v700.2c0 19.3 15.7 35 35 35s35-15.7 35-35V204.1l279.7 279.7c6.8 6.8 15.8 10.3 24.7 10.3s17.9-3.4 24.7-10.3c13.7-13.7 13.7-35.8 0.1-49.5z" p-id="16157" fill="#009193"></path></svg>'
  span7.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let id = span.getAttribute('cardid')
    let card = document.getElementById(id)
    let previousElementSibling = card.previousElementSibling
    if (previousElementSibling) {
      previousElementSibling.before(card)
    }
    clearOrderby()
  }
  divWarp.appendChild(span7)

  let span8 = document.createElement('span')
  span8.setAttribute('class', 'pointer previous bicon')
  span8.setAttribute('title', '下移')
  span8.setAttribute('cardid', card.id)
  span8.innerHTML = '<svg t="1637916325715" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17008" width="16" height="16"><path d="M876.2 589.7L536.7 929.1c-6.6 6.6-15.5 10.3-24.7 10.3-9.3 0-18.2-3.7-24.7-10.3L147.8 589.7c-13.7-13.7-13.7-35.8 0-49.5 13.7-13.7 35.8-13.7 49.5 0L477 819.9V119.6c0-19.3 15.7-35 35-35s35 15.7 35 35v700.2l279.7-279.7c6.8-6.8 15.8-10.3 24.7-10.3s17.9 3.4 24.7 10.3c13.7 13.8 13.7 35.9 0.1 49.6z" p-id="17009" fill="#009193"></path></svg>'
  span8.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let id = span.getAttribute('cardid')
    let card = document.getElementById(id)
    let nextElementSibling = card.nextElementSibling
    if (nextElementSibling) {
      nextElementSibling.after(card)
    }
    clearOrderby()
  }
  divWarp.appendChild(span8)

  let span10 = document.createElement('span')
  span10.setAttribute('class', 'pointer')
  span10.setAttribute('title', '置底')
  span10.setAttribute('cardid', card.id)
  span10.innerHTML = '<svg t="1637915817940" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12722" width="16" height="16"><path d="M123.26 411.37a32 32 0 1 1 45.28-45.23l311.34 311.67L479.71 97a32 32 0 0 1 32-32 32 32 0 0 1 32 32l0.17 580.89 311.59-311.76a32 32 0 0 1 45.27 45.24l-366.2 366.39-0.19 0.18-0.94 0.9-0.52 0.44-0.62 0.53-0.1 0.09-0.62 0.47-0.5 0.4c-0.05 0-0.1 0.08-0.16 0.11-0.21 0.16-0.43 0.31-0.65 0.46l-0.46 0.32-0.2 0.14-0.65 0.41-0.48 0.29a1.64 1.64 0 0 1-0.22 0.14l-0.62 0.35-0.52 0.29-0.23 0.13-0.59 0.29-0.6 0.3-0.18 0.09c-0.17 0.09-0.35 0.16-0.53 0.24l-0.71 0.3-0.19 0.08-0.48 0.18c-0.27 0.1-0.54 0.21-0.81 0.3H522.6l-0.42 0.13-0.91 0.3h-0.14l-0.39 0.11-1 0.26h-0.12l-0.38 0.08c-0.34 0.08-0.68 0.16-1 0.22h-0.06l-0.42 0.07-1 0.17h-0.09c-0.17 0-0.34 0-0.51 0.06l-0.94 0.12h-0.95l-0.75 0.05h-3.12l-0.75-0.05H508.84l-0.94-0.12c-0.17 0-0.34 0-0.51-0.06h-0.09l-1-0.17-0.42-0.07h-0.1c-0.34-0.06-0.68-0.14-1-0.22l-0.4-0.08h-0.08l-1-0.26-0.4-0.11h-0.14l-0.89-0.29-0.45-0.14-0.14-0.05c-0.26-0.09-0.53-0.19-0.79-0.3l-0.49-0.18h-0.2l-0.69-0.3-0.55-0.24-0.18-0.09-0.59-0.3-0.6-0.29-0.17-0.09h-0.05l-0.52-0.28-0.64-0.36-0.14-0.09h-0.07l-0.47-0.3c-0.22-0.14-0.45-0.27-0.67-0.42h-0.07l-0.11-0.08-0.47-0.33-0.81-0.49-0.09-0.08-0.53-0.42-0.61-0.47-0.08-0.07c-0.24-0.19-0.47-0.4-0.7-0.6l-0.46-0.4c-0.41-0.37-0.81-0.74-1.19-1.13zM896.68 895H127.32a32 32 0 1 0 0 64h769.36a32 32 0 0 0 0-64z" fill="#009193" p-id="12723"></path></svg>'
  span10.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let id = span.getAttribute('cardid')
    let card = document.getElementById(id)
    card.parentElement.append(card)
    clearOrderby()
  }
  divWarp.appendChild(span10)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span12 = document.createElement('span')
  span12.setAttribute('class', 'pointer')
  span12.setAttribute('title', '打印')
  span12.setAttribute('cardid', card.id)
  span12.innerHTML = '<svg t="1639382675748" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1274" width="16" height="16"><path d="M873.9328 533.333333 824.1664 533.333333C805.3248 533.333333 790.033067 518.075733 790.033067 499.2 790.033067 480.324267 805.3248 465.066667 824.1664 465.066667L873.9328 465.066667C911.581867 465.066667 942.199467 434.449067 942.199467 396.8L942.199467 136.533333C942.199467 98.884267 911.581867 68.266667 873.9328 68.266667L136.516267 68.266667C98.8672 68.266667 68.2496 98.884267 68.2496 136.533333L68.2496 396.8C68.2496 434.449067 98.8672 465.066667 136.516267 465.066667L188.330667 465.066667C207.172267 465.066667 222.464 480.324267 222.464 499.2 222.464 518.075733 207.172267 533.333333 188.330667 533.333333L136.516267 533.333333C61.252267 533.333333-0.017067 472.098133-0.017067 396.8L-0.017067 136.533333C-0.017067 61.2352 61.252267 0 136.516267 0L873.9328 0C949.230933 0 1010.466133 61.2352 1010.466133 136.533333L1010.466133 396.8C1010.466133 472.098133 949.230933 533.333333 873.9328 533.333333" p-id="1275" fill="#009193"></path><path d="M783.117653 1010.199893 714.509653 1010.199893C695.668053 1010.199893 680.37632 994.942293 680.37632 976.06656 680.37632 957.190827 695.668053 941.933227 714.509653 941.933227L783.117653 941.933227C786.940587 941.933227 790.04672 938.827093 790.04672 935.00416L790.04672 288.416427 222.477653 288.416427 222.477653 935.00416C222.477653 938.827093 225.583787 941.933227 229.372587 941.933227L533.978453 941.933227C552.820053 941.933227 568.111787 957.190827 568.111787 976.06656 568.111787 994.942293 552.820053 1010.199893 533.978453 1010.199893L229.372587 1010.199893C187.93472 1010.199893 154.210987 976.47616 154.210987 935.00416L154.210987 254.283093C154.210987 235.40736 169.468587 220.14976 188.34432 220.14976L824.180053 220.14976C843.021653 220.14976 858.313387 235.40736 858.313387 254.283093L858.313387 935.00416C858.313387 976.47616 824.589653 1010.199893 783.117653 1010.199893" p-id="1276" fill="#009193"></path><path d="M866.484907 288.39936 143.98464 288.39936C125.14304 288.39936 109.851307 273.14176 109.851307 254.266027 109.851307 235.390293 125.14304 220.132693 143.98464 220.132693L866.484907 220.132693C885.326507 220.132693 900.61824 235.390293 900.61824 254.266027 900.61824 273.14176 885.326507 288.39936 866.484907 288.39936" p-id="1277" fill="#009193"></path><path d="M559.284907 463.366827 343.118507 463.366827C324.242773 463.366827 308.985173 448.109227 308.985173 429.233493 308.985173 410.35776 324.242773 395.10016 343.118507 395.10016L559.284907 395.10016C578.126507 395.10016 593.41824 410.35776 593.41824 429.233493 593.41824 448.109227 578.126507 463.366827 559.284907 463.366827" p-id="1278" fill="#009193"></path><path d="M667.368107 609.56672 343.10144 609.56672C324.25984 609.56672 308.968107 594.30912 308.968107 575.433387 308.968107 556.557653 324.25984 541.300053 343.10144 541.300053L667.368107 541.300053C686.209707 541.300053 701.50144 556.557653 701.50144 575.433387 701.50144 594.30912 686.209707 609.56672 667.368107 609.56672" p-id="1279" fill="#009193"></path><path d="M667.368107 755.766613 343.10144 755.766613C324.25984 755.766613 308.968107 740.509013 308.968107 721.63328 308.968107 702.757547 324.25984 687.499947 343.10144 687.499947L667.368107 687.499947C686.209707 687.499947 701.50144 702.757547 701.50144 721.63328 701.50144 740.509013 686.209707 755.766613 667.368107 755.766613" p-id="1280" fill="#009193"></path></svg>'
  span12.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let id = span.getAttribute('cardid')
    Zotero.openInViewer('chrome://zoterozotcard/content/cardcontent.html?id=' + id)
  }
  divWarp.appendChild(span12)
  
  span = document.createElement('span')
  span.setAttribute('class', 'placeholder-color')
  span.textContent = ' | '
  divWarp.appendChild(span)

  let span4 = document.createElement('span')
  span4.setAttribute('class', 'pointer')
  span4.setAttribute('title', '专注模式')
  span4.setAttribute('cardid', card.id)
  span4.innerHTML = '<svg t="1637915668812" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11269" width="16" height="16"><path d="M1023.8194 125.697354l-112.69418-13.003174L898.122046 0 805.474427 92.647619C722.398589 34.313933 621.262787 0 512 0 229.180952 0 0 229.180952 0 512S229.180952 1024 512 1024s511.8194-229.361552 511.8194-512c0-109.262787-34.313933-210.579189-92.647619-293.655026l92.647619-92.64762z m-214.191181 65.015874L843.400353 156.941093l2.347795 21.130159 21.130159 2.347796-33.772134 33.772134-49.845503 49.845502-18.601763 18.601764-21.130159-2.347795-2.347796-21.130159 18.601764-18.601764 49.845503-49.845502zM949.954145 512C949.954145 753.822928 753.822928 949.954145 512 949.954145S73.865256 753.822928 73.865256 512 269.996473 73.865256 512 73.865256c88.855026 0 171.389065 26.367549 240.378131 71.878659l-87.04903 87.04903 7.585185 65.918872L572.500882 399.12522c-18.059965-9.752381-38.648325-15.17037-60.500882-15.17037-70.614462 0-128.04515 57.430688-128.04515 128.04515s57.430688 128.04515 128.04515 128.04515c70.614462 0 128.04515-57.430688 128.04515-128.04515 0-21.852557-5.598589-42.440917-15.17037-60.500882l100.413403-100.413404 65.918872 7.585185 87.04903-87.04903c45.330511 68.808466 71.69806 151.523104 71.69806 240.378131z m-382.148854 0c0 30.70194-25.103351 55.805291-55.805291 55.805291s-55.805291-25.103351-55.805291-55.805291 25.103351-55.805291 55.805291-55.805291 55.805291 24.922751 55.805291 55.805291z" p-id="11270" fill="#009193"></path></svg>'
  span4.onclick = function (e) {
    let span = e.target
    while (span.tagName !== 'SPAN') {
      span = span.parentElement
    }
    let id = span.getAttribute('cardid')
    Zotero.debug(`id: ${id}`)
    showConcentration(id)
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
  cardContentAll.hidden  = !extra[card.id].expand
  cardContent.appendChild(cardContentAll)

  let cardTitle = document.createElement('div')
  cardTitle.setAttribute('class', 'card-title')
  cardTitle.innerHTML = `<h1 class="linenowrap" style="text-align: center;">${card.title}</h1>`
  cardTitle.hidden  = extra[card.id].expand
  cardContent.appendChild(cardTitle)
  cardDiv.appendChild(cardContent)

  hr = document.createElement('hr')
  cardDiv.appendChild(hr)

  let footer = document.createElement('div')
  footer.setAttribute('class', 'footer')

  let span14 = document.createElement('span')
  span14.setAttribute('id', 'dateModified')
  span14.textContent = `修改时间：${card.dateModified}`
  footer.appendChild(span14)

  let span13 = document.createElement('span')
  span13.setAttribute('id', 'words')
  span13.textContent = `字数：${card.words}`
  footer.appendChild(span13)

  cardDiv.appendChild(footer)

  return cardDiv
}

function matchNote (note) {
  let newNote = Zotero.getMainWindow().Zotero.ZotCard.Utils.clearShadowAndBorder(note)
  let filterText = document.getElementById('filter-text').value
  if (document.getElementById('highlight').checked && filterText) {
    newNote = newNote.replace(filterText, '<span class="highlight">' + filterText + '</span>')
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
    document.getElementById('searching').hidden = false
    let htmls = ''
    for (let index = 0; index < document.getElementById('content-list').children.length; index++) {
      const element = document.getElementById('content-list').children[index]
      htmls += element.querySelector('.card-all').innerHTML
    }
    if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(htmls)) {
      Zotero.ZotCard.Utils.error('复制失败。')
    } else {
      Zotero.ZotCard.Utils.success(`成功复制 ${document.getElementById('content-list').children.length} 张卡，现在可以往编辑软件粘贴了。`)
    }
    document.getElementById('searching').hidden = true
  }
}

function expandAll (expand) {
  document.getElementById('searching').hidden = false
  for (let index = 0; index < results.length; index++) {
    const card = results[index]
    extra[card.id].expand = expand
    const element = document.getElementById(card.id)
    if (element) {
      element.querySelector('.card-all').hidden = !expand
      element.querySelector('.card-title').hidden = expand
      let expandElement = element.querySelector('.expand')
      expandElement.setAttribute('title', extra[card.id].expand ? '收起' : '展开')
      expandElement.innerHTML = extra[card.id].expand ? '<svg t="1637915636352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10917" width="16" height="16"><path d="M711.131429 615.570286L512 482.816l-199.131429 132.754286a36.571429 36.571429 0 0 1-40.594285-60.854857l219.428571-146.285715a36.571429 36.571429 0 0 1 40.594286 0l219.428571 146.285715a36.571429 36.571429 0 0 1-40.594285 60.854857zM512 950.857143c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z m0 73.142857C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z" p-id="10918" fill="#009193"></path></svg>' : '<svg t="1637915636352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10917" width="16" height="16"><path d="M711.131429 408.429714a36.571429 36.571429 0 0 1 40.594285 60.854857l-219.428571 146.285715a36.571429 36.571429 0 0 1-40.594286 0l-219.428571-146.285715a36.571429 36.571429 0 1 1 40.594285-60.854857L512 541.184l199.131429-132.754286zM512 950.857143c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z m0 73.142857C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z" p-id="12112" fill="#009193"></path></svg>'
    }
  }
  loadNum()
  Zotero.debug(extra)
  document.getElementById('searching').hidden = true
}

function showConcentration (cardid) {
  let card = cardOfCards(cardid)
  let index = indexOfCardLists(cardid)
  document.getElementById('read').hidden = true
  document.body.style.backgroundColor = '#272727'
  document.getElementById('concentration').hidden = false
  document.getElementById('concentration').setAttribute('card-id', cardid)
  document.getElementById('one-card-progress').textContent = `${index + 1}/${document.getElementById('content-list').children.length}`
  document.getElementById('one-card-content').innerHTML = matchNote(card.note)
  document.getElementById('one-card-dateAdded').textContent = card.dateAdded
  document.getElementById('one-card-dateModified').textContent = card.dateModified
  document.getElementById('one-card-date').textContent = card.date ? card.date : '无'
  document.getElementById('one-card-hangzis').textContent = card.words
  document.getElementById(`tag-${card.id}`).setAttribute('class', 'readed')
  document.getElementById(`tag-${card.id}`).textContent = '◉'

  document.getElementById('oneCardRemove').setAttribute('title', extra[card.id].hidden ? '显示' : '隐藏')
  document.getElementById('oneCardRemove').innerHTML = extra[card.id].hidden ? '<svg t="1637915376666" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6173" width="16" height="16"><path d="M514.1 291.6c60 0 122.2 21 184.9 62.5 67.6 44.6 110.5 97 121.9 111.9 11.3 14.8 17.6 30.9 18.1 46.8-0.5 16.4-6.8 32.9-18.1 47.6-11.5 15-54.3 67.3-121.9 111.9-62.7 41.4-125 62.5-185.1 62.5-60 0-122.3-21-185-62.5-67.6-44.6-110.4-96.9-121.9-111.9-11.3-14.9-17.5-31-18-46.8 0.5-16.4 6.7-32.8 18-47.7 11.6-15.1 54.5-67.3 122-111.9 62.7-41.4 125-62.4 185.1-62.4m0-96.2c-79.2 0-159.4 26.4-238.1 78.4-77.9 51.4-127.5 110.6-145.3 133.6l-0.1 0.2-0.1 0.2C106.8 439 93.8 475 92.9 511.9v3.8c0.9 36.2 13.9 71.9 37.6 103.1l0.1 0.2 0.1 0.2c17.7 23 67.3 82.1 145.2 133.6 78.7 52 158.8 78.4 238 78.4 79.3 0 159.3-26.4 238.1-78.4C829.9 701.1 879.4 642 897.1 619c24-31.2 37.1-67.3 38-104.3v-2l-0.1-2c-0.9-36.4-14.1-72.2-38-103.3-17.8-23.1-67.4-82.2-145.2-133.6-78.5-52-158.6-78.4-237.7-78.4z" p-id="6174" fill="#009193"></path><path d="M514 513.2m-161.1 0a161.1 161.1 0 1 0 322.2 0 161.1 161.1 0 1 0-322.2 0Z" p-id="6175" fill="#009193"></path></svg>' : '<svg t="1637915315755" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5198" width="16" height="16"><path d="M944.1 462.9c-0.2-0.1-0.4-0.2-0.5-0.4-3.7-2.8-17-12.8-34.4-24.8-1.6-1.1-2-2.7-2-3.5-0.1-0.8 0-2.3 1.4-3.7 13.5-13 26.6-26.6 39-40.6 0.6-0.6 1-1.2 1.5-1.8 12.5-16.6 13-39.2 1.2-56.3-2-2.9-4.4-5.4-7.2-7.3-5.4-3.8-11.7-5.2-18-4.2-12 1.9-20.8 12.1-26.4 19.7-46.3 58.6-205.3 210.2-385.6 210.3-48-0.5-95.1-8.9-140.1-25l-39.7-16.1c-37.8-17.1-74-38-107.5-62.2l-28.1-21.1c-25.5-19.6-49.1-41.8-70-66-0.7-0.8-1.4-1.6-2.2-2.3l-1.8-1.7c-6.2-5.8-11.5-10.8-17.8-13.5-5.3-2.3-15.8-4.6-26.6 5-19 17-14.2 41.3-3.3 58.4 1.1 1.7 2.4 3.3 3.8 4.8 15.9 16 32.7 31.5 50.1 46 1.5 1.3 1.7 2.9 1.7 3.7 0 0.8-0.3 2.4-2 3.6-12.7 9-22.1 15.9-24.7 17.8-0.1 0-0.2 0.1-0.7 0.4-7.8 4.5-13.3 11.7-15.5 20.2-2.4 8.9-0.8 18.4 4.3 26.1 9.5 15.5 29.7 20.8 46 12.1 5.6-3 11.8-7.6 20.5-14 7.4-5.5 16.6-12.3 28.2-20.1 1.7-1.2 4-1.1 5.8 0.1 28.8 19.9 59.4 37.9 90.8 53.6 1.6 0.8 2.3 2.2 2.5 2.9 0.2 0.7 0.5 2.1-0.4 3.6l-28.7 48.3c-4.6 7.6-5.8 16.6-3.5 25.1 2.3 8.6 7.9 15.8 15.9 20.3l0.2 0.1c16.2 8.9 37 3.5 46.5-12l32.9-56.2c1.2-2.1 3.8-2.9 6.1-2.1 38.2 14 78.1 23.2 118.7 27.4 2.6 0.3 4.5 2.3 4.5 4.7V671c0 18.3 15.4 33.3 34.3 33.3s34.3-14.9 34.3-33.3v-49.6c0-2.4 1.9-4.4 4.5-4.7 40.1-4.2 79.5-13.7 117-28.2 2.3-0.9 5 0 6.2 2l34.2 58.5 0.1 0.1c9.5 15.7 29.7 21.1 46.1 12.4l0.3-0.2c7.9-4.5 13.5-11.7 15.8-20.3 2.3-8.5 1.1-17.4-3.5-25L737 562.4c-1.3-2.2-0.5-5.1 1.9-6.4 38.7-21.1 75.7-45.8 110-73.3 1.7-1.4 4.2-1.5 6-0.3 25.1 16.5 45.5 31.2 51.1 35.4 1.9 1.4 3.8 2.5 5.8 3.3 15.9 6.7 34.5 0.9 43.3-13.6 9.2-15.3 4.4-34.9-11-44.6z" p-id="5199" fill="#009193"></path></svg>'
}

function oneCardPrevious () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  let previousElementSibling = document.getElementById(id).previousElementSibling
  if (previousElementSibling) {
    showConcentration(previousElementSibling.id)
  }
}

function oneCardNext () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  let nextElementSibling = document.getElementById(id).nextElementSibling
  if (nextElementSibling) {
    showConcentration(nextElementSibling.id)
  }
}

function oneCardLocation () {
  let id = document.getElementById('concentration').getAttribute('card-id')
  selectItem(id)
}

function emptyResult () {
  document.getElementById('read').hidden = false
  document.getElementById('loading').hidden = true
  document.getElementById('content').hidden = false
  document.getElementById('content-empty').hidden = false
  document.getElementById('concentration').hidden = true
  document.body.style.backgroundColor = '#F5F5F5'
  loadNum()
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
  hideOrShowCard(id)
  if (document.getElementById('showHidden').checked) {
    showConcentration(id)
  } else {
    let hides = results.filter(e => !extra[e.id] || extra[e.id].hidden).length
    if (hides < totals) {
      showConcentration(current.id)
   } else {
      oneCardExit()
    }
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
  let card = Zotero.ZotCard.Utils.toCardItem(item)
  document.getElementById('one-card-content').innerHTML = matchNote(card.note)
  document.getElementById('one-card-dateModified').textContent = card.dateModified
  document.getElementById('one-card-hangzis').textContent = card.words

  refreshCard(id)
}

function oneCardPrint () {
  let id = document.getElementById('concentration').getAttribute('card-id')

  Zotero.openInViewer('chrome://zoterozotcard/content/cardcontent.html?id=' + id)
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
