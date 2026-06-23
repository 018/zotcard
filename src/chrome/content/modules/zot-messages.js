if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Messages) Zotero.ZotCard.Messages = {};

Zotero.ZotCard.Messages = Object.assign(Zotero.ZotCard.Messages, {
	init() {
    // Zotero 8 (FF115+) 已移除 Services.jsm，Services 现为全局对象，无需导入。
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Messages inited.');
	},

  warning(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.warning'), message);
  },

  success(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.success'), message);
  },

  // 非阻塞轻提示：右上角弹出、数秒后自动消失，不需要点确认
  toast(message, headline) {
    try {
      let pw = new Zotero.ProgressWindow({ closeOnClick: true });
      pw.changeHeadline(headline || 'ZotCard');
      pw.show();
      pw.addDescription(message);
      pw.startCloseTimer(1000);
    } catch (e) {
      Zotero.ZotCard.Logger.log(e);
    }
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