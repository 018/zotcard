const { createApp, ref, reactive, toRaw, computed, nextTick, onMounted } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

var io = {dataIn:{type:1}};
const parentIDs = [];
parentIDs.push(['library-1']);

const _profiles = {
  excludeTitle: '',
  excludeCollectionOrItemKeys: [],

  titleFontSize: 15,
  contentFontSize: 12,
  columns: 5,
  height: 300,
  parseDate: true,
  parseTags: true,
  parseCardType: true,
  parseWords: true,
};

var activate = true;

window.onload = async function () {
  const _pagesize = 5;

  ZotElementPlus.createElementPlusApp({
    setup() {
      const ZotCardConsts = reactive({
        defCardTypes: ['abstract', 'quotes', 'concept', 'character', 'not_commonsense', 'skill', 'structure', 'general'],
        card_quantity: 3,
        startOfWeek: 0,
        recently_move_collection_quantity: 5,
        note_background_color: '',
      
        cardManagerType: {
          library: 'library',
          collection: 'collection',
          search: 'search',
          item: 'item',
          note: 'note'
        },
      
        tagType: {
          zotero: 1,
          custom: 2
        },
      
        modeProps: {
          all: 1,
          only_show: 2,
          only_hide: 3,
          only_expand: 4,
          only_collapse: 5,
          only_selected: 6,
        },
        
        matchProps: {
          all: 1,
          any: 2,
        },
      
        init({ id, version, rootURI }) {
          Zotero.ZotCard.Logger.log('Zotero.ZotCard.Consts inited.');
        }
      });
      const cards = reactive([]);
     
      const renders = reactive({
        node: {
          type: '_type',
          name: '_name',
          id: 1
        },
        today: {
          date: '',
          week: 'weekOfYear',
          create: '',
          fromDays: '',
          nonCardDay: '',
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
          unit: ''
        },
        polarization: {
          date: {
            first: '9999-99-99',
            firstID: 1,
            firstNoteName: '',
            last: '',
            lastID: 1,
            lastNoteName: '',
          },
          words: {
            first: Number.MAX_VALUE,
            firstID: 0,
            firstNoteName: '',
            last: 0,
            lastID: 0,
            lastNoteName: '',
          },
          lines: {
            first: Number.MAX_VALUE,
            firstID: 0,
            firstNoteName: '',
            last: 0,
            lastID: 0,
            lastNoteName: '',
          },
          sizes: {
            first: Number.MAX_VALUE,
            firstID: 0,
            firstNoteName: '',
            last: 0,
            lastID: 0,
            lastNoteName: '',
          },
          content_scales: {
            first: Number.MAX_VALUE,
            firstID: 0,
            firstNoteName: '',
            last: 0,
            lastID: 0,
            lastNoteName: '',
          }
        }
      });
      const profiles = reactive({
        carouselDirection: 'horizontal',
        carouselType: 'card',
        titleFontSize: 15,
        contentFontSize: 12,
      });
      const filters = reactive({
        orderby: 'dateAdded',
        desc: false
      });
      
      onMounted(() => {
        console.log(111);

        _init();
      });

      const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)',
      });

      const _init = async () => {
        setTimeout(() => {
          var cardtypes = echarts.init(document.getElementById('cardtypes'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['概念卡', '结构卡', '金句卡', '短文卡', '复盘卡', '其他']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#409eff',
                  '#67c23a',
                  '#e6a23c',
                  '#f56c6c',
                  '#909399'
                ],
                data: [5, 20, 36, 10, 10, 20]
              }
            ]
          };
          cardtypes.setOption(option);

          var cardtags = echarts.init(document.getElementById('cardtags'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['无', '我', 'A', '管理', '计划', '资料', '你', '注重', '履历', '娃', '破局']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#67c23a'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28]
              }
            ]
          };
          cardtags.setOption(option);
          loading.close();
return;
          var weeks = echarts.init(document.getElementById('weeks'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['W33', 'W34', 'W35', 'W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42', 'W43']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'line',
                color: [
                  '#f56c6c'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28]
              }
            ]
          };
          weeks.setOption(option);

          var months = echarts.init(document.getElementById('months'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'line',
                color: [
                  '#f56c6c'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28, 28]
              }
            ]
          };
          months.setOption(option);

          var years = echarts.init(document.getElementById('years'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['2020', '2021', '2022', '2023']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'line',
                color: [
                  '#f56c6c'
                ],
                data: [5, 20, 36, 36]
              }
            ]
          };
          years.setOption(option);

          var y2023cardtypes = echarts.init(document.getElementById('y2023cardtypes'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['概念卡', '结构卡', '金句卡', '短文卡', '复盘卡', '其他']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#409eff'
                ],
                data: [5, 20, 36, 10, 10, 20]
              }
            ]
          };
          y2023cardtypes.setOption(option);

          var y2023cardtags = echarts.init(document.getElementById('y2023cardtags'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['无', '我', 'A', '管理', '计划', '资料', '你', '注重', '履历', '娃', '破局']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#67c23a'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28]
              }
            ]
          };
          y2023cardtags.setOption(option);

          var y2023months = echarts.init(document.getElementById('y2023months'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'line',
                color: [
                  '#f56c6c'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28, 28]
              }
            ]
          };
          y2023months.setOption(option);

          var y2022cardtypes = echarts.init(document.getElementById('y2022cardtypes'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['概念卡', '结构卡', '金句卡', '短文卡', '复盘卡', '其他']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#409eff'
                ],
                data: [5, 20, 36, 10, 10, 20]
              }
            ]
          };
          y2022cardtypes.setOption(option);

          var y2022cardtags = echarts.init(document.getElementById('y2022cardtags'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['无', '我', 'A', '管理', '计划', '资料', '你', '注重', '履历', '娃', '破局']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#67c23a'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28]
              }
            ]
          };
          y2022cardtags.setOption(option);

          var y2022months = echarts.init(document.getElementById('y2022months'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'line',
                color: [
                  '#f56c6c'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28, 28]
              }
            ]
          };
          y2022months.setOption(option);

          var y2021cardtypes = echarts.init(document.getElementById('y2021cardtypes'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['概念卡', '结构卡', '金句卡', '短文卡', '复盘卡', '其他']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#409eff'
                ],
                data: [5, 20, 36, 10, 10, 20]
              }
            ]
          };
          y2021cardtypes.setOption(option);

          var y2021cardtags = echarts.init(document.getElementById('y2021cardtags'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['无', '我', 'A', '管理', '计划', '资料', '你', '注重', '履历', '娃', '破局']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'bar',
                color: [
                  '#67c23a'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28]
              }
            ]
          };
          y2021cardtags.setOption(option);

          var y2021months = echarts.init(document.getElementById('y2021months'));
          var option = {
            tooltip: {},
            xAxis: {
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            },
            yAxis: {},
            series: [
              {
                name: '数量',
                type: 'line',
                color: [
                  '#f56c6c'
                ],
                data: [5, 20, 36, 10, 10, 20, 22, 46, 15, 12, 28, 28]
              }
            ]
          };
          y2021months.setOption(option);

          loading.close();
        }, 50);
      }

      // _init();
      function displayStore(sizes) {
        return sizes;
      }

      return {
        ZotCardConsts,
        cards,
        renders,
        profiles,
        filters,
        displayStore,
      }
    }
  });
}