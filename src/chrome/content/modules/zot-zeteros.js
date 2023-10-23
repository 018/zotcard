if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Zoteros) Zotero.ZotCard.Zoteros = {};

Zotero.ZotCard.Zoteros = Object.assign(Zotero.ZotCard.Zoteros, {
	mainTabID: 'zotero-pane',

	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Zoteros inited.');
	}
});