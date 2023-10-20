'use strict'
if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Prefs) Zotero.ZotCard.Prefs = {};

Zotero.ZotCard.Prefs = Object.assign(Zotero.ZotCard.Prefs, {
	get(key, def) {
		let val = Zotero.Prefs.get(key);
		return val !== undefined ? val : def;
	}
});