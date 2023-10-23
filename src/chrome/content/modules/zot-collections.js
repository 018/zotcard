if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Collections) Zotero.ZotCard.Collections = {};

Zotero.ZotCard.Collections = Object.assign(Zotero.ZotCard.Collections, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Readers inited.');
	},

  isUserLibraryCollection(key) {
    return Zotero.Collections.getIDFromLibraryAndKey(Zotero.Libraries.userLibraryID, key);
  },
  
  getZoteroCollectionUrl(key) {
    if (this.isUserLibraryCollection(key)) {
      return `zotero://select/library/collections/${key}`
    } else {
      var groupID = this.getGroupIDByKey(key)
      
      return `zotero://select/groups/${groupID}/collections/${key}`
    }
  },
  
  showPath(collectionID) {
    let collectionNames = []
    collectionNames.push(Zotero.Collections.get(collectionID).name)
    let parentID = collectionID
    let lastCollection = Zotero.Collections.get(collectionID)
    while ((parentID = Zotero.Collections.get(parentID).parentID)) {
      collectionNames.push(Zotero.Collections.get(parentID).name)
      lastCollection = Zotero.Collections.get(parentID)
    }
    collectionNames.push(Zotero.Libraries.get(lastCollection.libraryID).name)
    return collectionNames.reverse().join(' ▸ ')
  }
});