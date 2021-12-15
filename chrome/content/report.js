'use strict'

var datapack
var options = {}
/*{
  libraryID: 0,
  name: '',
  type: '', // collection|savedSearch|library
  key: '' // user|group|...
}*/
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined
let nowDate = new Date()
let currentYear = nowDate.getYear() + 1900
let currentMonth = nowDate.getMonth() + 1
let currentWeek = weekOfYear(nowDate)
let today = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd')
let now = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd HH:mm:ss')

function start () {
  document.getElementById('loading').hidden = false
  document.getElementById('content').hidden = true
  if (!io) {
    document.getElementById('loading').textContent = '参数错误。'
    return
  }

  document.getElementById('loading').hidden = false
  document.getElementById('content').hidden = true
  if (io.libraryID === Zotero.Libraries.userLibraryID && !io.selectedCollection) {
    document.getElementById('username').textContent = Zotero.Users.getCurrentUsername() || Zotero.Prefs.get('sync.server.username') || '我'
  } else {
    document.getElementById('username').textContent = io.name
  }

  Zotero.ZotCard.CardSearcher.search(io.libraryID, io.selectedCollection, io.selectedSavedSearch, (ids, name) => {

    var map = {
      firstDay: Zotero.ZotCard.Utils.formatDate(new Date(), 'yyyy-MM-dd'),
      firstDayKey: '',
      lastDay: '',
      lastDayKey: '',
      totals: 0,
      hangzis: 0,
      maxHangzi: 0,
      maxHangziNoteTitle: '',
      maxHangziNoteTitleKey: '',
      dates: [],
      others: [],
      collects: {
        totals: 0,
        cards: [],
        contents: []
      },
      cards: {},
      tags: {},
      years: {}
    }
    var items = Zotero.Items.get(ids)
    Zotero.debug(`搜索到：${items.length}`)
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      document.getElementById('progress').textContent = `${index + 1}/${items.length}`
      if (!item.isNote()) {
        Zotero.debug(`跳过统计。`)
        continue
      }
      let noteTitle = item.getNoteTitle()

      if (['目录', '豆瓣短评', '初步评价'].includes(noteTitle)) {
        Zotero.debug(`${noteTitle}跳过统计。`)
        continue
      }

      let cardItem = Zotero.ZotCard.Utils.toCardItem(item)
      let noteContent = item.getNote()
      options = Zotero.ZotCard.Utils.refreshOptions(cardItem, options)
      let dateString = cardItem.date
      let { date, year, month, week } = dateinfo(dateString)
      if (year < 1900 || year > currentYear) {
        map.others.push({
          title: noteTitle,
          content: item.key,
          message: '日期格式错误。'
        })
      }

      let author = cardItem.author
      if (author) {
        map.collects.totals += 1
        if (!map.collects.cards.hasOwnProperty(author)) {
          map.collects.cards[author] = 0
        }
        map.collects.cards[author] += 1
        map.collects.contents.push(cardItem)
        continue
      }

      let cardName = cardItem.type
      let cardTags = cardItem.tags

      if (date < map.firstDay) {
        map.firstDay = date
        map.firstDayKey = item.key
      }
      if (date > map.lastDay) {
        map.lastDay = date
        map.lastDayKey = item.key
      }

      let hangzi = cardItem.words
      map.totals++
      if (hangzi > map.maxHangzi) {
        map.maxHangzi = hangzi
        map.maxHangziNoteTitle = noteTitle
        map.maxHangziNoteTitleKey = item.key
      }
      map.hangzis += hangzi
      if (!map.dates.hasOwnProperty(date)) {
        map.dates[date] = 0
      }
      map.dates[date] = map.dates[date] + 1
      if (!map.cards.hasOwnProperty(cardName)) {
        map.cards[cardName] = 0
      }
      map.cards[cardName] = map.cards[cardName] + 1
      if (cardTags && cardTags.length > 0) {
        cardTags.forEach(cardTag => {
          if (!map.tags.hasOwnProperty(cardTag)) {
            map.tags[cardTag] = 0
          }
          map.tags[cardTag] = map.tags[cardTag] + 1
        })
      } else {
        let cardTag = '无'
        if (!map.tags.hasOwnProperty(cardTag)) {
          map.tags[cardTag] = 0
        }
        map.tags[cardTag] = map.tags[cardTag] + 1
      }

      if (!map.years.hasOwnProperty(year)) {
        map.years[year] = {
          totals: 0,
          hangzis: 0,
          dates: [],
          months: {},
          weeks: {},
          cards: {},
          tags: {}
        }
      }
      map.years[year].totals = map.years[year].totals + 1
      map.years[year].hangzis += hangzi
      if (!map.years[year].dates.includes(date)) {
        map.years[year].dates.push(date)
      }
      if (!map.years[year].cards.hasOwnProperty(cardName)) {
        map.years[year].cards[cardName] = 0
      }
      map.years[year].cards[cardName] = map.years[year].cards[cardName] + 1
      if (cardTags && cardTags.length > 0) {
        cardTags.forEach(cardTag => {
          if (!map.years[year].tags.hasOwnProperty(cardTag)) {
            map.years[year].tags[cardTag] = 0
          }
          map.years[year].tags[cardTag] = map.years[year].tags[cardTag] + 1
        })
      } else {
        let cardTag = '无'
        if (!map.years[year].tags.hasOwnProperty(cardTag)) {
          map.years[year].tags[cardTag] = 0
        }
        map.years[year].tags[cardTag] = map.years[year].tags[cardTag] + 1
      }

      if (!map.years[year].months.hasOwnProperty(month)) {
        map.years[year].months[month] = {
          totals: 0,
          contents: [],
          cards: {}
        }
      }
      map.years[year].months[month].totals = map.years[year].months[month].totals + 1
      map.years[year].months[month].contents.push(cardItem)
      if (!map.years[year].months[month].cards.hasOwnProperty(cardName)) {
        map.years[year].months[month].cards[cardName] = 0
      }
      map.years[year].months[month].cards[cardName] = map.years[year].months[month].cards[cardName] + 1

      if (!map.years[year].weeks.hasOwnProperty(week)) {
        map.years[year].weeks[week] = {
          totals: 0,
          contents: [],
          cards: {}
        }
      }
      map.years[year].weeks[week].totals = map.years[year].weeks[week].totals + 1
      map.years[year].weeks[week].contents.push(cardItem)
      if (!map.years[year].weeks[week].cards.hasOwnProperty(cardName)) {
        map.years[year].weeks[week].cards[cardName] = 0
      }
      map.years[year].weeks[week].cards[cardName] = map.years[year].weeks[week].cards[cardName] + 1
    }

    datapack = map
    //Zotero.debug(map)

    // {
    //      "totals": 0,
    //      "hangzis": 0,
    //      "maxHangzi": 0,
    //      "others": [],
    //      "dates": [],
    //      "cards": {
    //          "金句卡": 12,
    //          "...卡": 12,
    //          "其他": 12
    //      },
    //      "tags": {
    //           "v1": 12,
    //           "无": 12
    //      },
    //      "years": {
    //          "2021": {
    //              "totals": 1,
    //              "hangzis": 0,
    //              "dates": [],
    //              "months": {
    //                  "1": {
    //                      "totals": 1,
    //                      "cards": {
    //                          "金句卡": 12,
    //                          "...卡": 12,
    //                          "其他": 12
    //                      },
    //                      "contents": []
    //                  }
    //              },
    //              "weeks": {
    //                  "1": {
    //                      "totals": 1,
    //                      "cards": {
    //                          "金句卡": 12,
    //                          "...卡": 12,
    //                          "其他": 12
    //                      },
    //                      "contents": []
    //                  }
    //              },
    //              "cards": {
    //                  "金句卡": 12,
    //                  "...卡": 12,
    //                  "其他": 12
    //              },
    //              "tags": {
    //                   "v1": 12,
    //                   "无": 12
    //              }
    //          }
    //      }
    // }


    document.getElementById('progress').textContent = ''
    document.getElementById('loading').hidden = map.totals > 0
    document.getElementById('content').hidden = map.totals === 0
    document.getElementById('loading').textContent = '未找到卡片，赶紧写卡吧。'
    
    document.getElementById('totals').textContent = map.totals
    document.getElementById('hangzis').textContent = map.hangzis
    document.getElementById('maxHangzi').textContent = map.maxHangzi
    document.getElementById('maxHangziNoteTitle').textContent = map.maxHangziNoteTitle
    document.getElementById('maxHangziNoteTitle').setAttribute('card-key', map.maxHangziNoteTitleKey)
    let datesLength = Object.keys(map.dates).length
    document.getElementById('dates').textContent = datesLength
    let totalDays = diffDay(map.firstDay, today)
    document.getElementById('totalDays').textContent = totalDays
    document.getElementById('ratio').textContent = parseInt(datesLength / totalDays * 100) + '%'
    document.getElementById('average1').textContent = (map.totals / totalDays).toFixed(1)
    document.getElementById('average2').textContent = parseInt(map.hangzis / map.totals)
    document.getElementById('first-card-date').textContent = map.firstDay
    document.getElementById('first-card-date').setAttribute('card-key', map.firstDayKey)
    document.getElementById('last-card-date').textContent = map.lastDay
    document.getElementById('last-card-date').setAttribute('class', map.lastDay === today ? 'pointer current' : 'pointer')
    document.getElementById('last-card-date').setAttribute('card-key', map.lastDayKey)

    let noCardDays = (new Date(today) - new Date(map.lastDay)) / (24 * 60 * 60 * 1000)
    if (noCardDays > 0) {
      document.getElementById('no-card').innerHTML = `，已经连续 <span class="orangered">${noCardDays}</span> 天没写卡了`
    }

    document.getElementById('now').textContent = now
    document.querySelectorAll('.today').forEach(element => {
      element.textContent = today
    })
    document.getElementById('week').textContent = currentWeek

    // 卡片分类
    let cardArrs = []
    for (const card in map.cards) {
    if (Object.hasOwnProperty.call(map.cards, card)) {
      const element = map.cards[card]
        cardArrs.push({
          name: card,
          value: element
        })
      }
    }
    const hidable = 10
    cardArrs.sort((a, b) => b.value - a.value)
    document.getElementById('cardtypes').innerHTML = ''
    for (let index = 0; index < cardArrs.length; index++) {
      let div = document.createElement('div')
      div.setAttribute('class', 'item cardtype' + (index >= hidable ? ' hidable' : ''))
      let onclick = function (e) {
        let totals = e.target.getAttribute('totals')
        if (totals === '0') {
          return
        }

        let cardtype = e.target.getAttribute('cardtype')
        let contents = calculateAll()
        let options = Zotero.ZotCard.Utils.bulidOptions(contents)
        let io = {
          dataIn: {
            title: document.getElementById('username').textContent,
            cards: contents,
            options: options,
            filters: {
              cardtype: cardtype
            }
          }
        }
        Zotero.debug(`${cardtype}, ${contents.length}`)
        window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
      }
      let span2 = document.createElement('span')
      span2.setAttribute('class', `label`)
      span2.textContent = cardArrs[index].name
      span2.setAttribute('totals', cardArrs[index].value)
      span2.setAttribute('cardtype', cardArrs[index].name)
      div.appendChild(span2)
      div.appendChild(document.createElement('hr'))
      let span1 = document.createElement('span')
      span1.setAttribute('class', 'pointer value uread-color')
      span1.textContent = cardArrs[index].value
      span1.setAttribute('totals', cardArrs[index].value)
      span1.setAttribute('cardtype', cardArrs[index].name)
      span1.onclick = onclick
      div.appendChild(span1)
      document.getElementById('cardtypes').append(div)
    }
    if (cardArrs.length > hidable) {
      let tag = document.createElement('div')
      tag.setAttribute('class', 'cardtype more')
      tag.setAttribute('mode', 'hidden')
      tag.innerHTML = '<<'
      tag.onclick = function (e) {
        let div = e.target
        while (div.tagName !== 'DIV') {
          div = div.parentElement
        }
        let mode = div.getAttribute('mode')
        if (mode === 'hidden') {
          div.parentElement.querySelectorAll('.hidable').forEach(e => e.style.display  = 'none')
          div.setAttribute('mode', 'show')
          div.innerHTML = '>>'
        } else {
          div.parentElement.querySelectorAll('.hidable').forEach(e => e.style.display  = 'flex')
          div.setAttribute('mode', 'hidden')
          div.innerHTML = '<<'
        }
      }
      document.getElementById('cardtypes').append(tag)
    }

    // 卡片标签
    cardArrs = []
    for (const card in map.tags) {
    if (Object.hasOwnProperty.call(map.tags, card)) {
      const element = map.tags[card]
        cardArrs.push({
          name: card,
          value: element
        })
      }
    }
    cardArrs.sort((a, b) => b.value - a.value)
    document.getElementById('cardtags').innerHTML = ''
    for (let index = 0; index < cardArrs.length; index++) {
      let div = document.createElement('div')
      div.setAttribute('class', 'tag' + (index >= hidable ? ' hidable' : ''))
      div.setAttribute('totals', cardArrs[index].value)
      div.setAttribute('cardtag', cardArrs[index].name)
      let onclick = function (e) {
        let totals = e.target.getAttribute('totals')
        if (totals === '0') {
          return
        }

        let cardtag = e.target.getAttribute('cardtag')
        let contents = calculateAll()
        let options = Zotero.ZotCard.Utils.bulidOptions(contents)
        let io = {
          dataIn: {
            title: document.getElementById('username').textContent,
            cards: contents,
            options: options,
            filters: {
              cardtag: cardtag
            }
          }
        }
        Zotero.debug(`${cardtag}, ${contents.length}`)
        window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
      }
      div.textContent = `${cardArrs[index].name}(${cardArrs[index].value})`
      div.onclick = onclick
      document.getElementById('cardtags').appendChild(div)
    }
    if (cardArrs.length > hidable) {
      let tag = document.createElement('div')
      tag.setAttribute('class', 'tag')
      tag.setAttribute('mode', 'hidden')
      tag.innerHTML = '<<'
      tag.onclick = function (e) {
        let div = e.target
        while (div.tagName !== 'DIV') {
          div = div.parentElement
        }
        let mode = div.getAttribute('mode')
        if (mode === 'hidden') {
          div.parentElement.querySelectorAll('.hidable').forEach(e => e.hidden = true)
          div.setAttribute('mode', 'show')
          div.innerHTML = '>>'
        } else {
          div.parentElement.querySelectorAll('.hidable').forEach(e => e.hidden = false)
          div.setAttribute('mode', 'hidden')
          div.innerHTML = '<<'
        }
      }
      document.getElementById('cardtags').append(tag)
    }

    // 近30天
    dateSelectChange()

    // 近12周
    weekSelectChange()

    // 年
    document.getElementById('years').innerHTML = ''
    let yearsArrs = []
    for (const y in map.years) {
      if (Object.hasOwnProperty.call(map.years, y)) {
        const element = map.years[y]
        yearsArrs.push({
          name: y,
          value: element
        })
      }
    }

    yearsArrs.sort((a, b) => b.name > a.name ? 1 : -1)
    for (const item of yearsArrs) {
      let totalDate = daysOfYear(item.name)
      let divYears = document.createElement('div')
      divYears.setAttribute('class', 'year-section')
      let pYearItemLabel = document.createElement('p')
      pYearItemLabel.setAttribute('class', 'item-label')
      pYearItemLabel.innerHTML = `年一共<span class="uread-color">${item.value.dates.length}</span>天写卡，占一年的 <span class="uread-color">${parseInt(item.value.dates.length / totalDate * 100)}%</span>，累计 <span class="uread-color">${item.value.hangzis}</span> 字，写卡 <span class="uread-color">${item.value.totals}</span> 张。其中`
      pYearItemLabel.append(cards(item.name, item.value.cards))
      pYearItemLabel.append('，')
      pYearItemLabel.append(tags(item.name, item.value.tags))
      let bYear = document.createElement('b')
      bYear.setAttribute('class', 'pointer')
      bYear.setAttribute('year', item.name)
      bYear.textContent = `${item.name}`
      bYear.onclick = function (e) {
        readWithYear(e.target.getAttribute('year'))
      }
      pYearItemLabel.prepend(bYear)
      divYears.appendChild(pYearItemLabel)
      let divYearDetail = document.createElement('div')
      divYearDetail.setAttribute('class', 'detail')
      divYears.appendChild(divYearDetail)

      for (let m = 1; m <= 12; m++) {
        if (item.name === `${currentYear}` && m > currentMonth) {
          continue
        }
        let value = 0
        if (item.value.months.hasOwnProperty(m)) {
          value = item.value.months[m].totals
        }
        let div = document.createElement('div')
        div.setAttribute('class', `item${item.name === `${currentYear}` && m === currentMonth ? ' current-wrap' : ''}`)
        let onclick = function (e) {
          let totals = e.target.getAttribute('totals')
          if (totals === '0') {
            return
          }

          let year = e.target.getAttribute('year')
          let month = e.target.getAttribute('month')
          let contents = calculateYear(year)
          let options = Zotero.ZotCard.Utils.bulidOptions(contents)
          let tmp = new Date(year, parseInt(month))
          tmp.setDate(tmp.getDate() - 1)
          let io = {
            dataIn: {
              title: `${year}年`,
              cards: contents,
              options: options,
              filters:{
                startDate: Zotero.ZotCard.Utils.formatDate(new Date(year, parseInt(month) - 1), 'yyyy-MM-dd'),
                endDate: Zotero.ZotCard.Utils.formatDate(tmp, 'yyyy-MM-dd'),
              }
            }
          }
          window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
        }
        let span1 = document.createElement('span')
        span1.setAttribute('class', `${value > 0 ? 'pointer' : ''} value ${value === 0 ? 'zero' : 'uread-color'}`)
        span1.textContent = value
        span1.setAttribute('year', item.name)
        span1.setAttribute('totals', value)
        span1.setAttribute('month', m)
        span1.onclick = onclick
        div.appendChild(span1)
        let span2 = document.createElement('span')
        span2.setAttribute('class', `label${item.name === `${currentYear}` && m === currentMonth ? ' current' : ''}`)
        span2.textContent = `${m}月`
        span2.setAttribute('year', item.name)
        span2.setAttribute('totals', value)
        span2.setAttribute('month', m)
        div.appendChild(span2)
        divYearDetail.appendChild(div)
      }
      document.getElementById('years').appendChild(divYears)
    }

    document.getElementById('collect-wrap').hidden = (map.collects.totals === 0)
    document.getElementById('collects').innerHTML = map.collects.totals
    document.getElementById('collects-details').append(cardsWithAuthor(map.collects.cards))
    
    document.getElementById('other-wrap').hidden = (map.others.length === 0)
    document.getElementById('other').innerHTML = ''
    for (const item of map.others) {
      let p = document.createElement('p')
      p.setAttribute('class', 'other-item pointer')
      p.setAttribute('card-key', item.key)
      p.textContent = `「${item.title} 」${item.message}`
      p.onclick = function (e) {
        selectItem(e.target)
      }
      document.getElementById('other').appendChild(p)
    }
  })
}

