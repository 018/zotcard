if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Searches) Zotero.ZotCard.Searches = {};

Zotero.ZotCard.Searches = Object.assign(Zotero.ZotCard.Searches, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Searches inited.');
	},
  
  links(searchID) {
    let links = [];
    let search = Zotero.Searches.get(searchID);
    if (search) {
      links.push({type: 'library', dataObject: Zotero.Libraries.get(search.libraryID)});
      links.push({type: 'search', dataObject: search});
      return links;
    } else {
      return false;
    }
  }
});