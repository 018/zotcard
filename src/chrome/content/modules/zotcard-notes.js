if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Notes) Zotero.ZotCard.Notes = {};

Zotero.ZotCard.Notes = Object.assign(Zotero.ZotCard.Notes, {
  getNoteBGColor() {
    let val = Zotero.Prefs.get('note.css');
    if (val) {
      let match = val.match(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/);
      if (match) {
        return match[1];
      }
    }
    return ''
  },

  // .primary-editor { background-color: #0F0 } .primary-editor p { line-height: 20; }
  noteBGColor(color) {
    let val = Zotero.Prefs.get('note.css');
    val = val.replace(/body +{ background-color: (#[0-9A-Fa-f]{6}); }/g, '');
    if (val) {
      if (color) {
        if (val.match(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/)) {
          val = val.replace(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/g, `.primary-editor { background-color: ${color}; }`);
        } else {
          val += ` .primary-editor { background-color: ${color}; }`;
        }
      } else {
        val = val.replace(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/g, '');
      }
    } else {
      if (color) {
        val = `.primary-editor { background-color: ${color}; }`;
      }
    }
    Zotero.Prefs.set('note.css', val);
  },

  htmlToText(html) {
    // var nsIFC = Components.classes['@mozilla.org/widget/htmlformatconverter;1'].createInstance(Components.interfaces.nsIFormatConverter);
    // var from = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    // from.data = html;
    // var to = { value: null };
    // try {
    //   nsIFC.convert('text/html', from, from.toString().length, 'text/unicode', to, {});
    //   to = to.value.QueryInterface(Components.interfaces.nsISupportsString);
    //   return to.toString();
    // } catch (e) {
    //   return html;
    // }


    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent;
  },

  statistics(html) {
    let content = this.htmlToText(html);
    let mcnword1 = content.match(/[\u4E00-\u9FA5]/g);
    let mcnword2 = content.match(/[\u9FA6-\u9FEF]/g);
    let men_word = content.match(/[a-z|A-Z]+/g);
    let mnum_word = content.match(/[0-9]+/g);
    let mlines = content.match(/\n/g);
    let en_words = men_word ? men_word.length : 0;
    let cn_words = (mcnword1 ? mcnword1.length : 0) + (mcnword2 ? mcnword2.length : 0);
    let num_words = mnum_word ? mnum_word.length : 0;
    let lines = mlines ? (mlines.length + 1) : (content.length > 0 ? 1 : 0);
    let length = content.length;
    let sizes = html.length;
    return {en_words, cn_words, num_words, length, lines, sizes};
  }
});