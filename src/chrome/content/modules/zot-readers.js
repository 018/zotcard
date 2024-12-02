if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Readers) Zotero.ZotCard.Readers = {};

Zotero.ZotCard.Readers = Object.assign(Zotero.ZotCard.Readers, {
  selectedText: '',

	init({ id, version, rootURI }) {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Readers inited.');

    Zotero.Reader.registerEventListener(
      "renderTextSelectionPopup",
      (event) => {
        const { reader, doc, params, append } = event;
        this.selectedText = params.annotation.text.trim();
      },
      id,
    );
	},

  getSelectedReader() {
    return Zotero.Reader.getByTabID(Zotero.getMainWindow().Zotero_Tabs.selectedID);
  },

  getReaderSelectedText() {
    // let currentReader = this.getSelectedReader();
    // if (!currentReader) {
    //   return '';
    // }
    // let textareas = currentReader._iframeWindow.document.getElementsByTagName('textarea');

    // for (let i = 0; i < textareas.length; i++) {
    //   if (textareas[i].style["z-index"] == -1 && textareas[i].style['width'] == '0px') {
    //     return textareas[i].value.replace(/(^\s*)|(\s*$)/g, '');
    //   }
    // }
    // return '';

    return this.selectedText;
  }
});