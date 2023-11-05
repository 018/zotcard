if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Items) Zotero.ZotCard.Items = {};

Zotero.ZotCard.Items = Object.assign(Zotero.ZotCard.Items, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Items inited.');
	},

  isUserLibraryItem(key) {
    return Zotero.Items.getIDFromLibraryAndKey(Zotero.Libraries.userLibraryID, key);
  },

  getZoteroUrl(key) {
    return `zotero://select/library/items/${key}`;
  },

  links(itemID) {
    let links = [];
    let item = Zotero.Items.get(itemID);
    if (item.getCollections().length === 0) {
        links.push({type: 'library', dataObject: Zotero.Libraries.get(item.libraryID)});
    } else {
        let collectionID = item.getCollections()[0];
        links.push(...Zotero.ZotCard.Collections.links(collectionID));
    }
    links.push({type: item.isRegularItem() ? 'item' : item.itemType, dataObject: item});
    return links;
  },

  // selectedItemsLinks(itemID) {
  //   let item = Zotero.Items.get(itemID);
	// 	let libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
	// 	let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
	// 	let search = Zotero.getMainWindow().ZoteroPane.getSelectedSavedSearch();

  //   let links = [];
	// 	if (collection) {
  //     links.push(...Zotero.ZotCard.Collections.links(collection.id));
	// 	} else if(search) {
  //     links.push({type: 'library', ...Zotero.Libraries.get(libraryID)});
  //     links.push({type: 'search', ...search});
  //     links.push({type: 'item', ...item});
	// 	} else {
  //     links.push({type: 'library', ...Zotero.Libraries.get(libraryID)});
  //     links.push({type: 'item', ...item});
	// 	}
    
  //   return links;
  // },

  getSelectedItems(itemType) {
    var zitems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
    if (!zitems.length) {
      return ;
    }
  
    if (itemType) {
      if (!Array.isArray(itemType)) {
        itemType = [itemType];
      }
      var siftedItems = this._siftItems(zitems, itemType);
      return siftedItems.matched;
    } else {
      return zitems;
    }
  },

  selectItem(collectionID, itemID) {
    Zotero.ZotCard.Collections.selectCollection(collectionID).then(() => {
      Zotero.getMainWindow().ZoteroPane.selectItem(itemID);
    });
  },

  selectItemFromLibraryAndKey(libraryID, collectionKey, key) {
    let item = Zotero.Items.getIDFromLibraryAndKey(libraryID, key);
    Zotero.ZotCard.Collections.selectCollectionFromLibraryAndKey(libraryID, collectionKey).then(() => {
      Zotero.getMainWindow().ZoteroPane.selectItem(item.id);
    });
  },
  
  getSelectedItemTypes() {
    var zitems = Zotero.getMainWindow().ZoteroPane.getSelectedItems()
    if (!zitems.length) {
      return false
    }
  
    itemTypes = []
    zitems.forEach(zitem => {
      let itemType
      if (zitem.isRegularItem()) {
        itemType = 'regular'
      } else {
        itemType = Zotero.ItemTypes.getName(zitem.itemTypeID)
      }
      if (!itemTypes.includes(itemType)) {
        itemTypes.push(itemType)
      }
    })
    return itemTypes
  },
  
  checkItemType(itemObj, itemTypeArray) {
    var matchBool = false
  
    for (var idx = 0; idx < itemTypeArray.length; idx++) {
      switch (itemTypeArray[idx]) {
        case 'attachment':
          matchBool = itemObj.isAttachment()
          break
        case 'note':
          matchBool = itemObj.isNote()
          break
        case 'regular':
          matchBool = itemObj.isRegularItem()
          break
        default:
          matchBool = Zotero.ItemTypes.getName(itemObj.itemTypeID) === itemTypeArray[idx]
      }
  
      if (matchBool) {
        break
      }
    }
  
    return matchBool
  },
  
  _siftItems(itemArray, itemTypeArray) {
    var matchedItems = []
    var unmatchedItems = []
    while (itemArray.length > 0) {
      if (this.checkItemType(itemArray[0], itemTypeArray)) {
        matchedItems.push(itemArray.shift())
      } else {
        unmatchedItems.push(itemArray.shift())
      }
    }
  
    return {
      matched: matchedItems,
      unmatched: unmatchedItems
    }
  }
});