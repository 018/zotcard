'use strict'
if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Prefs) Zotero.ZotCard.Prefs = {};

Zotero.ZotCard.Prefs = Object.assign(Zotero.ZotCard.Prefs, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Prefs inited.');
	},

	get(pref, def) {
		let val = Zotero.Prefs.get(`${Zotero.ZotCard.Selfs.name}.${pref}`);
		// Zotero.ZotCard.Logger.log(`${pref} = ${val} `);
		return val !== undefined ? val : def;
	},

	set(pref, val) {
		if (val) {
			Zotero.Prefs.set(`${Zotero.ZotCard.Selfs.name}.${pref}`, val);
		} else {
			this.clear(pref);
		}
	},

	clear(pref) {
		Zotero.Prefs.clear(`${Zotero.ZotCard.Selfs.name}.${pref}`);
	},

	getJson(pref, def) {
		let val = Zotero.Prefs.get(`${Zotero.ZotCard.Selfs.name}.${pref}`);
		try {
			return val !== undefined ? JSON.parse(val) : def;
		} catch(e) {
			Zotero.ZotCard.Logger.log(e);
			return def;
		}
	},

	getJsonValue(pref, key, def) {
		let json = this.getJson(pref);
		return json !== undefined && json[key] ? json[key] : def;
	},

	setJson(pref, val) {
		if (val) {
			Zotero.Prefs.set(`${Zotero.ZotCard.Selfs.name}.${pref}`, JSON.stringify(val));
		} else {
			this.clear(pref);
		}
	},

	setJsonValue(pref, key, val) {
		let json = this.getJson(pref);
		if (!json) {
			json = {};
		}
		if (val) {
			json[key] = val;
		} else {
			delete json[key];
		}
		this.setJson(pref, json);
	},
});