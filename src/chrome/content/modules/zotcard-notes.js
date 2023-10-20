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
  }
});