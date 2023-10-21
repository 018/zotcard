if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Items) Zotero.ZotCard.Items = {};

Zotero.ZotCard.Items = Object.assign(Zotero.ZotCard.Items, {

  isUserLibraryItem(key) {
    return Zotero.Items.getIDFromLibraryAndKey(Zotero.Libraries.userLibraryID, key);
  },

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
  
  getZoteroItemUrl(key) {
    if (this.isUserLibraryItem(key)) {
      return `zotero://select/library/items/${key}`
    } else {
      var groupID = this.getGroupIDByKey(key)
      
      return `zotero://select/groups/${groupID}/items/${key}`
    }
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