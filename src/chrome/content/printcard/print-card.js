const { createApp, ref, reactive, toRaw } = Vue
const { ElMessageBox } = ElementPlus
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

var dataIn;
let ids = Zotero.ZotCard.Utils.getUrlParam(window.location.href, 'ids');
if (ids) {
  dataIn = ids.split(',');
}

Zotero.ZotCard.Logger.log(dataIn);
if (!ZotElementPlus.isZoteroDev && Zotero.ZotCard.Objects.isEmptyArray(dataIn)) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter is incorrect.');
} else {
  function _clearShadowAndBorder(html) {
    let newNote = html;
    let match1 = html.match(/^<div.*style=.*box-shadow:.*?>/g);
    let match2 = html.match(/^<div.*style=.*border-radius:.*?>/g);
    if (match1 && match2 && match1[0] === match2[0]) {
      newNote = html.replace(match1[0], match1[0].replace(/style=".*?"/g, ''));
    }
    return newNote;
  }

  const _cards = [];
  if (ZotElementPlus.isZoteroDev) {
    _cards.push({
      id: 1,
      note: {
        title: '## 摘要卡 - <span>&lt;标题&gt;</span>',
        html: '',
        contentHtml: `<p><strong>摘要</strong>：<span>&lt;原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子原文句子&gt;</span></p><p><strong>出处</strong>：<a onclick="Zotero.launchURL(event.target.src)" href="zotero://select/library/collections/LB2VWSSB">0. Test</a></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：2023-11-03</p>`
      }
    });
    _cards.push({
      id: 2,
      note: {
        title: '## 摘要卡 - <span>&lt;标题&gt;</span>',
        html: '',
        contentHtml: `<p><strong>摘要</strong>：<span>&lt;原文句子&gt;</span></p><p><strong>出处</strong>：<a onclick="Zotero.launchURL(event.target.src)" href="zotero://select/library/collections/LB2VWSSB">0. Test</a></p><p><strong>标签</strong>：[无]</p><p><strong>日期</strong>：2023-11-03</p>`
      }
    });
  } else {
    dataIn.forEach(id => {
      let item = Zotero.Items.get(id);
      let card = {
        id: id,
        note: {},
        noteLoaded: false
      };
      Zotero.ZotCard.Cards.loadCardNote(card, item);

      card.note.contentHtml = _clearShadowAndBorder(card.note.contentHtml);
  
      _cards.push(card);
    });
  }

  window.onload = function () {
    const _l10n = ZotElementPlus.isZoteroDev ? undefined : new Localization(["print-card.ftl", "zotcard.ftl"], true);

    ZotElementPlus.createElementPlusApp({
      setup() {
        let def = {
          titleFontSize: 14,
          titleLineSpacing: 12,
          fontSize: 12,
          lineSpacing: 12,
          paragraphSpacing: 5
        };
        let printcard = ZotElementPlus.isZoteroDev ? def : Zotero.ZotCard.Prefs.getJson('printcard', def);

        const profiles = reactive({
          titleFontSize: printcard.titleFontSize,
          titleLineSpacing: printcard.titleLineSpacing,
          fontSize: printcard.fontSize,
          lineSpacing: printcard.lineSpacing,
          paragraphSpacing: printcard.paragraphSpacing
        });
        const cards = reactive(_cards);

        const _init = () => {
          handleChange('paragraphSpacing');
          ZotElementPlus.isZoteroDev || Zotero.ZotCard.Logger.log('inited.');
        }

        async function handlePrint() {
          // window.print();

          let win = Zotero.getMainWindow();
          if (win) {
            let { PrintUtils } = win;
            let settings = PrintUtils.getPrintSettings("", false);
            let doPrint = await PrintUtils.handleSystemPrintDialog(
              window.browsingContext.topChromeWindow, false, settings
            );
            if (doPrint) {
              window.browsingContext.print(settings);
              // An ugly hack to close the browser window that has a static clone
              // of the content that is being printed. Without this, the window
              // will be open while transferring the content into system print queue,
              // which can take time for large PDF files
              let win = Services.wm.getMostRecentWindow("navigator:browser");
              if (win?.document?.getElementById('statuspanel')) {
                win.close();
              }
            }
          }
          // Zotero.getMainWindow().PrintUtils.startPrintWindow(window.browsingContext);
        }

        function handleChange(field) {
          switch (field) {
            case 'titleFontSize':
              
              break;
            case 'titleLineSpacing':
              
              break;
            case 'fontSize':
              
              break;
            case 'lineSpacing':
              
              break;
            case 'paragraphSpacing':
              document.querySelectorAll('#cards p').forEach(e => e.style.margin = profiles.paragraphSpacing + 'px 0');
              break;
          }

          ZotElementPlus.isZoteroDev || Zotero.ZotCard.Prefs.setJson('printcard', {
            titleFontSize: profiles.titleFontSize,
            titleLineSpacing: profiles.titleLineSpacing,
            fontSize: profiles.fontSize,
            lineSpacing: profiles.lineSpacing,
            paragraphSpacing: profiles.paragraphSpacing
          });
        }

        _init();

        return {
          profiles,
          cards,
          handlePrint,
          handleChange
        }
      }
    });
  };
}

