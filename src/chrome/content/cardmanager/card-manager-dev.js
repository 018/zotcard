const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
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

window.onload = async function () {
  const _pagesize = 15;

  ZotElementPlus.createElementPlusApp({
    setup() {
      const ZotCardConsts = reactive({
        defCardTypes: ['abstract', 'quotes', 'concept', 'character', 'not_commonsense', 'skill', 'structure', 'general'],
        card_quantity: 3,
        startOfWeek: 0,
        recently_move_collection_quantity: 5,
        enable_word_count: true,
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
      const allCards = reactive([]);
      const cards = reactive([]);
      const scrollCards = reactive([]);
      const renders = reactive({
        drawer: false,
        date_picker_shortcuts: [
          {
            text: '今天',
            value: () => {
              const date = new Date();
              return [date, date]
            }
          },
          {
            text: '昨天',
            value: () => {
              const date = new Date();
              date.setDate(date.getDate() - 1);
              return [date, date];
            },
          },
          {
            text: '7天内',
            value: () => {
              const date = new Date();
              date.setDate(date.getDate() - 7);
              return [date, new Date()];
            },
          },
          {
            text: '本周',
            value: () => {
              const date = new Date();
              let startOfWeek = 0;
              date.setDate(date.getDate() - ((date.getDay() || 7) - startOfWeek));
              return [date, new Date()];
            },
          },
          {
            text: '本月',
            value: () => {
              const date = new Date();
              date.setDate(1);
              return [date, new Date()];
            },
          },
          {
            text: '本季度',
            value: () => {
              const date = new Date();
              let year = date.getYear() + 1900;
              let mouth = date.getMonth() + 1;
              let startMouth = 1;
              if (mouth <= 3) {
                startMouth = 1;
              } else if (mouth <= 6) {
                startMouth = 4;
              } else if (mouth <= 9) {
                startMouth = 7;
              } else if (mouth <= 12) {
                startMouth = 10;
              }
              return [new Date(year, startMouth - 1, 1), new Date()];
            },
          },
          {
            text: '这一年',
            value: () => {
              const date = new Date();
              date.setMonth(0);
              date.setDate(1);
              return [date, new Date()];
            },
          }
        ],
        isOrderbyDesc: (f) => {
          return filters.orderby === f && filters.desc;
        },
        parentIDsItemProps: {
          value: 'value',
          label: 'label',
          children: 'children',
          disabled: 'disabled',
          leaf: 'leaf',
          lazy: true,
          multiple: true,
          checkStrictly: true,
          lazyLoad(node, resolve) {
            const { level, data } = node;
            let nodes = [];
            nodes.push({
              label: '1123',
              value: 'collection',
              leaf: false,
              extras: {
                id: 1,
                type: 'collection',
                treeViewImage: 'chrome://zotero/skin/treesource-collection@2x.png'
              }
            });
            resolve(nodes);
          },
        },
        excludeCollectionOrItemKeysItemProps: {
          value: 'value',
          label: 'label',
          children: 'children',
          disabled: 'disabled',
          leaf: 'leaf',
          lazy: true,
          multiple: true,
          checkStrictly: true,
          lazyLoad(node, resolve) {
            const { level, data } = node;
            let nodes = [];
            nodes.push({
              label: '1123',
              value: 'collection',
              leaf: false,
              extras: {
                id: 1,
                type: 'collection',
                treeViewImage: 'chrome://zotero/skin/treesource-collection@2x.png'
              }
            });
            resolve(nodes);
          },
        },
        options: {
          cardtypes: ['1', '2'],
          tags: [{type: 1, tag: '333'}]
        }
      });
      const filters = reactive({
        parentIDs: parentIDs,
        match: 1,
        mode: 1,
        dates: [],
        cardtypes: [],
        tags: [],
        title: '',
        content: '',
        orderby: 'dateAdded',
        desc: false
      });
      const profiles = reactive({
        excludeTitle: _profiles.excludeTitle,
        excludeCollectionOrItemKeys: _profiles.excludeCollectionOrItemKeys,

        titleFontSize: _profiles.titleFontSize,
        contentFontSize: _profiles.contentFontSize,
        columns: _profiles.columns,
        height: _profiles.height,

        parseDate: _profiles.parseDate,
        parseTags: _profiles.parseTags,
        parseCardType: _profiles.parseCardType,
        parseWords: _profiles.parseWords,
      });
      const total = ref(0);
      const moreLoadeds = ref(0);
      const scroll = reactive({
        disabled: false,
        loading: false
      });

      const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)',
      });

      const _init = async () => {
        setTimeout(async () => {
          for (let index = 0; index < 200; index++) {
            let card = {
              id: index,
              sort: 0,
              isFull: false,
              isExpand: true,
              isSelected: false,
              isShow: true,
              note: {},
              more: {},
              noteLoaded: true,
              moreLoaded: true
            };

            card.note.title = '';
            card.note.contentHtml = '';
            card.note.text = '';
            card.note.html = '';
            card.note.dateAdded = '';
            card.note.dateModified = '';
            card.noteLoaded = true;


            card.more.tags = ['1', '2'];
            card.more.cardtype = '1';
            card.more.parentItem = undefined;
            card.more.collections = [];
            card.more.relations = [];
            card.more.statistics = { words: 1, en_words: 1, cn_words: 1, num_words: 1, length: 1, lines: 1, sizes: 1, text: 1, title: 1, space: 1 };
            card.more.date = '2023-11-02';
            card.moreLoaded = true;

            allCards.push(card);
            cards.push(card);
          }
          total.value = allCards.length;
          moreLoadeds.value = allCards.length;
          loading.close();
          for (let index = 0; index < _pagesize; index++) {
            scrollCards.push(index);
          }
        }, 50);
      }

      const _reload = async () => {
        loading.visible = true;
        moreLoadeds.value = allCards.length;
        total.value = allCards.length;
        loading.close();

        _filter();
      }

      function _filter() {
        loading.visible = true;
        scrollCards.splice(0);
        for (let index = 0; index < _pagesize && index < cards.length; index++) {
          scrollCards.push(index);
        }
        scroll.disabled = false;
        loading.close();
      }

      const handleOrderby = ZotElementPlus.debounce((orderby) => {
        filters.orderby = orderby;
        filters.desc = !filters.desc;
        _filter();
      }, 50);

      const handleModeChange = () => {
        _filter();
      }

      async function handleParentIDsCascaderChange(values) {
        for (let index = filters.parentIDs.length - 1; index >= 0; index--) {
          const ids = filters.parentIDs[index];
          if (filters.parentIDs.find((v, i) => {
            return index !== i && Zotero.ZotCard.Objects.numberStartWiths(ids, v);
          })) {
            filters.parentIDs.splice(index, 1);
          }
        }
        _reload();
      }

      function handleTools(key) {
        switch (key) {
          case 'menu':
            renders.drawer = true;
            break;
          case 'edit':
            break;
          case 'delete':
            
            break;
          case 'copy':
            
            break;
          case 'top':
            
            break;
          case 'up':
            
            break;
          case 'down':
            
            break;
          case 'bottom':
            
            break;
          case 'print':
            
            break;
          case 'expand':
            card.isExpand = true;
          break;
          case 'collapse':
            card.isExpand = false;
          break;
          case 'show':
            card.isShow = true;
            break;
          case 'hide':
            card.isShow = false;
            break;
          case 'zotero':
            
            break;
          default:
            break;
        }
      }

      function handleCardTools(key, card) {
        switch (key) {
          case 'edit':
            Zotero.getMainWindow().ZoteroPane.openNoteWindow(card.id);
            break;
          case 'delete':
            
            break;
          case 'copy':
            
            break;
          case 'top':
            
            break;
          case 'up':
            
            break;
          case 'down':
            
            break;
          case 'bottom':
            
            break;
          case 'print':
            
            break;
          case 'expand':
            card.isExpand = true;
            if (filters.mode === Zotero.ZotCard.Consts.modeProps.only_collapse) {
              _filter();
            }
          break;
          case 'collapse':
            card.isExpand = false;
            if (filters.mode === Zotero.ZotCard.Consts.modeProps.only_expand) {
              _filter();
            }
          break;
          case 'selected':
            card.isSelected = !card.isSelected;
            if (filters.mode === Zotero.ZotCard.Consts.modeProps.only_selected) {
              _filter();
            }
            break;
          case 'show':
            card.isShow = !card.isShow;
            if (filters.mode === Zotero.ZotCard.Consts.modeProps.only_show || filters.mode === Zotero.ZotCard.Consts.modeProps.only_hide) {
              _filter();
            }
            break;
          case 'zotero':
            handleLink('item', card.id);
            break;
          default:
            break;
        }
      }

      function handleCarouselChange(index, card) {
        if (index === 1) {
          Zotero.ZotCard.Cards.loadCardMore(card, card.id);
        }
      }

      function handleTitle(card) {
        handleCardTools(card.isExpand ? 'collapse' : 'expand', card);
      }

      const handleFilterInput = ZotElementPlus.debounce((field) => {
        _filter();
      }, 2000);

      function handleFilterChange(field) {
        switch (field) {
          case 'date':
            
            break;
          case 'tags':
          case 'cardtypes':
            if (filters[field].length > 1 && filters[field][filters[field].length - 1] === ('-')) {
              for (let index = filters[field].length - 1; index >= 0; index--) {
                if (filters[field][index] !== '-') {
                  filters[field].splice(index, 1);
                }
              }
            } else if (filters[field].length > 1 && filters[field][0] === ('-')) {
              filters[field].splice(0, 1);
            }
            // if (filters.cardtypes.length > 1 && filters.cardtypes[filters.cardtypes.length - 1] === ('-')) {
            //   for (let index = filters.cardtypes.length - 1; index >= 0; index--) {
            //     if (filters.cardtypes[index] !== '-') {
            //       filters.cardtypes.splice(index, 1);
            //     }
            //   }
            // } else if (filters.cardtypes.length > 1 && filters.cardtypes[0] === ('-')) {
            //   filters.cardtypes.splice(0, 1);
            // }
            break;
        
          default:
            break;
        }
        
        _filter();
      }

      const handleExcludeInput = ZotElementPlus.debounce(async (field) => {
        await _reload();
      }, 2000);
      
      async function handleExcludeChange() {
        await _reload();
      }

      async function loadMore() {
        scroll.loading = true;
        await nextTick();
        let initLength = scrollCards.length;
        for (let index = initLength; (index < initLength + _pagesize) && index < cards.length; index++) {
          scrollCards.push(index);
        }
        scroll.disabled = scrollCards.length === cards.length;
        scroll.loading = false;
        await nextTick();
      }

      function handleLink(type, id) {
        ZotElementPlus.Console.log({type, id});
        if (!ZotElementPlus.isZoteroDev) {
          switch (type) {
            case 'collection':
              Zotero.ZotCard.Collections.selectCollection(id);
              break;
            case 'item':
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
        }
        Zotero.getMainWindow().focus();
      }

      _init();

      return {
        ZotCardConsts,
        cards,
        scrollCards,
        profiles,
        renders,
        filters,
        scroll,
        moreLoadeds,
        total,
        handleOrderby,
        handleLink,
        loadMore,
        handleModeChange,
        handleCarouselChange,
        handleParentIDsCascaderChange,
        handleFilterInput,
        handleFilterChange,
        handleExcludeInput,
        handleExcludeChange,
        handleTools,
        handleTitle,
        handleCardTools
      }
    }
  });
}

