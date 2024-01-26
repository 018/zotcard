const { createApp, ref, reactive, toRaw, computed, nextTick, onMounted } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

var dataIn;
let type_id = Zotero.ZotCard.Utils.getUrlParam(window.location.href, 'type_id');
if (type_id) {
  dataIn = type_id.split('-');
}
Zotero.ZotCard.Logger.log(dataIn);
if (!ZotElementPlus.isZoteroDev && Zotero.ZotCard.Objects.isEmptyArray(dataIn) || dataIn.length !== 2) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter is incorrect.');
} else {
  var _type = dataIn[0];
  var _id = dataIn[1];
  var _name;

  const parentIDs = Zotero.ZotCard.Cards.parseParentIDs([{type: _type, id: _id}]);

  switch (_type) {
    case Zotero.ZotCard.Consts.cardManagerType.library:
      // library
      let library = Zotero.Libraries.get(_id);
      _name = library.name;
      break;
    case Zotero.ZotCard.Consts.cardManagerType.collection:
      // collection
      let collection = Zotero.Collections.get(_id);
      _name = collection.name;
      break;
    case Zotero.ZotCard.Consts.cardManagerType.search:
      // search
      let search = Zotero.Searches.get(_id);
      _name = search.name;
      break;
  }

  const _profiles = {
    excludeTitle: '',
    excludeCollectionOrItemKeys: [],

    parseDate: true,
    parseTags: true,
    parseCardType: true,
    parseWords: true,
  };
  Zotero.ZotCard.Logger.ding();
  

  window.onload = async function () {
    const _l10n = new Localization(["card-report.ftl", "zotcard.ftl"], true);
    
    ZotElementPlus.createElementPlusApp({
      setup() {
        const ZotCardConsts = reactive(Zotero.ZotCard.Consts);
        const allCards = reactive([]);

        Zotero.ZotCard.Logger.ding();
        
        var now = moment();
        const startOfWeek = Zotero.ZotCard.Prefs.get('startOfWeek', Zotero.ZotCard.Consts.startOfWeek.sunday);
        let weekOfYear = Zotero.ZotCard.Moments.weekOfYear(now, startOfWeek);
        let dayOfYear = Zotero.ZotCard.Moments.dayOfYear(now);

        const renders = reactive({
          node: {
            type: _type,
            name: _name,
            id: _id
          },
          today: {
            date: now.format(Zotero.ZotCard.Moments.YYYYMM),
            weekOfYear: weekOfYear,
            dayOfYear: dayOfYear,
            create: now.format(Zotero.ZotCard.Moments.YYYYMMDDHHmmss),
            week: Zotero.ZotCard.Moments.week(now),
            fromDays: 0,
            nonCardDay: 0,
          },
          statistics: {
            total: 0,
            words: 0,
            avg_words: 0,
            content_scale: 0,
            days: 0,
            days_scale: 0,
            avg_cards: 0,
            sizes: 0,
            unit: '',
            years: {

            },
            months: {

            },
            weeks: {

            },
            asYears: {
            },
            hasYears: [],
          },
          polarization: {
            date: {
              first: '9999-99-99',
              firstID: 1,
              firstNoteName: '',
              firstCard: undefined,
              last: '',
              lastID: 1,
              lastNoteName: '',
              lastCard: undefined,
            },
            words: {
              first: Number.MAX_VALUE,
              firstID: 0,
              firstNoteName: '',
              firstCard: undefined,
              last: 0,
              lastID: 0,
              lastNoteName: '',
              lastCard: undefined,
            },
            lines: {
              first: Number.MAX_VALUE,
              firstID: 0,
              firstNoteName: '',
              firstCard: undefined,
              last: 0,
              lastID: 0,
              lastNoteName: '',
              lastCard: undefined,
            },
            sizes: {
              first: Number.MAX_VALUE,
              firstID: 0,
              firstNoteName: '',
              firstCard: undefined,
              last: 0,
              lastID: 0,
              lastNoteName: '',
              lastCard: undefined,
            },
            content_scales: {
              first: Number.MAX_VALUE,
              firstID: 0,
              firstNoteName: '',
              firstCard: undefined,
              last: 0,
              lastID: 0,
              lastNoteName: '',
              lastCard: undefined,
            }
          }
        });
        Zotero.ZotCard.Logger.ding();
        
        let cardmgrProfiles = Zotero.ZotCard.Prefs.getJson('cardmgr.profiles', _profiles);
        let excludeCollectionOrItemKeys = cardmgrProfiles.excludeCollectionOrItemKeys.map((e) => {
          let splits = e.split('-');
          if (splits.length === 3) {
            let type = splits[0], libraryID = parseInt(splits[1]), key = splits[2];
            let id;
            switch (type) {
              case Zotero.ZotCard.Consts.cardManagerType.collection:
                id = Zotero.Collections.getIDFromLibraryAndKey(libraryID, key);
                return Zotero.ZotCard.Collections.links(id).map(e => {
                  return e.type === 'library' ? `library-${e.dataObject.id}-${e.dataObject.id}` : `${e.type}-${e.dataObject.libraryID}-${e.dataObject.key}`;
                });
              case Zotero.ZotCard.Consts.cardManagerType.item:
                id = Zotero.Items.getIDFromLibraryAndKey(libraryID, key);
                return Zotero.ZotCard.Items.links(id).map(e => {
                  return e.type === 'library' ? `library-${e.dataObject.id}-${e.dataObject.id}` : `${e.type}-${e.dataObject.libraryID}-${e.dataObject.key}`;
                });
            }
          }
        });
        const profiles = reactive({
          excludeTitle: cardmgrProfiles.excludeTitle,
          excludeCollectionOrItemKeys: excludeCollectionOrItemKeys,
  
          parseDate: cardmgrProfiles.parseDate,
          parseTags: cardmgrProfiles.parseTags,
          parseCardType: cardmgrProfiles.parseCardType,
          parseWords: cardmgrProfiles.parseWords,
        });
        const filters = reactive({
          parentIDs: parentIDs
        });

        onMounted(() => {
          Zotero.ZotCard.Logger.log('onMounted');
          _reload();
        });

        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        });

        const _init = async () => {
          nextTick(() => {
            loading.visible = true;
          })
          ZotElementPlus.Console.log('inited.');
        }

        const _captureTag = (_tags, tags) => {
          let key;
          if (Zotero.ZotCard.Objects.isEmptyArray(tags)) {
            key = _l10n.formatValueSync('zotcard-card-report-none');
            if (Object.hasOwnProperty.call(_tags, key)) {
              _tags[key] = _tags[key] + 1;
            } else {
              _tags[key] = 1;
            }
          } else {
            tags.forEach(tag => {
              key = `${tag.type === 1 ? '🏷️ ' : ''}${tag.tag}`;
              if (Object.hasOwnProperty.call(_tags, key)) {
                _tags[key] = _tags[key] + 1;
              } else {
                _tags[key] = 1;
              }
            });
          }
        }

        const _captureCardTypes = (_cardtypes, cardtypes) => {
          key = cardtypes || _l10n.formatValueSync('zotcard-card-report-none');
          if (Object.hasOwnProperty.call(_cardtypes, key)) {
            _cardtypes[key] = _cardtypes[key] + 1;
          } else {
            _cardtypes[key] = 1;
          }
        }

        const _reload = () => {
          nextTick(() => {
            loading.visible = true;
          })
          
          allCards.splice(0);
          let _tags = {};
          let _cardtypes = {};
          let days = [];
          let sizes = 0;
          Zotero.ZotCard.Cards.load(window, undefined, allCards, filters.parentIDs, profiles, true, (card) => {
            _captureTag(_tags, card.more.tags);
            _captureCardTypes(_cardtypes, card.more.cardtype);

            // polarization
            if (card.more.date < renders.polarization.date.first) {
              renders.polarization.date.first = card.more.date;
              renders.polarization.date.firstID = card.id;
              renders.polarization.date.firstNoteName = card.note.title;
              renders.polarization.date.firstCard = card;
            }
            if (card.more.date > renders.polarization.date.last) {
              renders.polarization.date.last = card.more.date;
              renders.polarization.date.lastID = card.id;
              renders.polarization.date.lastNoteName = card.note.title;
              renders.polarization.date.lastCard = card;
            }

            if (card.more.statistics.words < renders.polarization.words.first) {
              renders.polarization.words.first = card.more.statistics.words;
              renders.polarization.words.firstID = card.id;
              renders.polarization.words.firstNoteName = card.note.title;
              renders.polarization.words.firstCard = card;
            }
            if (card.more.statistics.words > renders.polarization.words.last) {
              renders.polarization.words.last = card.more.statistics.words;
              renders.polarization.words.lastID = card.id;
              renders.polarization.words.lastNoteName = card.note.title;
              renders.polarization.words.lastCard = card;
            }

            if (card.more.statistics.lines < renders.polarization.lines.first) {
              renders.polarization.lines.first = card.more.statistics.lines;
              renders.polarization.lines.firstID = card.id;
              renders.polarization.lines.firstNoteName = card.note.title;
              renders.polarization.lines.firstCard = card;
            }
            if (card.more.statistics.lines > renders.polarization.lines.last) {
              renders.polarization.lines.last = card.more.statistics.lines;
              renders.polarization.lines.lastID = card.id;
              renders.polarization.lines.lastNoteName = card.note.title;
              renders.polarization.lines.lastCard = card;
            }

            if (card.more.statistics.sizes < renders.polarization.sizes.first) {
              renders.polarization.sizes.first = card.more.statistics.sizes;
              renders.polarization.sizes.firstID = card.id;
              renders.polarization.sizes.firstNoteName = card.note.title;
              renders.polarization.sizes.firstCard = card;
            }
            if (card.more.statistics.sizes > renders.polarization.sizes.last) {
              renders.polarization.sizes.last = card.more.statistics.sizes;
              renders.polarization.sizes.lastID = card.id;
              renders.polarization.sizes.lastNoteName = card.note.title;
              renders.polarization.sizes.lastCard = card;
            }

            let content_scales = card.more.statistics.sizes > 0 ? card.more.statistics.words / card.more.statistics.sizes : 0;
            if (content_scales < renders.polarization.content_scales.first) {
              renders.polarization.content_scales.first = content_scales;
              renders.polarization.content_scales.firstID = card.id;
              renders.polarization.content_scales.firstNoteName = card.note.title;
              renders.polarization.content_scales.firstCard = card;
            }
            if (content_scales > renders.polarization.content_scales.last) {
              renders.polarization.content_scales.last = content_scales;
              renders.polarization.content_scales.lastID = card.id;
              renders.polarization.content_scales.lastNoteName = card.note.title;
              renders.polarization.content_scales.lastCard = card;
            }

            // statistics
            if (!days.includes(card.more.date)) {
              days.push(card.more.date);
            }
            renders.statistics.words += card.more.statistics.words;
            sizes += card.more.statistics.sizes;

            // years
            let year = card.more.date.split('-')[0];
            if (!renders.statistics.years[year]) {
              renders.statistics.years[year] = 0;
            }
            renders.statistics.years[year] += 1;

            // months
            let yearmonth = card.more.date.split('-')[0] + '-' + card.more.date.split('-')[1];
            if (!renders.statistics.months[yearmonth]) {
              renders.statistics.months[yearmonth] = 0;
            }
            renders.statistics.months[yearmonth] += 1;

            // weeks
            let week = year + '.' + Zotero.ZotCard.Moments.weekOfYear(new Date(card.more.date), startOfWeek).toString().padStart(2, '0');
            if (!renders.statistics.weeks[week]) {
              renders.statistics.weeks[week] = 0;
            }
            renders.statistics.weeks[week] += 1;

            // years   3 天写卡，占全年的 10% ，累计 302 字，203 张卡片。</h2>
            if(!Object.hasOwnProperty.call(renders.statistics.asYears, year)) {
              renders.statistics.asYears[year] = {
                tags: {},
                cardtypes: {},
                months: {
                  "01": 0,
                  "02": 0,
                  "03": 0,
                  "04": 0,
                  "05": 0,
                  "06": 0,
                  "07": 0,
                  "08": 0,
                  "09": 0,
                  "10": 0,
                  "11": 0,
                  "12": 0,
                },
                dayTotal: 0,
                days: {},
                days_scale: 0,
                words: 0,
                total: 0
              };
            }

            let month = card.more.date.split('-')[1];
            _captureTag(renders.statistics.asYears[year].tags, card.more.tags);
            _captureCardTypes(renders.statistics.asYears[year].cardtypes, card.more.cardtype);
            
            if (!Object.hasOwnProperty.call(renders.statistics.asYears[year].months, month)) {
              renders.statistics.asYears[year].months[month] = 0;
            }
            renders.statistics.asYears[year].months[month] += 1;

            if (!Object.hasOwnProperty.call(renders.statistics.asYears[year].days, card.more.date)) {
              renders.statistics.asYears[year].days[card.more.date] = 0;
            }
            renders.statistics.asYears[year].days[card.more.date] += 1;

            renders.statistics.asYears[year].words += card.more.statistics.words;
            renders.statistics.asYears[year].total += 1;
          }, async (cards) => {
            ////////////////////////////////

            renders.polarization.content_scales.first = Zotero.ZotCard.Utils.scale(renders.polarization.content_scales.first, 1);
            renders.polarization.content_scales.last = Zotero.ZotCard.Utils.scale(renders.polarization.content_scales.last, 1);

            let displayStore = Zotero.ZotCard.Utils.displayStore(sizes);
            renders.statistics.sizes = displayStore.value;
            renders.statistics.unit = displayStore.unit;
            renders.statistics.total = cards.length;
            renders.statistics.avg_words = parseInt(renders.statistics.words / renders.statistics.total);
            renders.statistics.content_scale = Zotero.ZotCard.Utils.scale(renders.statistics.words / sizes, 2);
            renders.statistics.days = days.length;
            renders.statistics.avg_cards = parseInt(renders.statistics.total / renders.statistics.days);

            let now = moment();
            renders.today.fromDays = moment.duration(now.startOf('day').diff(moment(renders.polarization.date.first, 'YYYY-MM-DD'))).asDays();
            renders.statistics.days_scale = Zotero.ZotCard.Utils.scale(renders.statistics.days / renders.today.fromDays, 2);
            renders.today.nonCardDay = moment.duration(moment().startOf('day').diff(moment(renders.polarization.date.last, 'YYYY-MM-DD'))).asDays();
            
            let echartsss = [];
            var cardtypes = echarts.init(document.getElementById('cardtypes'));
            var option = {
              tooltip: {},
              xAxis: {
                data: Object.keys(_cardtypes)
              },
              yAxis: {
                show: true,
              },
              series: [
                {
                  name: _l10n.formatValueSync('zotcard-card-report-cards'),
                  type: 'bar',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: 14
                    }
                  },
                  color: [
                    '#409eff'
                  ],
                  data: Object.values(_cardtypes)
                }
              ]
            };
            cardtypes.setOption(option);
            cardtypes.on('click', function (params) {
                console.log(params);
                if (params.value <= 0) {
                  return;
                }
                
                let items = [{
                  type: _type,
                  id: _id
                }];
                let filters = {
                  cardtypes: [params.name === _l10n.formatValueSync('zotcard-card-report-none') ? '' : params.name]
                }
                Zotero.ZotCard.Dialogs.openCardManager(items, filters);
            });
            echartsss.push(cardtypes);

            var cardtags = echarts.init(document.getElementById('cardtags'));
            var option = {
              tooltip: {},
              xAxis: {
                data: Object.keys(_tags)
              },
              yAxis: {
                show: true
              },
              series: [
                {
                  name: _l10n.formatValueSync('zotcard-card-report-cards'),
                  type: 'bar',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: 14
                    }
                  },
                  color: [
                    '#67c23a'
                  ],
                  data: Object.values(_tags)
                }
              ]
            };
            cardtags.setOption(option);
            cardtags.on('click', function (params) {
                console.log(params);
                if (params.value <= 0) {
                  return;
                }
                
                let items = [{
                  type: _type,
                  id: _id
                }];
                let filters = {
                  tags: [params.name === _l10n.formatValueSync('zotcard-card-report-none') ? '0-' : (params.name.startsWith('🏷️ ') ? '1-' + params.name.replace('🏷️ ', '') : '2-' + params.name)]
                }
                Zotero.ZotCard.Logger.log({filters});
                
                Zotero.ZotCard.Dialogs.openCardManager(items, filters);
            });
            echartsss.push(cardtags);

            let ws = [];
            if (renders.statistics.weeks.length <= 1) {
              ws.push(...renders.statistics.weeks);
            } else {
              let weekss = Object.keys(renders.statistics.weeks);
              Zotero.ZotCard.Logger.log({weekss});
              let min = weekss.reduce((pre, cur, index, arr) => {
                if(pre < cur) {
                  return pre;
                } else {
                  return cur;
                }
              }, '9999.99'), max = weekss.reduce((pre, cur, index, arr) => {
                if(pre > cur) {
                  return pre;
                } else {
                  return cur;
                }
              }, '0000.00');
              let current = min;
              Zotero.ZotCard.Logger.log({min, max, current});
              
              while (current <= max) {
                ws.push(current);

                let splits = current.split('.');
                let year = parseInt(splits[0]), week = parseInt(splits[1]);
                let maxWeekOfYear = Zotero.ZotCard.Moments.weekOfYear(new Date(year, 12 - 1, 31), startOfWeek);
                Zotero.ZotCard.Logger.log({maxWeekOfYear});
                if (week + 1 > maxWeekOfYear) {
                  year += 1;
                  week = 1;
                } else {
                  week += 1;
                }
                current = `${year}.${week.toString().padStart(2, '0')}`;
                Zotero.ZotCard.Logger.log({current, max});
              }
            }
            var weeks = echarts.init(document.getElementById('weeks'));
            var option = {
              tooltip: {},
              xAxis: {
                data: ws
              },
              yAxis: {
                show: true
              },
              series: [
                {
                  name: _l10n.formatValueSync('zotcard-card-report-cards'),
                  type: 'line',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: 14
                    }
                  },
                  smooth: true,
                  color: [
                    '#f56c6c'
                  ],
                  data: ws.map(e => renders.statistics.weeks[e] || 0)
                }
              ]
            };
            weeks.setOption(option);
            weeks.on('click', function (params) {
                console.log(params);
                if (params.value <= 0) {
                  return;
                }
                
                let splits = params.name.split('.');
                let year = parseInt(splits[0]), week = parseInt(splits[1]);
                let items = [{
                  type: _type,
                  id: _id
                }];
                let filters = {
                  dates: Zotero.ZotCard.Moments.datesByWeekOfYear(year, week, startOfWeek)
                }
                Zotero.ZotCard.Dialogs.openCardManager(items, filters);
            });
            echartsss.push(weeks);

            let ms = [];
            if (renders.statistics.months.length <= 1) {
              ms.push(...renders.statistics.months);
            } else {
              let monthss = Object.keys(renders.statistics.months);
              let min = monthss.reduce((pre, cur, index, arr) => {
                if(pre < cur) {
                  return pre;
                } else {
                  return cur;
                }
              }, '9999-99'), max = monthss.reduce((pre, cur, index, arr) => {
                if(pre > cur) {
                  return pre;
                } else {
                  return cur;
                }
              }, '0000-00');
              let current = min;
              while (current <= max) {
                ms.push(current);

                let splits = current.split('-');
                let year = parseInt(splits[0]), month = parseInt(splits[1]);
                if (month + 1 > 12) {
                  year += 1;
                  month = 1;
                } else {
                  month += 1;
                }
                current = `${year}-${month.toString().padStart(2, '0')}`;
              }
            }
            var months = echarts.init(document.getElementById('months'));
            var option = {
              tooltip: {},
              xAxis: {
                data: ms
              },
              yAxis: {
                show: true
              },
              series: [
                {
                  name: _l10n.formatValueSync('zotcard-card-report-cards'),
                  type: 'line',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: 14
                    }
                  },
                  smooth: true,
                  color: [
                    '#f56c6c'
                  ],
                  data: ms.map(e => renders.statistics.months[e] || 0)
                }
              ]
            };
            months.setOption(option);
            months.on('click', function (params) {
                console.log(params);
                if (params.value <= 0) {
                  return;
                }
                
                let items = [{
                  type: _type,
                  id: _id
                }];
                let filters = {
                  dates: [params.name + '-01', moment(params.name).endOf('month').format(Zotero.ZotCard.Moments.YYYYMMDD)]
                }
                Zotero.ZotCard.Dialogs.openCardManager(items, filters);
            });
            echartsss.push(months);

            let ys = [];
            if (renders.statistics.years.length <= 1) {
              ys.push(...renders.statistics.years);
            } else {
              let yearss = Object.keys(renders.statistics.years).map(e => parseInt(e));
              for (let index = Math.min(...yearss); index < Math.max(...yearss) + 1; index++) {
                ys.push(index);
              }
            }
            var years = echarts.init(document.getElementById('years'));
            var option = {
              tooltip: {},
              xAxis: {
                data: ys
              },
              yAxis: {
                show: true
              },
              series: [
                {
                  name: _l10n.formatValueSync('zotcard-card-report-cards'),
                  type: 'line',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      fontSize: 14
                    }
                  },
                  smooth: true,
                  color: [
                    '#f56c6c'
                  ],
                  data: ys.map(e => renders.statistics.years[e] || 0)
                }
              ]
            };
            years.setOption(option);
            years.on('click', function (params) {
                console.log(params);
                if (params.value <= 0) {
                  return;
                }
                
                let items = [{
                  type: _type,
                  id: _id
                }];
                let filters = {
                  dates: [params.name + '-01-01', params.name + '-12-31']
                }
                Zotero.ZotCard.Logger.log(filters);
                
                Zotero.ZotCard.Dialogs.openCardManager(items, filters);
            });
            echartsss.push(years);

            renders.statistics.hasYears = Object.keys(renders.statistics.asYears).sort((a, b) => Zotero.ZotCard.Cards.compare(a, b, true));
            await nextTick();

            renders.statistics.hasYears.forEach(year => {
              let yearDays = moment.duration(moment([parseInt(year) + 1, 1, 1]).diff(moment([parseInt(year), 1, 1]))).asDays();
              let days = Object.keys(renders.statistics.asYears[year].days);
              renders.statistics.asYears[year].dayTotal = days.length;
              renders.statistics.asYears[year].days_scale = Zotero.ZotCard.Utils.scale(renders.statistics.asYears[year].dayTotal / yearDays, 2);

              var yyears = echarts.init(document.getElementById(`y${year}`));
              var option = {
                tooltip: {},
                visualMap: {
                  min: 0,
                  max: 100,
                  show: false,
                  target: {
                    inRange: {
                      color: ['#A4F76A', '#80D653', '#53AF32', '#36972C', '#2F6F1C']
                    }
                  }
                },
                calendar: {
                  top: 20,
                  left: 30,
                  right: 30,
                  cellSize: ['auto', 'auto'],
                  range: year.toString(),
                  dayLabel: {
                      firstDay: startOfWeek
                  },
                  itemStyle: {
                    borderWidth: 0.5
                  },
                  yearLabel: { show: false }
                },
                series: {
                  type: 'heatmap',
                  coordinateSystem: 'calendar',
                  data: days.map(e => {
                    return [e, renders.statistics.asYears[year].days[e]]
                  })
                }
              };
              yyears.setOption(option);
              yyears.on('click', function (params) {
                  console.log(params);
                  if (params.value <= 0) {
                    return;
                  }
                  
                  let items = [{
                    type: _type,
                    id: _id
                  }];
                  let filters = {
                    dates: [params.value[0], params.value[0]],
                  }
                  Zotero.ZotCard.Dialogs.openCardManager(items, filters);
              });
              echartsss.push(yyears);

              var ycardtypes = echarts.init(document.getElementById(`y${year}cardtypes`));
              var option = {
                tooltip: {},
                xAxis: {
                  data: Object.keys(renders.statistics.asYears[year].cardtypes)
                },
                yAxis: {},
                series: [
                  {
                    name: _l10n.formatValueSync('zotcard-card-report-cards'),
                    type: 'bar',
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        fontSize: 14
                      }
                    },
                    color: [
                      '#409eff'
                    ],
                    data: Object.values(renders.statistics.asYears[year].cardtypes)
                  }
                ]
              };
              ycardtypes.setOption(option);
              ycardtypes.on('click', function (params) {
                  console.log(params);
                  if (params.value <= 0) {
                    return;
                  }
                  
                  let items = [{
                    type: _type,
                    id: _id
                  }];
                  let filters = {
                    dates: [year + '-01-01', year + '-12-31'],
                    cardtypes: [params.name === _l10n.formatValueSync('zotcard-card-report-none') ? '' : params.name]
                  }
                  Zotero.ZotCard.Dialogs.openCardManager(items, filters);
              });
              echartsss.push(ycardtypes);

              var ycardtags = echarts.init(document.getElementById(`y${year}cardtags`));
              var option = {
                tooltip: {},
                xAxis: {
                  data: Object.keys(renders.statistics.asYears[year].tags)
                },
                yAxis: {},
                series: [
                  {
                    name: _l10n.formatValueSync('zotcard-card-report-cards'),
                    type: 'bar',
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        fontSize: 14
                      }
                    },
                    color: [
                      '#67c23a'
                    ],
                    data: Object.values(renders.statistics.asYears[year].tags)
                  }
                ]
              };
              ycardtags.setOption(option);
              ycardtags.on('click', function (params) {
                  console.log(params);
                  if (params.value <= 0) {
                    return;
                  }
                  
                  let items = [{
                    type: _type,
                    id: _id
                  }];
                  let filters = {
                    dates: [year + '-01-01', year + '-12-31'],
                    tags: [params.name === _l10n.formatValueSync('zotcard-card-report-none') ? '0-' : (params.name.startsWith('🏷️ ') ? '1-' + params.name.replace('🏷️ ', '') : '2-' + params.name)]
                  }
                  Zotero.ZotCard.Logger.log({filters});
                  
                  Zotero.ZotCard.Dialogs.openCardManager(items, filters);
              });
              echartsss.push(ycardtags);

              let yms = Object.keys(renders.statistics.asYears[year].months).sort((a, b) => Zotero.ZotCard.Cards.compare(a, b, false));
              var ymonths = echarts.init(document.getElementById(`y${year}months`));
              var option = {
                tooltip: {},
                xAxis: {
                  data: yms
                },
                yAxis: {},
                series: [
                  {
                    name: _l10n.formatValueSync('zotcard-card-report-cards'),
                    type: 'line',
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        fontSize: 14
                      }
                    },
                  smooth: true,
                    color: [
                      '#f56c6c'
                    ],
                    data: yms.map(e => renders.statistics.asYears[year].months[e])
                  }
                ]
              };
              ymonths.setOption(option);
              ymonths.on('click', function (params) {
                  console.log(params);
                  if (params.value <= 0) {
                    return;
                  }
                  
                  let items = [{
                    type: _type,
                    id: _id
                  }];
                  let filters = {
                    dates: [year + '-' + params.name + '-01', moment(year + '-' + params.name).endOf('month').format(Zotero.ZotCard.Moments.YYYYMMDD)]
                  }
                  Zotero.ZotCard.Dialogs.openCardManager(items, filters);
              });
              echartsss.push(ymonths);
            });

            loading.close();
            ZotElementPlus.Console.log('loaded.');

            window.addEventListener('resize', function() {
              echartsss.forEach(e => {
                e.resize();
              });
            });
          });
        }

        function handleLink(type, id) {
          switch (type) {
            case Zotero.ZotCard.Consts.cardManagerType.collection:
              Zotero.ZotCard.Collections.selectCollection(id);
              break;
            case Zotero.ZotCard.Consts.cardManagerType.item:
              let item = Zotero.Items.get(id);
              let collections;
              if (item.parentItem) {
                collections = item.parentItem.getCollections();
              } else {
                collections = item.getCollections();
              }
              if (collections && collections.length > 0) {
                Zotero.ZotCard.Items.selectItem(collections[0], item.id);
              }
              break;
          }
          Zotero.getMainWindow().focus();
          Zotero.getMainWindow().Zotero_Tabs.select('zotero-pane');
        }

        function displayStore(sizes) {
          return Zotero.ZotCard.Utils.displayStore(sizes);
        }

        function l10n(key, params) {
          return params ? _l10n.formatValueSync(key, params) : _l10n.formatValueSync(key);
        }

        _init();

        return {
          ZotCardConsts,
          allCards,
          renders,
          profiles,
          filters,
          handleLink,
          displayStore,
          l10n,
        }
      }
    });
  }

  window.onclose = function() {
    Zotero.ZotCard.Logger.log('onclose');
    
    if (notifierID > 0) {
      Zotero.Notifier.unregisterObserver(this.notifierID);
    }
  }
}