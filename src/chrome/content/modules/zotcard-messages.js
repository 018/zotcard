if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Messages) Zotero.ZotCard.Messages = {};

Zotero.ZotCard.Messages = Object.assign(Zotero.ZotCard.Messages, {
  warning(message) {
    Zotero.alert(null, Zotero.getString('general.warning'), message)
  },

  success(message) {
    Zotero.alert(null, Zotero.getString('general.success'), message)
  },

  error(message) {
    Zotero.alert(null, Zotero.getString('general.error'), message)
  },

  confirm(message) {
    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    return ps.confirm(null, Zotero.getString('general.warning'), message)
  }
});