if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Consts) Zotero.ZotCard.Consts = {};

Zotero.ZotCard.Consts = Object.assign(Zotero.ZotCard.Consts, {
	defCardTypes: ['abstract', 'quotes', 'concept', 'character', 'not_commonsense', 'skill', 'structure', 'general'],
	card_quantity: 3,
	startOfWeek: 0,
	recently_move_collection_quantity: 5,
	enable_word_count: true,
	note_background_color: '',

	init({ id, version, rootURI }) {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Consts inited.');
	}
});