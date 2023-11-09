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
        },
        cardViewerPopover: {
          visible: false,
          selected: 'all',
          total: 0,
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
            card.note.contentHtml = `<div data-schema-version="8"><h1>E.da - 贝叶斯定理</h1>
            <p><strong>提出者</strong>：托马斯·贝叶斯(Thomas Bayes)，1763</p>
            <p><strong>描述</strong>：</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<img alt="" data-attachment-key="2H75EIMA" src="data:image/png;base64,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" src="data:image/png;base64,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" width="146" height="48"></p>
            <p>&nbsp;&nbsp;&nbsp; 其他A以及B为随机事件，P(B)是B的先验概率，且P(B)不为零。P(A|B)是指在事件B发生的情况下事件A发生的概率，也就是已知B发生后，A的条件概率，也由于得自B的取值而被称作A的后验概率。</p>
            <p>按这些术语，贝叶斯定理可表述为：后验概率 = (似然性*先验概率)/标准化常量。也就是说，后验概率与先验概率和相似度的乘积成正比。另外，比例P(B|A)/P(B)/P(B)也有时被称作标准似然度（standardised likelihood），贝叶斯定理可表述为：后验概率 = 标准似然度*先验概率。</p>
            <p><strong>例子</strong>：一座别墅在过去的 20 年里一共发生过 2 次被盗，别墅的主人有一条狗，狗平均每周晚上叫 3 次，在盗贼入侵时狗叫的概率被估计为 0.9，问题是：在狗叫的时候发生入侵的概率是多少？<br>我们假设 A 事件为狗在晚上叫，B 为盗贼入侵，则以天为单位统计，P(A) = 3/7，P(B) = 2/(20*365) = 2/7300，P(A|B) = 0.9，按照公式很容易得出结果：P(B|A) = 0.9*(2/7300) / (3/7) = 0.00058</p>
            <p><strong>出处</strong>：<a onclick="Zotero.debug(event.target.href)" href="https://zh.wikipedia.org/wiki/贝叶斯定理" rel="noopener noreferrer nofollow">《维基百科》</a>、<a onclick="Zotero.debug(event.target.href)" href="https://baike.baidu.com/item/贝叶斯公式" rel="noopener noreferrer nofollow">《百科》</a></p>
            <p><strong>标签</strong>：[无]</p>
            <p><strong>日期</strong>：2020-07-24</p>
            <p>&nbsp;</p>
            </div>
            `;
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
          case 'cardviewer':
            renders.cardViewerPopover.visible = true;
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

      function handelCardViewerPopoverChagne() {
        switch (renders.cardViewerPopover.selected) {
          case 'all':
            renders.cardViewerPopover.total = cards.length;
            break;
          case 'random':
            renders.cardViewerPopover.total = cards.length / 2;
            break;
          case 'selectbefore':
            renders.cardViewerPopover.total = Math.min(5, cards.length);
            break;
          case 'selectafter':
            renders.cardViewerPopover.total = Math.min(5, cards.length);
            break;
        
          default:
            break;
        }
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
        handleCardTools,
        handelCardViewerPopoverChagne
      }
    }
  });
}