function dateSelectChange () {
  let days = 0
  let map = datapack
  switch (document.getElementById('dateselect').value) {
    case 'all':
      days = diffDay(map.firstDay, today)
      break
    case '30d':
      days = 30
      break
    case '90d':
      days = 90
      break
    case '180d':
      days = 180
      break
    case 'year':
      days = 365
      break
    default:
      break
  }

  document.getElementById('30days').innerHTML = ''
  for (let w = days; w  >= 0; w--) {
    let now = new Date()
    now.setDate(now.getDate() - w)
    let date = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
    let value = 0
    if (map.dates.hasOwnProperty(date)) {
      value = map.dates[date]
    } else {
      Zotero.debug(`没有${date}的数据。`)
    }

    let div = document.createElement('div')
    div.setAttribute('class', `item${date === today ? ' current-wrap' : ''}`)
    let onclick = function (e) {
      let totals = e.target.getAttribute('totals')
      if (totals === '0') {
        return
      }

      let contents = calculateAll()
      let options = Zotero.ZotCard.Utils.bulidOptions(contents)
      let io = {
        dataIn: {
          title: document.getElementById('username').textContent,
          cards: contents,
          options: options,
          filters: {
            startDate: date,
            endDate: date
          }
        }
      }
      Zotero.debug(`${date}, ${contents.length}`)
      window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
    }
    let span1 = document.createElement('span')
    span1.setAttribute('class', `${value > 0 ? 'pointer' : ''} value ${value === 0 ? 'zero' : 'uread-color'}`)
    span1.textContent = value
    span1.setAttribute('totals', value)
    span1.onclick = onclick
    div.appendChild(span1)
    let span2 = document.createElement('span')
    span2.setAttribute('class', `label${date === today ? ' current' : ''}`)
    span2.textContent = date
    span2.setAttribute('totals', value)
    div.appendChild(span2)
    document.getElementById('30days').appendChild(div)
  }
}

