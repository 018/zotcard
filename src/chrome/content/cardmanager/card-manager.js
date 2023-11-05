const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

var from;
var dataIn;
let io;
let tabID = Zotero.getMainWindow().Zotero_Tabs.selectedID;
if (tabID) {
  let tab = Zotero.getMainWindow().Zotero_Tabs._getTab(tabID);
  if (tab && tab.tab && tab.tab.type === 'zotero-pane' && tab.tab.id.startsWith('card-manager-')) {
    dataIn = tab.tab.data ? tab.tab.data.dataIn : undefined;

    from = 'tab';
  }
} 

Zotero.ZotCard.Logger.log('dataIn: ' + JSON.stringify(dataIn));
if (!dataIn) {
  io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : {dataIn: []};
  dataIn = io.dataIn;
  from = 'window';
}

Zotero.ZotCard.Logger.log('dataIn: ' + JSON.stringify(dataIn));


const parentIDs = [];
dataIn.forEach(element => {
  switch (element.type) {
    case Zotero.ZotCard.Consts.cardManagerType.library:
      // library
      let library = Zotero.Collections.get(element.id);
      if (Zotero.ZotCard.Objects.isNullOrUndefined(library)) {
        ZotElementPlus.Console.log('The libraryID ' + element.id + ' is incorrect.');
      }
      parentIDs.push(['library-' + library.id]);
      break;
    case Zotero.ZotCard.Consts.cardManagerType.collection:
      // collection
      let collection = Zotero.Collections.get(element.id);
      if (Zotero.ZotCard.Objects.isNullOrUndefined(collection)) {
        ZotElementPlus.Console.log('The collectionID ' + element.id + ' is incorrect.');
      }
      parentIDs.push(Zotero.ZotCard.Collections.links(element.id).map(e => {
        return e.type + '-' + e.dataObject.id
      }));
      break;
    case Zotero.ZotCard.Consts.cardManagerType.search:
      // search
      let search = Zotero.Searches.get(element.id);
      if (Zotero.ZotCard.Objects.isNullOrUndefined(search)) {
        ZotElementPlus.Console.log('The searchID ' + element.id + ' is incorrect.');
      }
      parentIDs.push(Zotero.ZotCard.Searches.links(element.id).map(e => {
        return e.type + '-' + e.dataObject.id
      }));
      break;
    case Zotero.ZotCard.Consts.cardManagerType.item:
      // item
      let item = Zotero.Items.get(element.id);
      if (Zotero.ZotCard.Objects.isEmptyNumber(item)) {
        ZotElementPlus.Console.log('The itemID ' + element.id + ' is incorrect.');
      }
      let pIDs1 = [];
      if (element.collectionID) {
        pIDs1.push(...Zotero.ZotCard.Collections.links(element.collectionID).map(e => {
          return e.type + '-' + e.dataObject.id
        }));
        pIDs1.push('item-' + element.id);
      } else {
        pIDs1.push(Zotero.ZotCard.Items.links(element.id).map(e => {
          return e.type + '-' + e.dataObject.id
        }));
      }
      parentIDs.push(pIDs1);

      break;
    case Zotero.ZotCard.Consts.cardManagerType.note:
      // note
      let note = Zotero.Collections.get(element.id);
      if (Zotero.ZotCard.Objects.isEmptyNumber(note)) {
        ZotElementPlus.Console.log('The noteID ' + element.id + ' is incorrect.');
      }

      let pIDs2 = [];
      if (element.collectionID) {
        pIDs2.push(...Zotero.ZotCard.Collections.links(element.collectionID).map(e => {
          return e.type + '-' + e.dataObject.id
        }));
        pIDs2.push('item-' + element.id);
      } else {
        pIDs2.push(Zotero.ZotCard.Notes.links(element.id).map(e => {
          return e.type + '-' + e.dataObject.id
        }));
      }
      parentIDs.push(pIDs2);
      break;
  }
});

Zotero.ZotCard.Logger.log('parentIDs: ' + JSON.stringify(parentIDs));

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

