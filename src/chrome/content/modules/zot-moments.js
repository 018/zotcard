if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Moments) Zotero.ZotCard.Moments = {};

Zotero.ZotCard.Moments = Object.assign(Zotero.ZotCard.Moments, {
  YYYYMM: 'YYYY-MM',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMDDHHmmss: 'YYYY-MM-DD HH:mm:ss',
  YYYYMMDDHHmmssSSS: 'YYYY-MM-DD HH:mm:ss.SSS',

	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Moments inited.');
	},

  _updateLocale(startOfWeek) {
    moment.updateLocale(Zotero.locale, {
      week : {
          dow : startOfWeek,
          doy : 4
       }
    });
  },

  week(date) {
    let week = this.toMoment(date, Zotero.ZotCard.Moments.YYYYMM).day();
    let cn = ['日', '一', '二', '三', '四', '五', '六'][week];
    let en = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.'][week];
    return {cn, en};
  },

  dayOfYear(date) {
    return this.toMoment(date, Zotero.ZotCard.Moments.YYYYMM).dayOfYear();
  },

  // 0: 周日开始
  // 1: 周一开始
  weeksInYear(date, startOfWeek) {
    this._updateLocale(startOfWeek);
    return this.toMoment(date, Zotero.ZotCard.Moments.YYYYMM).weeksInYear();
  },

  // 0: 周日开始
  // 1: 周一开始
  weekOfYear(date, startOfWeek) {
    this._updateLocale(startOfWeek);
    return this.toMoment(date, Zotero.ZotCard.Moments.YYYYMM).weeks();
  },

  // 0: 周日开始
  // 1: 周一开始
  datesByWeekOfYear(year, weekOfYear, startOfWeek) {
    this._updateLocale(startOfWeek);
    let m = moment([year, 2, 1]).week(weekOfYear);
    return [m.startOf('week').format(Zotero.ZotCard.Moments.YYYYMMDD), m.endOf('week').format(Zotero.ZotCard.Moments.YYYYMMDD)];
  },

  toMoment(date) {
    if (date instanceof Date || Object.prototype.toString.call(date) === '[object Date]') {
      return moment(date);
    } else if (date instanceof String || Object.prototype.toString.call(date) === '[object String]') {
      if (arguments.length === 1) {
        return moment(date, Zotero.ZotCard.Moments.YYYYMMDDHHmmssSSS);
      } else if (arguments.length === 2) {
        return moment(date, arguments[1]);
      }
    } else if (date instanceof Object || date._isAMomentObject) {
      return date;
    } else {
      return undefined;
    }
  }
});