function weekSelectChange() {
  let weeks = 0
  let map = datapack
  switch (document.getElementById('weekselect').value) {
    case '13':
      weeks = 13
      break
    case '26':
      weeks = 26
      break
    case '53':
      weeks = 53
      break
    default:
      break
  }

  let minWeek = Math.max(0, currentWeek - (weeks - 1))
  document.getElementById('weeks').innerHTML = ''
  for (let w = minWeek; w <= currentWeek; w++) {
    let value = 0
    if (map.years.hasOwnProperty(currentYear)) {
      if (map.years[currentYear].weeks.hasOwnProperty(w)) {
        value = map.years[currentYear].weeks[w].totals
      } else {
        Zotero.debug(`没有${currentYear}第${w}周的数据。`)
      }
    } else {
      Zotero.debug(`没有${currentYear}的数据。`)
    }

    let div = document.createElement('div')
    div.setAttribute('class', `item${w === currentWeek ? ' current-wrap' : ''}`)
    let onclick = function (e) {
      let totals = e.target.getAttribute('totals')
      if (totals === '0') {
        return
      }

      let year = e.target.getAttribute('year')
      let week = e.target.getAttribute('week')
      let contents = datapack.years[year].weeks[week].contents
      let options = Zotero.ZotCard.Utils.bulidOptions(contents)
      let io = {
        dataIn: {
          title: `${year}年第${week}周`,
          cards: contents,
          options: options
        }
      }
      Zotero.debug(`${year}, ${week}, ${contents.length}`)
      window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
    }
    let span1 = document.createElement('span')
    span1.setAttribute('class', `${value > 0 ? 'pointer' : ''} value ${value === 0 ? 'zero' : 'uread-color'}`)
    span1.textContent = value
    span1.setAttribute('year', currentYear)
    span1.setAttribute('totals', value)
    span1.setAttribute('week', w)
    span1.onclick = onclick
    div.appendChild(span1)
    let span2 = document.createElement('span')
    span2.setAttribute('class', `label${w === currentWeek ? ' current' : ''}`)
    span2.textContent = `W${w}`
    span2.setAttribute('year', currentYear)
    span2.setAttribute('totals', value)
    span2.setAttribute('week', w)
    div.appendChild(span2)
    document.getElementById('weeks').appendChild(div)
  }
}

