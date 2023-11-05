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
	},

	clear(pref) {
		Zotero.Prefs.clear(`${Zotero.ZotCard.Selfs.name}.${pref}`);
	},

	getJson(pref, def) {
		let val = Zotero.Prefs.get(`${Zotero.ZotCard.Selfs.name}.${pref}`);
		return val !== undefined ? JSON.parse(val) : def;
	},

	setJson(pref, val) {
		Zotero.Prefs.set(`${Zotero.ZotCard.Selfs.name}.${pref}`, JSON.stringify(val));
	},
});