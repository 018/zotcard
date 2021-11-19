'use strict'

var datapack
/*{
  libraryID: 0,
  name: '',
  type: '', // collection|savedSearch|library
  key: '' // user|group|...
}*/
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined


function start () {
  document.getElementById('loading').hidden = false
  document.getElementById('content').hidden = true
  if (!io) {
    document.getElementById('loading').textContent = '参数错误。'
    return
  }

  document.getElementById('loading').hidden = false
  document.getElementById('content').hidden = true
  if (io.type === 'library' && io.key === 'user') {
    document.getElementById('username').textContent = Zotero.Users.getCurrentUsername() || Zotero.Prefs.get('sync.server.username') || '我'
  } else {
    document.getElementById('username').textContent = io.name
  }

  var search = new Zotero.Search()
  search.addCondition('note', 'contains', '')
  search.addCondition('itemType', 'is', 'note')
  if (io.type !== 'savedSearch') {
    search.addCondition('includeParentsAndChildren', 'true', null)
    search.addCondition('recursive', 'true', null)
  }
  if (io.type !== 'library') {
    search.addCondition(io.type, 'is', io.key)
  }
  search.libraryID = io.libraryID
  search.search().then(ids => {
    let nowDate = new Date()
    let currentYear = nowDate.getYear() + 1900
    let currentMonth = nowDate.getMonth() + 1
    let currentWeek = weekOfYear(nowDate)
    let today = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd')
    let now = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd HH:mm:ss')

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
      cards: {},
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

      let noteContent = item.getNote()
      let dateString
      let match0 = Zotero.ZotCard.Utils.htmlToText(noteContent).match(/作者[:：] *?/g)
      if (match0) {
        Zotero.debug(`${noteTitle}忽略`)
        continue
      }

      let match1 = Zotero.ZotCard.Utils.htmlToText(noteContent).match(/日期[:：] *?(\d{4}[-/年.]\d{1,2}[-/月.]\d{1,2}日{0,1})/g)
      if (!match1) {
        Zotero.debug(`${noteTitle}不包含有效日期。`)
        let match3 = Zotero.ZotCard.Utils.htmlToText(noteContent).match(/日期[:：] *?(\d{8})/g)
        if (match3) {
          let match2 = match3[0].match(/\d{8}/g)
          dateString = `${match2[0].substr(0, 4)}-${match2[0].substr(4, 2)}-${match2[0].substr(6, 2)}`
        } else {
          /*map.others.push({
            title: noteTitle,
            key: item.key,
            message: '不包含有效日期。'
          })*/
          dateString = Zotero.ZotCard.Utils.sqlToDate(item.dateAdded, 'yyyy-MM-dd')
        }
      } else {
        let match2 = match1[0].match(/\d{4}[-/年.]\d{1,2}[-/月.]\d{1,2}日{0,1}/g)
        dateString = match2[0].replace(/年|月|\./g, '-').replace(/日/g, '')
      }
      let { date, year, month, week } = dateinfo(dateString)
      if (year < 1900 || year > currentYear) {
        map.others.push({
          title: noteTitle,
          content: item.key,
          message: '日期格式错误。'
        })
      }

      let cardItem = Zotero.ZotCard.Utils.toCardItem(item, date)

      let match3 = noteTitle.match('[\u4e00-\u9fa5]+卡')
      let cardName = match3 ? match3[0] : '其他'

      if (date < map.firstDay) {
        map.firstDay = date
        map.firstDayKey = item.key
      }
      if (date > map.lastDay) {
        map.lastDay = date
        map.lastDayKey = item.key
      }

      let hangzi = Zotero.ZotCard.Utils.hangzi(noteContent)
      map.totals++
      if (hangzi > map.maxHangzi) {
        map.maxHangzi = hangzi
        map.maxHangziNoteTitle = noteTitle
        map.maxHangziNoteTitleKey = item.key
      }
      map.hangzis += hangzi
      if (!map.dates.includes(date)) {
        map.dates.push(date)
      }
      if (!map.cards.hasOwnProperty(cardName)) {
        map.cards[cardName] = 0
      }
      map.cards[cardName] = map.cards[cardName] + 1

      if (!map.years.hasOwnProperty(year)) {
        map.years[year] = {
          totals: 0,
          hangzis: 0,
          dates: [],
          months: {},
          weeks: {},
          cards: {}
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
    document.getElementById('dates').textContent = map.dates.length
    let totalDays = diffDay(map.firstDay, today)
    document.getElementById('totalDays').textContent = totalDays
    document.getElementById('ratio').textContent = parseInt(map.dates.length / totalDays * 100) + '%'
    document.getElementById('average1').textContent = (map.totals / totalDays).toFixed(1)
    document.getElementById('average2').textContent = parseInt(map.hangzis / map.totals)
    document.getElementById('first-card-date').textContent = map.firstDay
    document.getElementById('first-card-date').setAttribute('card-key', map.firstDayKey)
    document.getElementById('last-card-date').textContent = map.lastDay
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

    let cardDetails = cards(map.cards, true)
    document.getElementById('card-details').innerHTML = cardDetails

    let minWeek = Math.max(0, currentWeek - (12 - 1))
    document.getElementById('weeks').innerHTML = ''
    for (let w = minWeek; w <= currentWeek; w++) {
      let value = 0
      let mCardDetails
      if (map.years.hasOwnProperty(currentYear)) {
        if (map.years[currentYear].weeks.hasOwnProperty(w)) {
          value = map.years[currentYear].weeks[w].totals
          mCardDetails = cards(map.years[currentYear].weeks[w].cards, false)
        } else {
          Zotero.debug(`没有${currentYear}第${w}周的数据。`)
        }
      } else {
        Zotero.debug(`没有${currentYear}的数据。`)
      }

      let div = document.createElement('div')
      div.setAttribute('class', `${value > 0 ? 'pointer' : ''} item${w === currentWeek ? ' current-wrap' : ''}`)
      let onclick = function (e) {
        let totals = e.target.getAttribute('totals')
        if (totals === '0') {
          return
        }

        let year = e.target.getAttribute('year')
        let week = e.target.getAttribute('week')
        let contents = datapack.years[year].weeks[week].contents
        Zotero.debug(`${year}, ${week}, ${contents.length}`)
        window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, [...contents], `${year}年第${week}周`, mCardDetails)
      }
      let span1 = document.createElement('span')
      span1.setAttribute('class', `value ${value === 0 ? 'zero' : 'uread-color'}`)
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
      span2.onclick = onclick
      div.appendChild(span2)
      document.getElementById('weeks').appendChild(div)
    }

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
      let cardDetails = cards(item.value.cards, true)
      let totalDate = daysOfYear(item.name)
      let divYears = document.createElement('div')
      let pYearItemLabel = document.createElement('p')
      pYearItemLabel.setAttribute('class', 'item-label')
      pYearItemLabel.innerHTML = `年一共<span class="uread-color">${item.value.dates.length}</span>天写卡，占一年的 <span class="uread-color">${parseInt(item.value.dates.length / totalDate * 100)}%</span>，累计 <span class="uread-color">${item.value.hangzis}</span> 字，写卡 <span class="uread-color">${item.value.totals}</span> 张。其中 ${cardDetails}。`
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
        let yCardDetails
        if (item.value.months.hasOwnProperty(m)) {
          value = item.value.months[m].totals
          yCardDetails = cards(item.value.months[m].cards, false)
        }
        let div = document.createElement('div')
        div.setAttribute('class', `${value > 0 ? 'pointer' : ''} item${item.name === `${currentYear}` && m === currentMonth ? ' current-wrap' : ''}`)
        let onclick = function (e) {
          let totals = e.target.getAttribute('totals')
          if (totals === '0') {
            return
          }

          let year = e.target.getAttribute('year')
          let month = e.target.getAttribute('month')
          let contents = datapack.years[year].months[month].contents
          Zotero.debug(`${year}, ${month}, ${contents.length}`)
          window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, [...contents], `${year}年${month}月`, yCardDetails)
        }
        let span1 = document.createElement('span')
        span1.setAttribute('class', `value ${value === 0 ? 'zero' : 'uread-color'}`)
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

function readWithYear (year) {
  var progressWin = new Zotero.ProgressWindow({ window })
  let itemProgress = new progressWin.ItemProgress(
    `chrome://zotero-platform/content/treesource-collection${Zotero.hiDPISuffix}.png`,
    '处理中 ...'
  )
  itemProgress.setProgress(50)
  progressWin.show()
  let contents = calculateYear(year)
  let cardDetails = cards(datapack.years[year].cards, false)
  progressWin.close()
  window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, contents, `${year}年`, cardDetails)
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
  let cardDetails = cards(datapack.cards, false)
  progressWin.close()
  window.openDialog('chrome://zoterozotcard/content/read.html', 'read', `chrome,resizable,centerscreen,menubar=no,scrollbars,height=${screen.availHeight},width=${screen.availWidth}`, contents, `所有`, cardDetails)
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

function cards (cards, html) {
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
  let cardDetails = ''
  cardArrs.sort((a, b) => b.value - a.value)
  cardArrs.forEach(card => {
    if (cardDetails.length > 0) {
      cardDetails += '、'
    }
    cardDetails += html ? `${card.name} <span class="uread-color">${card.value}</span> 张` : `${card.name} ${card.value} 张`
  })
  return cardDetails
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