function readWithYear (year, filters) {
  var progressWin = new Zotero.ProgressWindow({ window })
  let itemProgress = new progressWin.ItemProgress(
    `chrome://zotero-platform/content/treesource-collection${Zotero.hiDPISuffix}.png`,
    '处理中 ...'
  )
  itemProgress.setProgress(50)
  progressWin.show()
  let contents = calculateYear(year)
  let options = Zotero.ZotCard.Utils.bulidOptions(contents)
  let io = {
    dataIn: {
      title: `${year}年`,
      cards: contents,
      options: options,
      filters: filters
    }
  }
  progressWin.close()
  window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
}

function collects (filters) {
  let contents = datapack.collects.contents
  let options = Zotero.ZotCard.Utils.bulidOptions(contents)
  let io = {
    dataIn: {
      title: `收藏`,
      cards: contents,
      options: options,
      filters: filters
    }
  }
  window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
}

function readAll () {
  var progressWin = new Zotero.ProgressWindow({ window })
  let itemProgress = new progressWin.ItemProgress(
    `chrome://zotero-platform/content/treesource-collection${Zotero.hiDPISuffix}.png`,
    '处理中 ...'
  )
  itemProgress.setProgress(50)
  progressWin.show()

  let contents = calculateAll()
  let options = Zotero.ZotCard.Utils.bulidOptions(contents)
  let io = {
    dataIn: {
      title: `所有`,
      cards: contents,
      options: options
    }
  }
  progressWin.close()
  window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, io)
}

