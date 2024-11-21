if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Messages) Zotero.ZotCard.Messages = {};

Zotero.ZotCard.Messages = Object.assign(Zotero.ZotCard.Messages, {
	init() {
    Components.utils.import("resource://gre/modules/Services.jsm");
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Messages inited.');
	},

  warning(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.warning'), message);
  },

  success(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.success'), message);
  },

  error(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.error'), message);
  },

  confirm(window, message) {
    // var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    // return ps.confirm(window || Zotero.getMainWindow(), Zotero.getString('general.warning'), message);
    var ps = Services.prompt;
		var buttonFlags = (ps.BUTTON_POS_0) * (ps.BUTTON_TITLE_IS_STRING)
			+ (ps.BUTTON_POS_1) * (ps.BUTTON_TITLE_CANCEL);
		
		var index = ps.confirmEx(window || Zotero.getMainWindow(),
			Zotero.getString('general.warning'),
			message,
			buttonFlags,
			Zotero.ZotCard.L10ns.getString('zotcard-ok'),
			Zotero.ZotCard.L10ns.getString('zotcard-cancel'), null, null, {});
		
    return index == 0;
  }
});