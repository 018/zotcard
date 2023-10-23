if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Readers) Zotero.ZotCard.Readers = {};

Zotero.ZotCard.Readers = Object.assign(Zotero.ZotCard.Readers, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Readers inited.');
	},

  getSelectedReader() {
    return Zotero.Reader.getByTabID(Zotero.getMainWindow().Zotero_Tabs.selectedID);
  },

  getReaderSelectedText() {
    let currentReader = this.getSelectedReader();
    if (!currentReader) {
      return '';
    }
    let textareas = currentReader._iframeWindow.document.getElementsByTagName('textarea');

    for (let i = 0; i < textareas.length; i++) {
      if (textareas[i].style["z-index"] == -1 && textareas[i].style['width'] == '0px') {
        return textareas[i].value.replace(/(^\s*)|(\s*$)/g, '');
      }
    }
    return '';
  }
});