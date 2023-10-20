if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Events) Zotero.ZotCard.Events = {};

Zotero.ZotCard.Events = Object.assign(Zotero.ZotCard.Events, {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,

	itemsViewOnSelect: null,
	noteEditorKeyup: null,
	refreshItemMenuPopup: null,
	refreshStandaloneMenuPopup: null,
	refreshPaneItemMenuPopup: null,

	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;

		// 注册事件
		Zotero.ZotCard.Logger.log('registerObserver item notifier.');
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Events inited.');
	},

	register({itemsViewOnSelect, noteEditorKeyup, refreshItemMenuPopup, refreshStandaloneMenuPopup, refreshPaneItemMenuPopup}) {
		this.itemsViewOnSelect = itemsViewOnSelect;
		this.noteEditorKeyup = noteEditorKeyup;
		this.refreshItemMenuPopup = refreshItemMenuPopup;
		this.refreshStandaloneMenuPopup = refreshStandaloneMenuPopup;
		this.refreshPaneItemMenuPopup = refreshPaneItemMenuPopup;
		
		var interval1 = setInterval(() => {
			if (Zotero.getMainWindow().ZoteroPane.itemsView) {
				Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.addListener(this.itemsViewOnSelect);
				Zotero.ZotCard.Logger.log('itemsViewOnSelect registered.');
				clearInterval(interval1);
			}
		}, 1000);

		Zotero.getMainWindow().document.getElementById('zotero-note-editor').addEventListener('keyup', this.noteEditorKeyup, false);
		Zotero.ZotCard.Logger.log('noteEditorKeyup registered.');
		Zotero.getMainWindow().document.getElementById('zotero-itemmenu').addEventListener('popupshowing', this.refreshItemMenuPopup, false);
		Zotero.ZotCard.Logger.log('refreshItemMenuPopup registered.');
		Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').addEventListener('popupshowing', this.refreshStandaloneMenuPopup, false);
		Zotero.ZotCard.Logger.log('refreshStandaloneMenuPopup registered.');
		Zotero.getMainWindow().document.getElementById('context-pane-add-child-note-button-popup').addEventListener('popupshowing', this.refreshPaneItemMenuPopup, false);
		Zotero.ZotCard.Logger.log('refreshPaneItemMenuPopup registered.');

		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Events registered.');
	},

	shutdown() {
		if (this.itemsViewOnSelect) {
			Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.removeListener(this.itemsViewOnSelect);
			Zotero.ZotCard.Logger.log('noteEditorKeyup removed.');
		}
		if (this.noteEditorKeyup) {
			Zotero.getMainWindow().document.getElementById('zotero-note-editor').removeEventListener('keyup', this.noteEditorKeyup, false);
			Zotero.ZotCard.Logger.log('noteEditorOnKeyup removed.');
		}
		if (this.refreshItemMenuPopup) {
			Zotero.getMainWindow().document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', this.refreshItemMenuPopup, false);
			Zotero.ZotCard.Logger.log('refreshItemMenuPopup removed.');
		}
		if (this.refreshStandaloneMenuPopup) {
			Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').removeEventListener('popupshowing', this.refreshStandaloneMenuPopup, false);
			Zotero.ZotCard.Logger.log('refreshStandaloneMenuPopup removed.');
		}
		if (this.refreshPaneItemMenuPopup) {
			Zotero.getMainWindow().document.getElementById('context-pane-add-child-note-button-popup').removeEventListener('popupshowing', this.refreshPaneItemMenuPopup, false);
			Zotero.ZotCard.Logger.log('refreshPaneItemMenuPopup removed.');
		}
	}
});