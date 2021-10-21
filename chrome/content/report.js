'use strict'

function start () {
  document.getElementById('username').textContent = Zotero.Users.getCurrentUsername() || Zotero.Prefs.get('sync.server.username') || '我'

  var search = new Zotero.Search()
  search.addCondition('note', 'contains', '日期')
  search.libraryID = Zotero.Libraries.userLibraryID
  var ids = search.search().then(ids => {
    var map = {
      firstDay: Zotero.ZotCard.Utils.formatDate(new Date(), 'yyyy-MM-dd'),
      lastDay: '',
      totals: 0,
      hangzis: 0,
      maxHangzi: 0,
      maxHangziNoteTitle: '',
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
      let noteTitle = item.getNoteTitle()
      if (['目录', '初步评价', '豆瓣短评'].includes(noteTitle)) {
        Zotero.debug(`${noteTitle}跳过。`)
        continue
      }
      if (Zotero.ItemTypes.getName(item.itemTypeID) !== 'note') {
        Zotero.debug(`${noteTitle}不是笔记(${Zotero.ItemTypes.getName(item.itemTypeID)})。`)
        continue
      }
      let noteContent = item.getNote()
      let match1 = noteContent.match(/日期.*?(\d{4}[-/年\.]\d{1,2}[-/月\.]\d{1,2}日{0,1})/g)
      if (!match1) {
        Zotero.debug(`${noteTitle}不包含日期。`)
        map.others.push(noteTitle)
        continue
      }
      let match2 = match1[0].match(/\d{4}[-/年\.]\d{1,2}[-/月\.]\d{1,2}日{0,1}/g)
      let dateString = match2[0].replace(/年|月|\./g, '-').replace(/日/g, '')
      let match3 = noteTitle.match('[\u4e00-\u9fa5]+卡')
      let cardName = match3 ? match3[0] : '其他'

      let { date, year, month, week } = dateinfo(dateString)

      if (date < map.firstDay) {
        map.firstDay = date
      }
      if (date > map.lastDay) {
        map.lastDay = date
      }

      let hangzi = Zotero.ZotCard.Utils.hangzi(noteContent)
      map.totals++
      if (hangzi > map.maxHangzi) {
        map.maxHangzi = hangzi
        map.maxHangziNoteTitle = noteTitle
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
          cards: {}
        }
      }
      map.years[year].months[month].totals = map.years[year].months[month].totals + 1
      if (!map.years[year].months[month].cards.hasOwnProperty(cardName)) {
        map.years[year].months[month].cards[cardName] = 0
      }
      map.years[year].months[month].cards[cardName] = map.years[year].months[month].cards[cardName] + 1

      if (!map.years[year].weeks.hasOwnProperty(week)) {
        map.years[year].weeks[week] = {
          totals: 0,
          cards: {}
        }
      }
      map.years[year].weeks[week].totals = map.years[year].weeks[week].totals + 1
      if (!map.years[year].weeks[week].cards.hasOwnProperty(cardName)) {
        map.years[year].weeks[week].cards[cardName] = 0
      }
      map.years[year].weeks[week].cards[cardName] = map.years[year].weeks[week].cards[cardName] + 1
    }
    Zotero.debug(map)

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
    //                      }
    //                  }
    //              },
    //              "weeks": {
    //                  "1": {
    //                      "totals": 1,
    //                      "cards": {
    //                          "金句卡": 12,
    //                          "...卡": 12,
    //                          "其他": 12
    //                      }
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

    let nowDate = new Date()
    let year = nowDate.getYear() + 1900
    let month = nowDate.getMonth() + 1
    let week = weekOfYear(nowDate)
    let today = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd')
    let now = Zotero.ZotCard.Utils.formatDate(nowDate, 'yyyy-MM-dd HH:mm:ss')

    document.getElementById('progress').textContent = ''
    document.getElementById('loading').hidden = map.totals > 0
    document.getElementById('content').hidden = map.totals === 0
    document.getElementById('loading').textContent = '未找到卡片，赶紧写卡吧。'
    
    document.getElementById('totals').textContent = map.totals
    document.getElementById('hangzis').textContent = map.hangzis
    document.getElementById('maxHangzi').textContent = map.maxHangzi
    document.getElementById('maxHangziNoteTitle').textContent = map.maxHangziNoteTitle
    document.getElementById('dates').textContent = map.dates.length
    let totalDays = diffDay(map.firstDay, today)
    document.getElementById('totalDays').textContent = totalDays
    document.getElementById('ratio').textContent = parseInt(map.dates.length / totalDays * 100) + '%'
    document.getElementById('average1').textContent = (map.totals / totalDays).toFixed(1)
    document.getElementById('average2').textContent = parseInt(map.hangzis / map.totals)
    document.getElementById('first-card-date').textContent = map.firstDay
    document.getElementById('last-card-date').textContent = map.lastDay

    let noCardDays = (new Date(today) - new Date(map.lastDay)) / (24 * 60 * 60 * 1000)
    if (noCardDays > 0) {
      document.getElementById('no-card').innerHTML = `，已经连续 <span class="orangered">${noCardDays}</span> 天没写卡了`
    }

    document.getElementById('now').textContent = now
    document.querySelectorAll('.today').forEach(element => {
      element.textContent = today
    })
    document.getElementById('week').textContent = week

    let cardDetails = cards(map.cards, true)
    document.getElementById('card-details').innerHTML = cardDetails

    let weeks = ''
    let minWeek = Math.max(0, week - (12 - 1))
    for (let w = minWeek; w <= week; w++) {
      let value = 0
      if (map.years.hasOwnProperty(year)) {
        if (map.years[year].weeks.hasOwnProperty(w)) {
          value = map.years[year].weeks[w].totals
        } else {
          Zotero.debug(`没有${year}第${w}周的数据。`)
        }
      } else {
        Zotero.debug(`没有${year}的数据。`)
      }
      weeks += `<div class="item${w === week ? ' current-wrap' : ''}">
        <span class="value ${value === 0 ? 'zero' : 'uread-color'}">${value}</span>
        <span class="label${w === week ? ' current' : ''}">W${w}</span>
      </div>`
    }
    document.getElementById('weeks').innerHTML = weeks

    let years = ''
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
      let monthDetails = ''
      for (let m = 1; m <= 12; m++) {
        let value = 0
        let mCardDetails = ''
        if (item.value.months.hasOwnProperty(m)) {
          value = item.value.months[m].totals
          mCardDetails = cards(item.value.months[m].cards)
        }
        monthDetails += `<div class="item${item.name === `${year}` && m === month ? ' current-wrap' : ''}" title="${mCardDetails}">
          <span class="value ${value === 0 ? 'zero' : 'uread-color'}">${value}</span>
          <span class="label${item.name === `${year}` && m === month ? ' current' : ''}">${m}月</span>
        </div>`
      }
      let totalDate = daysOfYear(item.name)
      years += `<div>
        <p class="item-label"><b>${item.name}</b>年一共<span class="uread-color">${item.value.dates.length}</span>天写卡，占一年的 <span class="uread-color">${parseInt(item.value.dates.length / totalDate * 100)}%</span>，累计 <span class="uread-color">${item.value.hangzis}</span> 字，写卡 <span class="uread-color">${item.value.totals}</span> 张。其中 ${cardDetails}。</p>
        <div class="detail">${monthDetails}</div>
      </div>`
    }
    document.getElementById('years').innerHTML = years

    document.getElementById('other-wrap').hidden = (map.others.length === 0)
    let otherDetails = ''
    for (const item of map.others) {
      otherDetails += `<p class="other-item">「${item} 」不包含日期。</p>`
    }
    document.getElementById('other').innerHTML = otherDetails
  })
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
