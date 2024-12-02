const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

var notifierID;
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

  window.onload = async function () {
    const _l10n = new Localization(["card-manager.ftl", "card-replace.ftl", "zotcard.ftl"], true);

    ZotElementPlus.createElementPlusApp({
      setup() {
        const ZotCardConsts = reactive(Zotero.ZotCard.Consts);
        const cards = reactive([]);
        const renders = reactive({
          scope: 'all',
          mode: 'text',
          src_mode: 'text',
          src: '',
          target: '',
          filters: 0,
          selecteds: 0
        });
        const filters = reactive({
          parentIDs: parentIDs
        });

        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        });

        const _init = async () => {
          setTimeout(async () => {
            await _reload();
            ZotElementPlus.Console.log('inited.');
          }, 50);
        }

        const _reload = async () => {
          loading.visible = true;
          if (filters.parentIDs.length > 0) {
            await Zotero.ZotCard.Cards.load(window, () => {
              let card = {
                isSelected: false,
                isFound: false,
                note: {},
                to: {}
              };
              
              return card;
            }, cards, filters.parentIDs, {}, false);
          }
          _cards.forEach(element => {
            element.isSelected = false;
            element.isFound = false;
            cards.push(element);
          });
          loading.close();
        }

        function handleReplace() {
          cards.forEach(card => {
            if (card.isSelected) {
              let note = Zotero.Items.get(card.id);
              note.setNote(card.to.html);
              note.saveTx();

              card.note.contentHtml = card.to.contentHtml;
              card.note.contentHtml2 = card.to.contentHtml;
              card.note.titleHtml = card.to.titleHtml;
              card.note.titleHtml2 = card.to.titleHtml;
              card.note.title = card.to.title;
              card.note.title2 = card.to.title;
              card.note.html = card.to.html;
              card.note.text = card.to.text;
    
              card.to.contentHtml = undefined;
              card.to.contentHtml2 = undefined;
              card.to.titleHtml = undefined;
              card.to.titleHtml2 = undefined;
              card.to.title = undefined;
              card.to.title2 = undefined;
              card.to.html2 = undefined;
              card.to.text2 = undefined;

              card.isFound = false;
              card.isSelected = false;
            }
          });
          renders.filters = 0;
          renders.selecteds = 0;
          handleInput();
        }

        function _replace(srcHtml, targetValue) {
          if (renders.src_mode === 'regular') {
            return renders.src ? srcHtml.replace(new RegExp(renders.src, 'g'), targetValue) : srcHtml;
          } else {
            return renders.src ? srcHtml.replaceAll(renders.src, targetValue) : srcHtml;
          }
        }

        function handleChange(key) {
          renders.filters = 0;
          renders.selecteds = 0;
          cards.forEach(card => {
            card.note.contentHtml2 = card.note.contentHtml;
            card.note.titleHtml2 = card.note.titleHtml;
            card.note.title2 = card.note.title;
  
            card.to.contentHtml = undefined;
            card.to.contentHtml2 = undefined;
            card.to.titleHtml = undefined;
            card.to.titleHtml2 = undefined;
            card.to.title = undefined;
            card.to.title2 = undefined;
            card.to.html2 = undefined;
            card.to.text2 = undefined;

            switch (renders.scope) {
              case 'all':
                card.isFound = renders.src_mode === 'regular' ? new RegExp(renders.src).test(card.note.html) : card.note.html.includes(renders.src);
                if (card.isFound) {
                  card.note.html2 = _replace(card.note.html, `<span class="replace-src">${renders.src}</span>`);
                  card.note.titleHtml2 = Zotero.ZotCard.Notes.grabNoteTitleHtml(card.note.html2);
                  card.note.contentHtml2 = Zotero.ZotCard.Notes.grabNoteContentHtml(card.note.html2).replace(/data-attachment-key="(.*?)"/g, 'data-attachment-key="$1" src="zotero://attachment/library/items/$1"');

                  card.to.html = _replace(card.note.html, renders.target);
                  card.to.titleHtml = Zotero.ZotCard.Notes.grabNoteTitleHtml(card.to.html);
                  card.to.contentHtml = Zotero.ZotCard.Notes.grabNoteContentHtml(card.to.html);

                  card.to.html2 = _replace(card.note.html, `<span class="replace-target">${renders.target}</span>`);
                  card.to.titleHtml2 = Zotero.ZotCard.Notes.grabNoteTitleHtml(card.to.html2);
                  card.to.contentHtml2 = Zotero.ZotCard.Notes.grabNoteContentHtml(card.to.html2).replace(/data-attachment-key="(.*?)"/g, 'data-attachment-key="$1" src="zotero://attachment/library/items/$1"');

                  Zotero.ZotCard.Logger.trace('card', card);
                }
                break;
              case 'title':
                card.isFound = renders.src_mode === 'regular' ? new RegExp(renders.src).test(card.note.titleHtml) : card.note.titleHtml.includes(renders.src);
                if (card.isFound) {
                  let contentHtml = card.note.contentHtml;
                  card.note.titleHtml2 = _replace(card.note.titleHtml, `<span class="replace-src">${renders.src}</span>`);
                  card.note.contentHtml2 = contentHtml;
                  card.note.html2 = card.note.titleHtml2 + '\n' + contentHtml;

                  card.to.titleHtml = _replace(card.note.titleHtml, renders.target);
                  card.to.contentHtml = contentHtml;
                  card.to.html = card.to.titleHtml + '\n' + contentHtml;

                  card.to.titleHtml2 = _replace(card.note.titleHtml, `<span class="replace-target">${renders.target}</span>`);
                  card.to.contentHtml2 = contentHtml;
                  card.to.html2 = card.to.titleHtml2 + '\n' + contentHtml;
                }
                break;
              case 'content':
                card.isFound = renders.src_mode === 'regular' ? new RegExp(renders.src).test(card.note.contentHtml) : card.note.contentHtml.includes(renders.src);
                if (card.isFound) {
                  let titleHtml = card.note.titleHtml;
                  card.note.contentHtml2 = _replace(card.note.contentHtml, `<span class="replace-src">${renders.src}</span>`);
                  card.note.titleHtml2 = titleHtml;
                  card.note.html2 = titleHtml + '\n' + card.note.contentHtml2;

                  card.to.contentHtml = _replace(card.note.contentHtml, renders.target);
                  card.to.titleHtml = titleHtml;
                  card.to.html = titleHtml + '\n' + card.to.contentHtml;

                  card.to.contentHtml2 = _replace(card.note.contentHtml, `<span class="replace-target">${renders.target}</span>`);
                  card.to.titleHtml2 = titleHtml;
                  card.to.html2 = titleHtml + '\n' + card.to.contentHtml2;
                }
                break;
            
              default:
                break;
            }
            card.isSelected = card.isFound;
            if (card.isFound) {
              card.note.title = Zotero.Utilities.Item.noteToTitle(card.note.html);
              card.to.title = Zotero.Utilities.Item.noteToTitle(card.to.html);
              renders.filters++;
              renders.selecteds++;
            }
          });
        }
        
        const handleInput = ZotElementPlus.debounce((key) => {
          handleChange();
        }, 1500);
        
        function handleCardTools(key, card) {
          switch (key) {
            case 'selected':
              card.isSelected = !card.isSelected;
              renders.selecteds = cards.filter(e => e.isSelected).length;
              break;
          
            default:
              break;
          }
        }

        function l10n(key, params) {
          return params ? _l10n.formatValueSync(key, params) : _l10n.formatValueSync(key);
        }

        _init();

        return {
          ZotCardConsts,
          cards,
          renders,
          handleInput,
          handleReplace,
          handleChange,
          handleCardTools,
          l10n
        }
      }
    });
  }

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
}