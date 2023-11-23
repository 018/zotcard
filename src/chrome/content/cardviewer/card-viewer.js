const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

// dataIn: [{type: 'library', id: 1}, {type: 'collection', id: 1}, {type: 'search', id: 1}, {type: 'item', id: 1}, {type: 'note', id: 1}]
// cards: [{...}]

const pref = 'cardviewer.profiles';
var notifierID = 0;
var _dataIn;
var _cards;
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined;
if (!io) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter io is incorrect.');
} else if (Zotero.ZotCard.Objects.isEmptyArray(io.dataIn) && Zotero.ZotCard.Objects.isEmptyArray(io.cards)) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter dataIn or cards is incorrect.');
} else {
  _dataIn = io.dataIn;
  _cards = io.cards || [];
  Zotero.ZotCard.Logger.trace('_dataIn', _dataIn?.length);
  Zotero.ZotCard.Logger.trace('_cards', _cards?.length);

  const parentIDs = Zotero.ZotCard.Cards.parseParentIDs(_dataIn || []);
  Zotero.ZotCard.Logger.trace('parentIDs', parentIDs);

  var _profiles = {
    carouselType: 'card',
    titleFontSize: 15,
    contentFontSize: 12,
  };

  _profiles = Object.assign(_profiles, Zotero.ZotCard.Prefs.getJson(pref, _profiles));
  Zotero.ZotCard.Logger.log(_profiles);

  var activate = true;

  window.onload = async function () {
    const _pagesize = 5;
    const _l10n = new Localization(["card-viewer.ftl", "zotcard.ftl"], true);

    Zotero.ZotCard.Logger.ding();
    ZotElementPlus.createElementPlusApp({
      setup() {
        Zotero.ZotCard.Logger.ding();
        const ZotCardConsts = reactive(Zotero.ZotCard.Consts);
        const cards = reactive([..._cards]);
        const renders = reactive({
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
        let cardmgrProfiles = Zotero.ZotCard.Prefs.getJson('cardmgr.profiles', _profiles);
        const profiles = reactive({
          carouselType: _profiles.carouselType,
          titleFontSize: _profiles.titleFontSize,
          contentFontSize: _profiles.contentFontSize,

          parseDate: cardmgrProfiles.parseDate,
          parseTags: cardmgrProfiles.parseTags,
          parseCardType: cardmgrProfiles.parseCardType,
          parseWords: cardmgrProfiles.parseWords,
        });
        const filters = reactive({
          orderby: 'random',
          desc: false
        });

        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        });

        Zotero.ZotCard.Logger.ding();

        const _init = async () => {
          notifierID = Zotero.Notifier.registerObserver({
            notify: function (event, type, ids, extraData) {
              // 新增
              Zotero.ZotCard.Logger.log(`event:${event}, type:${type}, ids:${JSON.stringify(ids)}`);
              switch (type) {
                case 'item':
                  switch (event) {
                    case 'modify':
                      ids.forEach(id => {
                        let card = cards.find(e => e.id === id);
                        if (card) {
                          card.noteLoaded = false;
                          card.moreLoaded = false;

                          Zotero.ZotCard.Cards.loadCardNote(card, id);
                          Zotero.ZotCard.Cards.loadCardMore(card, id, profiles);
                        }
                      });
                      break;
                    case 'trash':
                      ids.forEach(id => {
                        let index = cards.findIndex(e => e.id === id);
                        index > -1 && cards.splice(index, 1);

                        renders.total = cards.length;
                        renders.loads = Math.min(renders.loads, renders.total);
                        renders.currentIndex = Math.min(renders.currentIndex, renders.total - 1);
                      });
                      break;
                  }
                  break;
              
                default:
                  break;
              }
            },
          }, ['item'], 'zotcard');

          setTimeout(async () => {
            Zotero.ZotCard.Logger.ding();
            await _reload();
            ZotElementPlus.Console.log('inited.');
          }, 50);

          setInterval(() => {
            if (activate && cards[renders.currentIndex]) {
              if (!cards[renders.currentIndex].extras) {
                cards[renders.currentIndex].extras = {
                  time: 0
                };
              }
              cards[renders.currentIndex].extras.time ++;
            }
          }, 1000);
        }

        const _reload = async () => {
          loading.visible = true;
          renders.loads = 0;
          cards.splice(0);
          if (Zotero.ZotCard.Objects.isNoEmptyArray(parentIDs)) {
            let allCards = [];
            
            await Zotero.ZotCard.Cards.load(window, allCards, parentIDs, {
              excludeTitle: '',
              excludeCollectionOrItemKeys: [],
      
              parseDate: true,
              parseTags: true,
              parseCardType: true,
              parseWords: true,
            }, (card) => {
            }, (allCards) => {
              cards.push(...allCards);
              Zotero.ZotCard.Logger.trace('cards', cards.length);
              renders.total = cards.length;
              renders.loads = Math.min(_pagesize, renders.total);
              renders.currentIndex = 0;
              loading.close();
            });
          } else {
            cards.push(..._cards);
            Zotero.ZotCard.Logger.trace('cards', cards);
            renders.total = cards.length;
            renders.loads = Math.min(_pagesize, renders.total);
            renders.currentIndex = 0;
            loading.close();
            nextTick();
          }
          Zotero.ZotCard.Logger.ding();
        }

        function handleCarouselChange(index) {
          renders.currentIndex = index;

          if (renders.currentIndex >= renders.loads - 1) {
            renders.loads = Math.min(renders.total, renders.loads + _pagesize);
            Zotero.ZotCard.Logger.log('load carousel ... ' + renders.loads);
            
          }
        }

        function handleCardTools(key, card) {
          Zotero.ZotCard.Logger.ding();
          
          switch (key) {
            case 'edit-editInWindow':
              Zotero.getMainWindow().ZoteroPane.openNoteWindow(card.id);
              break;
            case 'edit-cardEditor':
              Zotero.ZotCard.Dialogs.openCardEditor(card.id);
              break;
            case 'remove':
              let index = cards.indexOf(card);
              if (index > -1) {
                cards.splice(index, 1);
                renders.total = cards.length;
                renders.loads = Math.min(renders.loads, renders.total);
                renders.currentIndex = Math.min(renders.currentIndex, renders.total - 1);
              }
              break;
            case 'delete':
              if (Zotero.ZotCard.Messages.confirm(window, Zotero.ZotCard.L10ns.getString('zotcard-trash'))) {
                Zotero.Items.trashTx(card.id);
              }
              break;
            case 'copy-content':
              Zotero.ZotCard.Clipboards.copyHtmlTextToClipboard(card.note.html, card.note.text);
              break;
            case 'copy-text':
              Zotero.ZotCard.Clipboards.copyTextToClipboard(card.note.text);
              break;
            case 'copy-markdown':
              Zotero.ZotCard.Clipboards.copyTextToClipboard(Zotero.ZotCard.Notes.translationToMarkdown(card.note.html));
              break;
            case 'copy-html':
              Zotero.ZotCard.Clipboards.copyTextToClipboard(card.note.html);
              break;
            case 'print':
              Zotero.ZotCard.Dialogs.openPrintCard([card.id]);
              break;
            case 'zotero':
              handleLink(Zotero.ZotCard.Consts.cardManagerType.item, card.id);
              break;
            default:
              break;
          }
        }

        function handleTools(key) {
          switch (key) {
            case 'zotero':
              Zotero.getMainWindow().focus();
              break;
            default:
              break;
          }
        }

        function handleUIChange(field) {
          Zotero.ZotCard.Logger.log(`${field} >>> ${profiles[field]}`);
          Zotero.ZotCard.Prefs.setJsonValue(pref, field, profiles[field]);
          switch (field) {
            case 'titleFontSize':
              break;
            case 'contentFontSize':
              break;
            case 'carouselDirection':
            case 'carouselType':
              if (profiles.carouselDirection === 'vertical') {
                profiles.carouselType = 'card';
                Zotero.ZotCard.Prefs.setJsonValue(pref, 'carouselType', profiles.carouselType);
              }
              Zotero.ZotCard.Logger.log(cards);
              
              Zotero.ZotCard.Dialogs.openCardViewerWithCards(cards);
              break;
            default:
              break;
          }
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

        const handleOrderby = ZotElementPlus.debounce((orderby) => {
          filters.orderby = orderby;
          if (orderby === 'random') {
            for (let index = 0; index < cards.length; index++) {
              let random1 = parseInt(Math.random() * (cards.length));
              let random2 = parseInt(Math.random() * (cards.length));
              Zotero.ZotCard.Utils.swap(cards, random1, random2);
            }times
          } else if (orderby === 'times') {
            filters.desc = !filters.desc;
            cards.sort((card1, card2) => Zotero.ZotCard.Cards.compare(card1.extras ? card1.extras.time : 0, card2.extras ? card2.extras.time : 0, filters.desc));
          } else {
            filters.desc = !filters.desc;
            Zotero.ZotCard.Cards.sort(cards, filters);
          }
        }, 50);

        _init();

        return {
          ZotCardConsts,
          cards,
          renders,
          profiles,
          filters,
          handleOrderby,
          handleTools,
          handleCardTools,
          handleUIChange,
          handleCarouselChange,
          handleLink,
        }
      }
    });
  }

  window.addEventListener("deactivate", function(event) { 
    Zotero.ZotCard.Logger.log('deactivate');
    activate = false;
  });
  window.addEventListener("activate", function(event) {
    Zotero.ZotCard.Logger.log('activate');
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
      } else if (itemID && key) {
        let item = Zotero.Items.get(itemID);
        let attachment = Zotero.Items.getByLibraryAndKey(item.libraryID, key);
        if (attachment && attachment.parentID == item.id) {
          attachment.attachmentDataURI.then(dataURI => {
            event.originalTarget.setAttribute('src', dataURI);
            Zotero.ZotCard.Logger.log(`attachment ${item.libraryID}, ${key} replace.`);
          });
        } else {
          Zotero.ZotCard.Logger.log(`attachment ${item.libraryID}, ${key} not exists.`);
        }
      } else {
        Zotero.ZotCard.Logger.log('click img but the itemID or key is null.');
      }
    }
  }, false);

  window.onclose = function() {
    Zotero.ZotCard.Logger.log('onclose');
    
    let viewer = Zotero.getMainWindow().document.getElementById(`zotero-tb-card-viewer`);
    if (viewer) {
      viewer.remove();
    }

    if (notifierID > 0) {
      Zotero.Notifier.unregisterObserver(this.notifierID);
    }
  }
}