var notifierID = 0;

window.onload = async function () {
  const _pagesize = 15;
  const _l10n = new Localization(["card-manager.ftl", "zotcard.ftl"], true);

  ZotElementPlus.createElementPlusApp({
    setup() {
      const ZotCardConsts = reactive(Zotero.ZotCard.Consts);
      const allCards = reactive([]);
      const cards = reactive([]);
      const scrollCards = reactive([]);
      let saveFilters = Zotero.ZotCard.Prefs.getJson('cardmgr.savefilters', []);
      const renders = reactive({
        drawer: false,
        date_picker_shortcuts: ZotElementPlus.Consts.date_picker_shortcuts,
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
            if (level === 0) {
              let librarys = Zotero.Libraries.getAll();
              librarys.forEach(l => {
                if (l.libraryType === 'user') {
                  nodes.push({
                    label: l.name,
                    value: 'library-' + l.libraryID,
                    leaf: !l.hasCollections(),
                    extras: {
                      id: l.libraryID,
                      type: 'library',
                      treeViewImage: l.treeViewImage
                    }
                  });
                } else if (l.libraryType === 'group') {
                  nodes.push({
                    label: l.name,
                    value: 'library-' + l.libraryID,
                    leaf: !l.hasCollections(),
                    extras: {
                      id: l.libraryID,
                      type: 'library',
                      treeViewImage: l.treeViewImage
                    }
                  });
                }
              });
            } else {
              let collections;
              switch (data.extras.type) {
                case Zotero.ZotCard.Consts.cardManagerType.library:
                  collections = Zotero.Collections.getByLibrary(data.extras.id);
                  nodes.push(...collections.map(c => {
                    return {
                      label: c.name,
                      value: 'collection-' + c.id,
                      leaf: Zotero.Collections.getByParent(c.id).length === 0 && c.getChildItems() === 0,
                      extras: {
                        id: c.id,
                        type: Zotero.ZotCard.Consts.cardManagerType.collection,
                        treeViewImage: 'chrome://zotero/skin/treesource-collection@2x.png'
                      }
                    }
                  }));

                  let searches = Zotero.Searches.getByLibrary(data.extras.id);
                  nodes.push(...searches.map(s => {
                    return {
                      label: s.name,
                      value: 'search-' + s.id,
                      leaf: true,
                      extras: {
                        id: s.id,
                        type: 'search',
                        treeViewImage: Zotero.isMac ? 'chrome://zotero-platform/content/treesource-search@2x.png' : 'chrome://zotero/skin/treesource-search@2x.png'
                      }
                    }
                  }));

                  // load items
                  break;
                case Zotero.ZotCard.Consts.cardManagerType.collection:
                  collections = Zotero.Collections.getByParent(data.extras.id);
                  nodes.push(...collections.map(c => {
                    return {
                      label: c.name,
                      value: 'collection-' + c.id,
                      leaf: Zotero.Collections.getByParent(c.id).length === 0 && c.getChildItems().length === 0,
                      extras: {
                        id: c.id,
                        type: Zotero.ZotCard.Consts.cardManagerType.collection,
                        treeViewImage: 'chrome://zotero/skin/treesource-collection@2x.png'
                      }
                    }
                  }));

                  let collection = Zotero.Collections.get(data.extras.id);
                  collection.getChildItems().forEach(i => {
                    if (i.isRegularItem() || i.isNote()) {
                      nodes.push({
                        label: i.getDisplayTitle(),
                        value: (i.isRegularItem() ? Zotero.ZotCard.Consts.cardManagerType.item : i.itemType) + '-' + i.id,
                        leaf: true,
                        extras: {
                          id: i.id,
                          type: i.itemType,
                          treeViewImage: `chrome://zotero/skin/treeitem-${i.itemType}@2x.png`
                        }
                      })
                    }
                  });
                  
                  break;
                default:
                  let item = Zotero.Items.get(data.extras.id);
                  item.getNotes().forEach(i => {
                    let note = Zotero.Items.get(i);
                    nodes.push({
                      label: note.getDisplayTitle(),
                      value: 'note-' + note.id,
                      leaf: true,
                      extras: {
                        id: note.id,
                        type: 'note',
                        treeViewImage: `chrome://zotero/skin/treeitem-note@2x.png`
                      }
                    })
                  });
                  break;
              }
            }
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
            if (level === 0) {
              let librarys = Zotero.Libraries.getAll();
              librarys.forEach(l => {
                if (l.libraryType === 'user') {
                  nodes.push({
                    label: l.name,
                    value: 'library-' + l.libraryID + '-' + l.libraryID,
                    leaf: !l.hasCollections(),
                    extras: {
                      id: l.libraryID,
                      type: 'library',
                      treeViewImage: l.treeViewImage
                    }
                  });
                } else if (l.libraryType === 'group') {
                  nodes.push({
                    label: l.name,
                    value: 'library-' + l.libraryID + '-' + l.libraryID,
                    leaf: !l.hasCollections(),
                    extras: {
                      id: l.libraryID,
                      type: 'library',
                      treeViewImage: l.treeViewImage
                    }
                  });
                }
              });
            } else {
              let collections;
              switch (data.extras.type) {
                case 'library':
                  collections = Zotero.Collections.getByLibrary(data.extras.id);
                  nodes.push(...collections.map(c => {
                    return {
                      label: c.name,
                      value: 'collection-' + c.libraryID + '-' + c.key,
                      leaf: Zotero.Collections.getByParent(c.id).length === 0,
                      extras: {
                        id: c.id,
                        type: Zotero.ZotCard.Consts.cardManagerType.collection,
                        treeViewImage: 'chrome://zotero/skin/treesource-collection@2x.png'
                      }
                    }
                  }));

                  // load items
                  break;
                case Zotero.ZotCard.Consts.cardManagerType.collection:
                  collections = Zotero.Collections.getByParent(data.extras.id);
                  nodes.push(...collections.map(c => {
                    return {
                      label: c.name,
                      value: 'collection-' + c.libraryID + '-' + c.key,
                      leaf: Zotero.Collections.getByParent(c.id).length === 0 && c.getChildItems().length === 0,
                      disabled: node.parent.disabled || node.parent.checked,
                      extras: {
                        id: c.id,
                        type: Zotero.ZotCard.Consts.cardManagerType.collection,
                        treeViewImage: 'chrome://zotero/skin/treesource-collection@2x.png'
                      }
                    }
                  }));

                  let collection = Zotero.Collections.get(data.extras.id);
                  collection.getChildItems().forEach(i => {
                    if (i.isRegularItem()) {
                      nodes.push({
                        label: i.getDisplayTitle(),
                        value: (i.isRegularItem() ? Zotero.ZotCard.Consts.cardManagerType.item : i.itemType) + '-' + i.libraryID + '-' + i.key,
                        leaf: true,
                        disabled: node.parent.disabled || node.parent.checked,
                        extras: {
                          id: i.id,
                          type: i.itemType,
                          treeViewImage: `chrome://zotero/skin/treeitem-${i.itemType}@2x.png`
                        }
                      })
                    }
                  });
                  break;
                default:
                  break;
              }
            }
            resolve(nodes);
          },
        },
        saveFilters: saveFilters,
        options: {
          cardtypes: [],
          tags: []
        },
      });
      const filters = reactive({
        parentIDs: parentIDs,
        match: Zotero.ZotCard.Consts.matchProps.all,
        mode: Zotero.ZotCard.Consts.modeProps.all,
        dates: [],
        cardtypes: [],
        tags: [],
        title: '',
        content: '',
        orderby: 'dateAdded',
        desc: false
      });
      const saveFilter = reactive({
        label: '',
        selectedLabel: '',
        selectedTime: ''
      })
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

        titleFontSize: cardmgrProfiles.titleFontSize,
        contentFontSize: cardmgrProfiles.contentFontSize,
        columns: cardmgrProfiles.columns,
        height: cardmgrProfiles.height,

        parseDate: cardmgrProfiles.parseDate,
        parseTags: cardmgrProfiles.parseTags,
        parseCardType: cardmgrProfiles.parseCardType,
        parseWords: cardmgrProfiles.parseWords,
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
                      let index = allCards.findIndex(e => e.id === id);
                      index > -1 && allCards.splice(index, 1);
                      
                      index = cards.findIndex(e => e.id === id);
                      if (index > -1) {
                        cards.splice(index, 1);
                        if (cards.length < scrollCards.length) {
                          scrollCards.splice(scrollCards.length - 1, 1);
                        }
                      }
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
          await _reload();
          ZotElementPlus.Console.log('inited.');
        }, 50);
      }

      const _reload = async () => {
        loading.visible = true;
        moreLoadeds.value = 0;
        renders.options.cardtypes.splice(0);
        renders.options.tags.splice(0);
        await Zotero.ZotCard.Cards.load(window, allCards, filters, profiles, (card) => {
          card.more.tags.forEach(tag => {
            if (!renders.options.tags.find((t) => tag.type === t.type && tag.tag === t.tag)) {
              renders.options.tags.push(tag);
            }
          });

          if (!renders.options.cardtypes.includes(card.more.cardtype)) {
            renders.options.cardtypes.push(card.more.cardtype);
          }
        }, (allCards) => {
          moreLoadeds.value = allCards.length;
        });
        total.value = allCards.length;
        loading.close();

        _filter();
      }

      function _filter() {
        loading.visible = true;
        Zotero.ZotCard.Cards.filter(allCards, cards, filters);
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

      async function handleTools(key) {
        let selecteds;
        let htmls;
        let texts;
        switch (key) {
          case 'menu':
            renders.drawer = true;
            break;
          case 'refresh':
            await _reload();
            break;
          case 'edit':
            selecteds = cards.filter(e => e.isSelected);
            Zotero.ZotCard.Dialogs.openMultiEditManager(selecteds.map(e => e.id));
            break;
          case 'delete':
            selecteds = cards.filter(e => e.isSelected);
            if (selecteds.length === 0) {
              Zotero.ZotCard.Messages.warning(window, Zotero.ZotCard.L10ns.getString('zotcard-pleas_select_card'));
              return;
            }

            if (Zotero.ZotCard.Messages.confirm(window, Zotero.ZotCard.L10ns.getString('zotcard-trash'))) {
              selecteds.forEach(id => {
                Zotero.Items.trashTx(id);
              });
            }
            break;
          case 'copy-content':
            selecteds = cards.filter(e => e.isSelected);
            if (selecteds.length === 0) {
              Zotero.ZotCard.Messages.warning(window, Zotero.ZotCard.L10ns.getString('zotcard-pleas_select_card'));
              return;
            }
            
            htmls = '';
            texts = '';
            selecteds.forEach(card => {
              if (htmls.length > 0) {
                htmls += '<br />\n<br />\n<br />\n<br />\n';
              }
              htmls += card.note.html;

              if (texts.length > 0) {
                texts += '\n\n\n\n';
              }
              texts += card.note.text;
            });
            Zotero.ZotCard.Clipboards.copyHtmlTextToClipboard(htmls, texts);
            break;
          case 'copy-text':
            selecteds = cards.filter(e => e.isSelected);
            if (selecteds.length === 0) {
              Zotero.ZotCard.Messages.warning(window, Zotero.ZotCard.L10ns.getString('zotcard-pleas_select_card'));
              return;
            }
            
            texts = '';
            selecteds.forEach(card => {
              if (texts.length > 0) {
                texts += '\n\n\n\n';
              }
              texts += card.note.text;
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(texts);
            break;
          case 'copy-markdown':
            selecteds = cards.filter(e => e.isSelected);
            if (selecteds.length === 0) {
              Zotero.ZotCard.Messages.warning(window, Zotero.ZotCard.L10ns.getString('zotcard-pleas_select_card'));
              return;
            }
            
            let markdowns = '';
            selecteds.forEach(card => {
              if (markdowns.length > 0) {
                markdowns += '\n\n\n\n';
              }
              markdowns += Zotero.ZotCard.Notes.translationToMarkdown(card.note.html);
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(markdowns);
            break;
          case 'copy-html':
            selecteds = cards.filter(e => e.isSelected);
            if (selecteds.length === 0) {
              Zotero.ZotCard.Messages.warning(window, Zotero.ZotCard.L10ns.getString('zotcard-pleas_select_card'));
              return;
            }
            
            htmls = '';
            selecteds.forEach(card => {
              if (htmls.length > 0) {
                htmls += '<br />\n<br />\n<br />\n<br />\n';
              }
              htmls += card.note.html;
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(htmls);
            break;
          // case 'top':
            
          //   break;
          // case 'up':
            
          //   break;
          // case 'down':
            
          //   break;
          // case 'bottom':
            
          //   break;
          case 'selectedall':
            cards.forEach(card => {
              card.isSelected = true;
            });
            break;
          case 'unselectedall':
            cards.forEach(card => {
              card.isSelected = false;
            });
            break;
          case 'view':
            cards.forEach(card => {
              card.isShow = true;
            });
            break;
          case 'hide':
            cards.forEach(card => {
              card.isShow = false;
            });
            break;
          case 'collapse':
            cards.forEach(card => {
              card.isExpand = false;
            });
            break;
          case 'expand':
            cards.forEach(card => {
              card.isExpand = true;
            });
            break;
          case 'print':
            selecteds = cards.filter(e => e.isSelected);
            if (selecteds.length === 0) {
              Zotero.ZotCard.Messages.warning(window, Zotero.ZotCard.L10ns.getString('zotcard-pleas_select_card'));
              return;
            }

            Zotero.ZotCard.Dialogs.openPrintCard(selecteds.map(e => e.id));
            
            break;
          // case 'expand':
          //   card.isExpand = true;
          // break;
          // case 'collapse':
          //   card.isExpand = false;
          // break;
          // case 'show':
          //   card.isShow = true;
          //   break;
          // case 'hide':
          //   card.isShow = false;
          //   break;
          case 'zotero':
            switch (from) {
              case 'window':
                Zotero.getMainWindow().focus();
                break;
              case 'tab':
                Zotero.getMainWindow().Zotero_Tabs.select('zotero-pane');
                break;
            
              default:
                break;
            }
            break;
          case 'window':
            if (tabID) {
              Zotero.getMainWindow().Zotero_Tabs.close(tabID);
            }
            Zotero.ZotCard.Dialogs.openCardManager(dataIn);
            break;
          case 'report':
            
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
          // case 'top':
            
          //   break;
          // case 'up':
            
          //   break;
          // case 'down':
            
          //   break;
          // case 'bottom':
            
          //   break;
          case 'print':
            Zotero.ZotCard.Dialogs.openPrintCard([card.id]);
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
            handleLink(Zotero.ZotCard.Consts.cardManagerType.item, card.id);
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

        saveFilter.selectedLabel = '';
        saveFilter.selectedTime = '';
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
            break;
        
          default:
            break;
        }
        
        _filter();

        saveFilter.selectedLabel = '';
      }

      const handleExcludeInput = ZotElementPlus.debounce(async (field) => {
        switch (field) {
          case 'excludeTitle':
            let cardmgrProfiles = Zotero.ZotCard.Prefs.getJson('cardmgr.profiles', _profiles);
            cardmgrProfiles.excludeTitle = profiles.excludeTitle;
            Zotero.ZotCard.Logger.log(cardmgrProfiles);
            Zotero.ZotCard.Prefs.setJson('cardmgr.profiles', cardmgrProfiles);
            break;
        
          default:
            break;
        }
        await _reload();

        saveFilter.selectedLabel = '';
        saveFilter.selectedTime = '';
      }, 2000);

      async function handleParseChange(field) {
        let reload = false;
        let cardmgrProfiles = Zotero.ZotCard.Prefs.getJson('cardmgr.profiles', _profiles);
        switch (field) {
          case 'parseDate':
            cardmgrProfiles.parseDate = profiles.parseDate;
            reload = cardmgrProfiles.parseDate;
            break;
          case 'parseTags':
            cardmgrProfiles.parseTags = profiles.parseTags;
            reload = cardmgrProfiles.parseTags;
            break;
          case 'parseCardType':
            cardmgrProfiles.parseCardType = profiles.parseCardType;
            reload = cardmgrProfiles.parseCardType;
            break;
          case 'parseWords':
            cardmgrProfiles.parseWords = profiles.parseWords;
            reload = cardmgrProfiles.parseWords;
            break;
          default:
            break;
        }
        Zotero.ZotCard.Prefs.setJson('cardmgr.profiles', cardmgrProfiles);

        if (reload) {
          await _reload();
        }
      }

      function handleUIChange(field) {
        let cardmgrProfiles = Zotero.ZotCard.Prefs.getJson('cardmgr.profiles', _profiles);
        switch (field) {
          case 'titleFontSize':
            cardmgrProfiles.titleFontSize = profiles.titleFontSize;
            break;
          case 'contentFontSize':
            cardmgrProfiles.contentFontSize = profiles.contentFontSize;
            break;
          case 'columns':
            cardmgrProfiles.columns = profiles.columns;
            break;
          case 'height':
            cardmgrProfiles.height = profiles.height;
            break;
          default:
            break;
        }
        Zotero.ZotCard.Logger.log(cardmgrProfiles);
        Zotero.ZotCard.Prefs.setJson('cardmgr.profiles', cardmgrProfiles);
      }

      async function handleExcludeChange(field) {
        let cardmgrProfiles = Zotero.ZotCard.Prefs.getJson('cardmgr.profiles', _profiles);
        switch (field) {
          case 'excludeCollectionOrItemKeys':
            cardmgrProfiles.excludeCollectionOrItemKeys = profiles.excludeCollectionOrItemKeys.map(e => {
              return e[e.length - 1];
            });
            break;
        
          default:
            break;
        }
        Zotero.ZotCard.Logger.log(cardmgrProfiles);
        Zotero.ZotCard.Prefs.setJson('cardmgr.profiles', cardmgrProfiles);

        await _reload();
      }
      
      function handleSaveFilter() {
        Zotero.ZotCard.Logger.log(saveFilter);
        
        let cardmgrFilters = Zotero.ZotCard.Prefs.getJson('cardmgr.savefilters', []);
        if (cardmgrFilters.find((e) => e.label === saveFilter.label)) {
          Zotero.ZotCard.Messages.warning(window, _l10n.formatValueSync('zotcard-card-manager-filter-save-exist', {title: saveFilter.label}));
          return;
        }
        let currentSaveFilter = {
          label: saveFilter.label,
          time: Zotero.ZotCard.DateTimes.formatDate(new Date(), Zotero.ZotCard.DateTimes.yyyyMMddHHmmss),
          parentIDs: filters.parentIDs.map(e => {
            return e[e.length -1];
          }),
          match: filters.match,
          mode: filters.mode,
          dates: filters.dates,
          cardtypes: filters.cardtypes,
          tags: filters.tags,
          title: filters.title,
          content: filters.content,
          orderby: filters.orderby,
          desc: filters.desc
        };
        cardmgrFilters.push(currentSaveFilter);
        Zotero.ZotCard.Prefs.setJson('cardmgr.savefilters', cardmgrFilters);
        renders.saveFilters = cardmgrFilters;

        saveFilter.selectedLabel = saveFilter.label;

        saveFilter.label = '';
      }
      
      function handleDeleteFilter() {
        Zotero.ZotCard.Logger.log(saveFilter);
        if (Zotero.ZotCard.Messages.confirm(window, _l10n.formatValueSync('zotcard-card-manager-filter-saves-confirm_delete'))) {
          let cardmgrFilters = Zotero.ZotCard.Prefs.getJson('cardmgr.savefilters', []);
          
          let index = cardmgrFilters.findIndex((e) => e.label === saveFilter.selectedLabel)
          if (index < 0) {
            Zotero.ZotCard.Messages.warning(window, _l10n.formatValueSync('zotcard-card-manager-filter-save-notexist', {title: saveFilter.selectedLabel}));
            return;
          }
          cardmgrFilters.splice(index, 1);
          Zotero.ZotCard.Prefs.setJson('cardmgr.savefilters', cardmgrFilters);
          renders.saveFilters = cardmgrFilters;
          saveFilter.selectedLabel = '';
        }
      }

      function handleLoadSaveFilter() {
        Zotero.ZotCard.Logger.log(saveFilter);
        let cardmgrFilters = Zotero.ZotCard.Prefs.getJson('cardmgr.savefilters', []);
        let fileSaveFilter = cardmgrFilters.find((e) => e.label === saveFilter.selectedLabel);
        if (!fileSaveFilter) {
          Zotero.ZotCard.Messages.warning(window, _l10n.formatValueSync('zotcard-card-manager-filter-save-notexist', {title: saveFilter.selectedLabel}));
          return;
        }

        let parentIDs = fileSaveFilter.parentIDs.map((e) => {
          let splits = e.split('-');
          if (splits.length === 2) {
            let type = splits[0], id = splits[1];
            switch (type) {
              case Zotero.ZotCard.Consts.cardManagerType.library:
                return ['library-' + library.id];
              case Zotero.ZotCard.Consts.cardManagerType.collection:
                return Zotero.ZotCard.Collections.links(id).map(e => {
                  return e.type + '-' + e.dataObject.id
                });
              case Zotero.ZotCard.Consts.cardManagerType.search:
                return Zotero.ZotCard.Searches.links(id).map(e => {
                  return e.type + '-' + e.dataObject.id
                });
              case Zotero.ZotCard.Consts.cardManagerType.item:
                return Zotero.ZotCard.Items.links(id).map(e => {
                  return e.type + '-' + e.dataObject.id
                });
              case Zotero.ZotCard.Consts.cardManagerType.note:
                return  Zotero.ZotCard.Notes.links(element.id).map(e => {
                  return e.type + '-' + e.dataObject.id
                })
            }
          }
        });
        Zotero.ZotCard.Logger.log(parentIDs);

        filters.parentIDs = parentIDs;
        filters.match = fileSaveFilter.match;
        filters.mode = fileSaveFilter.mode;
        filters.dates = fileSaveFilter.dates;
        filters.cardtypes = fileSaveFilter.cardtypes;
        filters.tags = fileSaveFilter.tags;
        filters.title = fileSaveFilter.title;
        filters.content = fileSaveFilter.content;
        filters.orderby = fileSaveFilter.orderby;
        filters.desc = fileSaveFilter.desc;

        Zotero.ZotCard.Logger.log(filters);
        
        _filter();
      }

      function handleSaveFilterChange () {
        Zotero.ZotCard.Logger.log(saveFilter);
        let cardmgrFilters = Zotero.ZotCard.Prefs.getJson('cardmgr.savefilters', []);
        let currentSaveFilter = cardmgrFilters.find((e) => e.label === saveFilter.selectedLabel);
        if (currentSaveFilter) {
          saveFilter.selectedTime = currentSaveFilter.time;
        }
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
      }

      _init();

      return {
        ZotCardConsts,
        cards,
        scrollCards,
        profiles,
        renders,
        filters,
        saveFilter,
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
        handleParseChange,
        handleUIChange,
        handleExcludeInput,
        handleExcludeChange,
        handleSaveFilter,
        handleDeleteFilter,
        handleLoadSaveFilter,
        handleSaveFilterChange,
        handleTools,
        handleTitle,
        handleCardTools
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