function calculateYear (year) {
  let contents = []
  if (datapack.years.hasOwnProperty(year)) {
    for (let m = 1; m <= 12; m++) {
      if (datapack.years[year].months.hasOwnProperty(m)) {
        contents.push(...datapack.years[year].months[m].contents)
      }
    }
  }
  return contents
}

function calculateAll () {
  let contents = []
  for (const year in datapack.years) {
    if (Object.hasOwnProperty.call(datapack.years, year)) {
      contents.push(...calculateYear(year))
    }
  }
  return contents
}

function selectItem (target) {
  let key = target.getAttribute('card-key')
  Zotero.getMainWindow().ZoteroPane.selectItem(Zotero.Items.getIDFromLibraryAndKey(Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID(), key))
  Zotero.getMainWindow().focus()
}

function stop () {
}

function cards (year, cards) {
  let cardArrs = []
  for (const card in cards) {
    if (Object.hasOwnProperty.call(cards, card)) {
      const element = cards[card]
      cardArrs.push({
        name: card,
        value: element
      })
    }
  }
  const hidable = 5
  let div = document.createElement('div')
  div.setAttribute('class', 'content-line')
  div.textContent = '卡片分类情况 '
  cardArrs.sort((a, b) => b.value - a.value)
  cardArrs.forEach((card, index) => {
    let cardtypemini = document.createElement('div')
    cardtypemini.setAttribute('class', 'cardtypemini' + (index >= hidable ? ' hidable' : ''))
    let span = document.createElement('span')
    span.setAttribute('class', 'label')
    span.textContent = card.name
    cardtypemini.append(span)
    let line = document.createElement('div')
    line.setAttribute('class', 'line')
    cardtypemini.append(line)
    let span1 = document.createElement('span')
    span1.setAttribute('class', 'value uread-color pointer')
    span1.textContent = card.value
    span1.setAttribute('year', year)
    span1.setAttribute('cardtype', card.name)
    span1.onclick = function (e) {
      clickReadCardWithYear(e.target.getAttribute('year'), 'cardtype', e.target.getAttribute('cardtype'))
    }
    cardtypemini.append(span1)
    div.append(cardtypemini)
  })

  if (cardArrs.length > hidable) {
    let tagmini = document.createElement('div')
    tagmini.setAttribute('class', 'cardtypemini more')
    tagmini.setAttribute('mode', 'hidden')
    tagmini.innerHTML = '<<'
    tagmini.onclick = function (e) {
      let div = e.target
      while (div.tagName !== 'DIV') {
        div = div.parentElement
      }
      Zotero.debug(div.parentElement.querySelectorAll('.hidable'))
      let mode = div.getAttribute('mode')
      if (mode === 'hidden') {
        div.parentElement.querySelectorAll('.hidable').forEach(e => e.style.display  = 'none')
        div.setAttribute('mode', 'show')
        div.innerHTML = '>>'
      } else {
        div.parentElement.querySelectorAll('.hidable').forEach(e => e.style.display  = 'flex')
        div.setAttribute('mode', 'hidden')
        div.innerHTML = '<<'
      }
    }
    div.append(tagmini)
  }
  return div
}

