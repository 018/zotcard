if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Groups) Zotero.ZotCard.Groups = {};

Zotero.ZotCard.Groups = Object.assign(Zotero.ZotCard.Groups, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Groups inited.');
	},

  getZoteroItemUrl(key) {
    var groupID = this.getGroupIDByKey(key);
    return `zotero://select/groups/${groupID}/items/${key}`;
  },

  getGroupIDByKey(key) {
    var groups = Zotero.Groups.getAll()
    var groupID
    for (let index = 0; index < groups.length; index++) {
      const element = groups[index];
      if (Zotero.Items.getIDFromLibraryAndKey(element.libraryID, key)) {
        groupID = element.id
        break
      }
    }

    return groupID
  },
  
});