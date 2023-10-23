'use strict'
if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Prefs) Zotero.ZotCard.Prefs = {};

Zotero.ZotCard.Prefs = Object.assign(Zotero.ZotCard.Prefs, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Prefs inited.');
	},

	get(pref, def) {
		let val = Zotero.Prefs.get(`${Zotero.ZotCard.Selfs.name}.${pref}`);
		return val !== undefined ? val : def;
	},

	set(pref, val) {
		Zotero.Prefs.set(`${Zotero.ZotCard.Selfs.name}.${pref}`, val);
	}
});