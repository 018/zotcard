if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Consts) Zotero.ZotCard.Consts = {};

Zotero.ZotCard.Consts = Object.assign(Zotero.ZotCard.Consts, {
	defCardTypes: ['abstract', 'quotes', 'concept', 'character', 'not_commonsense', 'skill', 'structure', 'general'],
	card_quantity: 3,
	// startOfWeek: 0,
	// recently_move_collection_quantity: 5,
	// enable_word_count: true,
	// note_background_color: '',
	
	startOfWeek: {
		sunday: 0,
		monday: 1
	},

	wordCountStyle: {
		all: 1,
		onlyWords: 2
	},

	cardManagerType: {
		library: 'library',
		collection: 'collection',
		search: 'search',
		item: 'item',
		note: 'note'
	},

	tagType: {
		zotero: 1,
		custom: 2
	},

	modeProps: {
		all: 1,
		only_show: 2,
		only_hide: 3,
		only_expand: 4,
		only_collapse: 5,
		only_selected: 6,
	},
	
	matchProps: {
		all: 1,
		any: 2,
	},

	init({ id, version, rootURI }) {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Consts inited.');
	}
});