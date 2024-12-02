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
        drawer: false,
        innerHeight: window.innerHeight,
        currentIndex: 0,
        total: 0,
        loads: 0,
        isOrderbyDesc: (f) => {
          return filters.orderby === f && filters.desc;
        },
        formatTime: (time) => {
          let s = parseInt(time % 60);
          let m = parseInt(time % (60 * 60) / 60);
          let h = parseInt(time % (60 * 60 * 60) / (60 * 60));
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

      const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)',
      });

      const _init = async () => {
        setTimeout(async () => {
          for (let index = 0; index < 20; index++) {
            let card = {
              id: index,
              sort: 0,
              isFull: false,
              isExpand: true,
              isSelected: false,
              isShow: true,
              note: {},
              more: {},
              extras: {
                time: 60 * 59 + 50,
              },
              noteLoaded: true,
              moreLoaded: true,
            };

            card.note.title = '肩颈拉伸';
            card.note.contentHtml = `<div data-schema-version="8">
            <p>偏头理气拉伸动作可以缓解肩部的紧张状态，改善肩部的血液循环。对于手麻、肩痛有很好的缓解效果。</p>
            <p><span style="color: var(--t1)">要领：</span></p>
            <p><span style="color: var(--t1)">1、身体采取自然站姿或坐姿，保持上身正直。左手护头，右手自然下垂。<br>2、吸气的同时将头缓缓向左侧倾斜，直到有轻微的拉伸感。呼气，同时将头缓慢向左倾斜，直到拉伸感由右侧到右后侧。保持5-10秒后自然呼吸还远原。放松后做另外一侧。</span></p>
            <p>日期：2022-10-30</p>
            <p>出处：<a href="https://view.inews.qq.com/k/20220413A08T1A00?web_channel=wap&amp;openApp=false" rel="noopener noreferrer nofollow">https://view.inews.qq.com/k/20220413A08T1A00?web_channel=wap&amp;openApp=false</a></p>
            </div>`;
            card.note.text = '';
            card.note.html = '';
            card.note.dateAdded = '2023-11-07 21:38:00';
            card.note.dateModified = '2023-11-07 21:38:00';
            card.noteLoaded = true;


            card.more.tags = [{type: 1, tag: '1'}, {type: 2, tag: '2'}];
            card.more.cardtype = '1';
            card.more.parentItem = undefined;
            card.more.collections = [];
            card.more.relations = [];
            card.more.statistics = { words: 1, en_words: 1, cn_words: 1, num_words: 1, length: 1, lines: 1, sizes: 1, text: 1, title: 1, space: 1 };
            card.more.date = '2023-11-02';
            card.moreLoaded = true;

            cards.push(card);
          }
          renders.total = cards.length;
          renders.loads = _pagesize;
          loading.close();
        }, 50);

        setInterval(() => {
          cards[renders.currentIndex].extras.time ++;
        }, 1000);
      }

      function handleCarouselChange(index) {
        renders.currentIndex = index;

        if (renders.currentIndex == renders.loads - 1) {
          renders.loads = Math.min(renders.total, renders.loads + _pagesize);
        }
      }

      function handleTools(key) {
        switch (key) {
          case 'menu':
            renders.drawer = true;
            break;
          case 'refresh':
            _reload();
            break;
            break;
          case 'zotero':
            Zotero.getMainWindow().focus();
            break;
          default:
            break;
        }
      }

      function handleUIChange(field) {
        switch (field) {
          case 'titleFontSize':
            break;
          case 'contentFontSize':
            break;
          case 'carouselDirection':
            break;
          case 'carouselType':
            break;
          default:
            break;
        }
      }

      _init();

      return {
        ZotCardConsts,
        cards,
        renders,
        profiles,
        filters,
        handleTools,
        handleUIChange,
        handleCarouselChange,
      }
    }
  });
}

window.addEventListener("deactivate", function(event) { 
  activate = false;
});
window.addEventListener("activate", function(event) {
  activate = true;
});


window.addEventListener("click", function (event) {
  if (!event.originalTarget) {
    return;
  }

	if (event.originalTarget.localName == 'a') {
    let href = event.originalTarget.getAttribute('href');
    if (href) {
      Zotero.launchURL(href);
    } else {
      Zotero.ZotCard.Logger.log('click a but the href is null.');
    }
	} else if (event.originalTarget.localName == 'img') {
    let src = event.originalTarget.getAttribute('src');
    let itemID = event.originalTarget.getAttribute('itemID');
    let key = event.originalTarget.getAttribute('data-attachment-key');
    if (src) {
      Zotero.ZotCard.Logger.log('click img but the loaded.');
      let width = event.originalTarget.getAttribute('width');
      let height = event.originalTarget.getAttribute('height');
      let srcWidth = event.originalTarget.getAttribute('srcWidth');
      let srcHeight = event.originalTarget.getAttribute('srcHeight');
      if (srcWidth || srcHeight) {
        event.originalTarget.setAttribute('width', srcWidth);
        event.originalTarget.setAttribute('height', srcHeight);
        event.originalTarget.removeAttribute('srcWidth');
        event.originalTarget.removeAttribute('srcHeight');
      } else {
        event.originalTarget.setAttribute('srcWidth', width);
        event.originalTarget.setAttribute('srcHeight', height);
        event.originalTarget.setAttribute('width', '100%');
        event.originalTarget.setAttribute('height', '100%');
      }
      return;
    }
	}
});

window.onclose = function() {
  Zotero.ZotCard.Logger.log('onclose');
  
  if (notifierID > 0) {
    Zotero.Notifier.unregisterObserver(this.notifierID);
  }
}
