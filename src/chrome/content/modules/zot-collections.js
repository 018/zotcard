if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Collections) Zotero.ZotCard.Collections = {};

Zotero.ZotCard.Collections = Object.assign(Zotero.ZotCard.Collections, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Collections inited.');
	},

  isUserLibraryCollection(key) {
    return Zotero.Collections.getIDFromLibraryAndKey(Zotero.Libraries.userLibraryID, key);
  },

  getZoteroUrl(key) {
    return `zotero://select/library/collections/${key}`;
  },

  selectCollection(collectionID) {
    return Zotero.getMainWindow().ZoteroPane.collectionsView.selectCollection(collectionID);
  },

  selectCollectionFromLibraryAndKey(libraryID, key) {
    let collection = Zotero.Collections.getIDFromLibraryAndKey(libraryID, key);
    if (collection) {
      return Zotero.getMainWindow().ZoteroPane.collectionsView.selectCollection(collection.id);
    }
  },

  links(collectionID) {
    let links = [];
    links.push({type: 'collection', dataObject: Zotero.Collections.get(collectionID)});
    let parentID = collectionID;
    let lastCollection;
    while ((lastCollection = Zotero.Collections.get(parentID)) && (parentID = lastCollection.parentID)) {
      links.push({type: 'collection', dataObject: Zotero.Collections.get(parentID)});
    }
    links.push({type: 'library', dataObject: {id: lastCollection.libraryID, ...Zotero.Libraries.get(lastCollection.libraryID)}});
    return links.reverse();
  },
  
  showPath(collectionID) {
    let collectionNames = [];
    collectionNames.push(Zotero.Collections.get(collectionID).name);
    let parentID = collectionID;
    let lastCollection = Zotero.Collections.get(collectionID);
    while ((parentID = Zotero.Collections.get(parentID).parentID)) {
      collectionNames.push(Zotero.Collections.get(parentID).name);
      lastCollection = Zotero.Collections.get(parentID);
    }
    collectionNames.push(Zotero.Libraries.get(lastCollection.libraryID).name);
    return collectionNames.reverse().join(' ▸ ');
  }
});