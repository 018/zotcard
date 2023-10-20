if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.DateTimes) Zotero.ZotCard.DateTimes = {};

Zotero.ZotCard.DateTimes = Object.assign(Zotero.ZotCard.DateTimes, {
  formatDate(date, format) {
    var o = {
      'M+' : date.getMonth() + 1,
      'd+' : date.getDate(),
      'h+' : date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
      'H+' : date.getHours(),
      'm+' : date.getMinutes(),
      's+' : date.getSeconds(),
      'q+' : Math.floor((date.getMonth() + 3) / 3),
      'S' : date.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return format
  },
  
  now() {
    return this.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss.S')
  },
  
  sqlToDate(date, format) {
    let d = Zotero.Date.sqlToDate(date, true)
    let dt = new Date(d - new Date().getTimezoneOffset())
    return format ? this.formatDate(dt, format) : dt
  },
  
  sqlToLocale(valueText) {
    var date = Zotero.Date.sqlToDate(valueText, true)
    if (date) {
      if (Zotero.Date.isSQLDate(valueText)) {
        date = Zotero.Date.sqlToDate(valueText + ' 12:00:00')
        valueText = date.toLocaleDateString()
      } else {
        valueText = date.toLocaleString()
      }
    } else {
      valueText = ''
    }
  }
});