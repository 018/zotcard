if (!window.Zotero) window.Zotero = {}
if (!window.Zotero.ZotCard) window.Zotero.ZotCard = {}
if (!window.Zotero.ZotCard.CardSearcher) window.Zotero.ZotCard.CardSearcher = {}

window.Zotero.ZotCard.CardSearcher.search = function (libraryID, selectedCollection, selectedSavedSearch, callback) {
  var search = new Zotero.Search()
  search.libraryID = libraryID
  if (selectedCollection) {
    search.addCondition('note', 'contains', '')
    search.addCondition('itemType', 'is', 'note')
    search.addCondition('collection', 'is', selectedCollection.key)
    search.addCondition('includeParentsAndChildren', 'true', null)
    search.addCondition('recursive', 'true', null)
    search.search().then((ids) => callback(ids, selectedCollection.name))
  } else if (selectedSavedSearch) {
    search.addCondition('note', 'contains', '')
    search.addCondition('itemType', 'is', 'note')
    search.addCondition('savedSearch', 'is', selectedSavedSearch.key)
    search.search().then((ids) => callback(ids, selectedSavedSearch.name))
  } else {
    let lib = Zotero.Libraries.get(search.libraryID)
    search.addCondition('note', 'contains', '')
    search.addCondition('itemType', 'is', 'note')
    search.addCondition('includeParentsAndChildren', 'true', null)
    search.addCondition('recursive', 'true', null)
    search.search().then((ids) => callback(ids, lib.name))
  }
}