function clickReadCardWithYear (year, filter, value) {
  var filters = {}
  filters[filter] = value
  readWithYear(year, filters)
}

function tags (year, tags) {
  let tagArrs = []
  for (const tag in tags) {
    if (Object.hasOwnProperty.call(tags, tag)) {
      const element = tags[tag]
      tagArrs.push({
        name: tag,
        value: element
      })
    }
  }
  const hidable = 5
  let div = document.createElement('div')
  div.setAttribute('class', 'content-line')
  div.textContent = '卡片标签情况 '
  tagArrs.sort((a, b) => b.value - a.value)
  tagArrs.forEach((tag, index) => {
    let tagmini = document.createElement('div')
    tagmini.setAttribute('class', 'tagmini' + (index >= hidable ? ' hidable' : ''))
    tagmini.setAttribute('year', year)
    tagmini.setAttribute('cardtag', tag.name)
    tagmini.textContent = `${tag.name}(${tag.value})`
    tagmini.onclick = function (e) {
      clickReadCardWithYear(e.target.getAttribute('year'), 'cardtag', e.target.getAttribute('cardtag'))
    }
    div.append(tagmini)
  })

  if (tagArrs.length > hidable) {
    let tagmini = document.createElement('div')
    tagmini.setAttribute('class', 'tagmini')
    tagmini.setAttribute('mode', 'hidden')
    tagmini.innerHTML = '<<'
    tagmini.onclick = function (e) {
      let div = e.target
      while (div.tagName !== 'DIV') {
        div = div.parentElement
      }
      let mode = div.getAttribute('mode')
      if (mode === 'hidden') {
        div.parentElement.querySelectorAll('.hidable').forEach(e => e.hidden = true)
        div.setAttribute('mode', 'show')
        div.innerHTML = '>>'
      } else {
        div.parentElement.querySelectorAll('.hidable').forEach(e => e.hidden = false)
        div.setAttribute('mode', 'hidden')
        div.innerHTML = '<<'
      }
    }
    div.append(tagmini)
  }
  
  return div
}

