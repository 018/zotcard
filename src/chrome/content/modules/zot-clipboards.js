if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Clipboards) Zotero.ZotCard.Clipboards = {};

Zotero.ZotCard.Clipboards = Object.assign(Zotero.ZotCard.Clipboards, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Clipboards inited.');
	},

  copyHtmlToClipboard(textHtml) {
    var htmlstring = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    if (!htmlstring) {
      Zotero.ZotCard.Logger.log('htmlstring is null.');
      return false;
    }
    htmlstring.data = textHtml;

    var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    if (!trans) {
      Zotero.ZotCard.Logger.log('trans is null.');
      return false;
    }

    trans.addDataFlavor('text/html');
    trans.setTransferData('text/html', htmlstring, textHtml.length * 2);

    var clipboard = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard);
    if (!clipboard) {
      Zotero.ZotCard.Logger.log('clipboard is null.');
      return false;
    }

    clipboard.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
    return true;
  },

  copyHtmlTextToClipboard(textHtml, text) {
    text = text.replace(/\r\n/g, '\n');
    textHtml = textHtml.replace(/\r\n/g, '\n');

    // copy to clipboard
    let transferable = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    let clipboardService = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard);

    // Add Text
    let str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    str.data = text;
    transferable.addDataFlavor('text/unicode');
    transferable.setTransferData('text/unicode', str, text.length * 2);

    // Add HTML
    str = Components.classes['@mozilla.org/supports-string;1'] .createInstance(Components.interfaces.nsISupportsString);
    str.data = textHtml;
    transferable.addDataFlavor('text/html');
    transferable.setTransferData('text/html', str, textHtml.length * 2);

    clipboardService.setData(
      transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard
    )
  },

  copyTextToClipboard(text) {
    text = text.replace(/\r\n/g, '\n')
    // copy to clipboard
    let transferable = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
    let clipboardService = Components.classes['@mozilla.org/widget/clipboard;1'].getService(Components.interfaces.nsIClipboard);

    // Add Text
    let str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    str.data = text;
    transferable.addDataFlavor('text/unicode');
    transferable.setTransferData('text/unicode', str, text.length * 2);

    clipboardService.setData(
      transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard
    )
  },

  getClipboard() {
    return Zotero.Utilities.Internal.getClipboard("text/unicode");
  }
});