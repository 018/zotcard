if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Selfs) Zotero.ZotCard.Selfs = {};

Zotero.ZotCard.Selfs = Object.assign(Zotero.ZotCard.Selfs, {
	id: null,
  	name: null,
	version: null,
	rootURI: null,

	init({ id, version, rootURI }) {
		this.id = id;
		this.name = id.replace('@zotero.org', '');
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},
});