function cardsWithAuthor (cards) {
  let cardArrs = []
  for (const author in cards) {
    if (Object.hasOwnProperty.call(cards, author)) {
      const element = cards[author]
      cardArrs.push({
        name: author,
        value: element
      })
    }
  }
  
  let div = document.createElement('div')
  div.setAttribute('class', 'content-line')
  cardArrs.sort((a, b) => b.value - a.value)
  cardArrs.forEach(card => {
    let cardtypemini = document.createElement('div')
    cardtypemini.setAttribute('class', 'cardtypemini')
    let span = document.createElement('span')
    span.setAttribute('class', 'label')
    span.textContent = card.name
    cardtypemini.append(span)
    let line = document.createElement('div')
    line.setAttribute('class', 'line')
    cardtypemini.append(line)
    let span1 = document.createElement('span')
    span1.setAttribute('class', 'value uread-color pointer')
    span1.textContent = card.value
    span1.setAttribute('cardauthor', card.name)
    span1.onclick = function (e) {
      clickReadCardWithCollect('cardauthor', e.target.getAttribute('cardauthor'))
    }
    cardtypemini.append(span1)
    div.append(cardtypemini)
  })
  return div
}

function clickReadCardWithCollect (filter, value) {
  var filters = {}
  filters[filter] = value
  collects(filters)
}

function weekOfYear (date) {
  let firstDay = new Date()
  let year = date.getYear() + 1900
  firstDay.setYear(year)
  firstDay.setMonth(0)
  firstDay.setDate(1)
  firstDay.setHours(0)
  firstDay.setMinutes(0)
  firstDay.setSeconds(0)
  firstDay.setMilliseconds(0)
  let startOfWeek = 1// 0: 周日开始 1: 周一开始
  firstDay.setDate(1 + (7 - firstDay.getDay() + startOfWeek) % 7)
  let dateGap = date.getTime() - firstDay.getTime()
  let week = Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000)) + 1

  return week
}

function dateinfo (dateString) {
  let now = new Date(dateString)
  let date = Zotero.ZotCard.Utils.formatDate(now, 'yyyy-MM-dd')
  let year = now.getYear() + 1900
  let month = now.getMonth() + 1
  let week = weekOfYear(now)

  return { date, year, month, week }
}

function daysOfYear (year) {
  return diffDay(`${year}-01-01`, `${year}-12-31`)
}

function diffDay (d1, d2) {
  let dd1 = new Date(d1)
  let dd2 = new Date(d2)
  return (dd2 - dd1) / (24 * 60 * 60 * 1000) + 1
}

window.addEventListener('load', start)
