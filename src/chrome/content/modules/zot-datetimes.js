if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.DateTimes) Zotero.ZotCard.DateTimes = {};

Zotero.ZotCard.DateTimes = Object.assign(Zotero.ZotCard.DateTimes, {
  yyyyMM: 'yyyy-MM',
  yyyyMMdd: 'yyyy-MM-dd',
  yyyyMMddHHmmss: 'yyyy-MM-dd HH:mm:ss',
  yyyyMMddHHmmssS: 'yyyy-MM-dd HH:mm:ss.S',

	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.DateTimes inited.');
	},

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
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substring(('' + o[k]).length)))
      }
    }
    return format
  },

  // 0: 周日开始
  // 1: 周一开始
  weekOfYear(date, startOfWeek) {
    // var firstDay = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    // firstDay.setDate(1 + (7 - firstDay.getDay() + startOfWeek) % 7);
    // dateGap = date.getTime() - firstDay.getTime();
    // return Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000)) + 1;

    var firstDay = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    // 第一周至少4天
    switch (startOfWeek) {
      case 0: // 周日开始
      if (firstDay.getDay() <= 3) {
        firstDay.setDate(firstDay.getDate() - firstDay.getDay());
      } else {
        firstDay.setDate(firstDay.getDate() + (7 - firstDay.getDay()));
      }
        break;
      case 1: // 周一开始
        let getDay = firstDay.getDay() || 7;
        if (getDay <= 4) {
          firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - 1));
        } else {
          firstDay.setDate(firstDay.getDate() + (7 - firstDay.getDay() + 1));
        }
        break;
    
      default:
        break;
    }
    firstDay.setDate(1 + (7 - firstDay.getDay() + startOfWeek) % 7);
    dateGap = date.getTime() - firstDay.getTime();
    return Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000));
  },

  // 0: 周日开始
  // 1: 周一开始
  datesByWeekOfYear(weekOfYear, startOfWeek) {
    var firstDay = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    firstDay.setDate(1 + (7 - firstDay.getDay() + startOfWeek) % 7);
    dateGap = date.getTime() - firstDay.getTime();
    return Math.ceil(dateGap / (7 * 24 * 60 * 60 * 1000)) + 1;
  },

  dayOfYear(date) {
    var firstDay = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    let dateGap = date.getTime() - firstDay.getTime() + 1;
    return Math.ceil(dateGap / (24 * 60 * 60 * 1000));
  },

  week(date) {
    let cn = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    let en = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.'][date.getDay()];
    return {cn, en};
  },

  now() {
    return this.formatDate(new Date(), Zotero.ZotCard.DateTimes.yyyyMMddHHmmssS);
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