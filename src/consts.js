if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Consts) Zotero.ZotCard.Consts = {};

Zotero.ZotCard.Consts = Object.assign(Zotero.ZotCard.Consts, {
	defCardTypes: ['abstract', 'quotes', 'concept', 'character', 'not_commonsense', 'skill', 'structure', 'general'],

	init({ id, version, rootURI }) {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Consts inited.');
	}
});