if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Events) Zotero.ZotCard.Events = {};

Zotero.ZotCard.Events = Object.assign(Zotero.ZotCard.Events, {
	itemsViewOnSelect: null,
	noteEditorKeyup: null,
	refreshItemMenuPopup: null,
	refreshCollectionMenuPopup: null,
	refreshStandaloneMenuPopup: null,
	refreshPaneItemMenuPopup: null,

	init() {
		// 注册事件
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Events inited.');
	},

	// 空值安全地绑定事件：元素不存在时只记日志、跳过，不抛异常导致整个 startup 中断。
	// Zotero 9 中部分主界面元素被改名/移除，这个守卫能让插件其余部分正常加载。
	_addListener(id, type, handler) {
		let el = Zotero.getMainWindow().document.getElementById(id);
		if (el) {
			el.addEventListener(type, handler, false);
			Zotero.ZotCard.Logger.log(`event '${type}' on #${id} registered.`);
		} else {
			Zotero.ZotCard.Logger.log(`[ZotCard] element #${id} not found, skip '${type}'.`);
		}
	},

	_removeListener(id, type, handler) {
		let el = Zotero.getMainWindow().document.getElementById(id);
		if (el) {
			el.removeEventListener(type, handler, false);
			Zotero.ZotCard.Logger.log(`event '${type}' on #${id} removed.`);
		}
	},

	register({itemsViewOnSelect, noteEditorKeyup, refreshCollectionMenuPopup, refreshItemMenuPopup, refreshStandaloneMenuPopup, refreshPaneItemMenuPopup}) {
		this.itemsViewOnSelect = itemsViewOnSelect;
		this.noteEditorKeyup = noteEditorKeyup;
		this.refreshCollectionMenuPopup = refreshCollectionMenuPopup;
		this.refreshItemMenuPopup = refreshItemMenuPopup;
		this.refreshStandaloneMenuPopup = refreshStandaloneMenuPopup;
		this.refreshPaneItemMenuPopup = refreshPaneItemMenuPopup;

		if (Zotero.getMainWindow().ZoteroPane.itemsView.waitForLoad) {
			Zotero.getMainWindow().ZoteroPane.itemsView.waitForLoad().then(function () {
				Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.addListener(this.itemsViewOnSelect);
				Zotero.ZotCard.Logger.log('itemsViewOnSelect registered.');
			}.bind(this));
		}

		this._addListener('zotero-note-editor', 'keyup', this.noteEditorKeyup);
		this._addListener('zotero-collectionmenu', 'popupshowing', this.refreshCollectionMenuPopup);
		this._addListener('zotero-itemmenu', 'popupshowing', this.refreshItemMenuPopup);
		this._addListener('zotero-tb-note-add', 'popupshowing', this.refreshStandaloneMenuPopup);
		// Zotero 9：笔记面板的“新建子笔记”弹出菜单由 id 改为 class，且惰性创建、可能多实例。
		// 改用 document 级事件委托：捕获 popupshowing，按 class 过滤后刷新菜单。
		this._panePopupDelegate = (event) => {
			let t = event.target;
			if (t && t.classList && t.classList.contains('context-pane-add-child-note-button-popup')) {
				this.refreshPaneItemMenuPopup(event);
			}
		};
		Zotero.getMainWindow().document.addEventListener('popupshowing', this._panePopupDelegate, true);

		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Events registered.');
	},

	shutdown() {
		if (this.itemsViewOnSelect) {
			Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.removeListener(this.itemsViewOnSelect);
			Zotero.ZotCard.Logger.log('itemsViewOnSelect removed.');
		}
		if (this.noteEditorKeyup) {
			this._removeListener('zotero-note-editor', 'keyup', this.noteEditorKeyup);
		}
		if (this.refreshCollectionMenuPopup) {
			this._removeListener('zotero-collectionmenu', 'popupshowing', this.refreshCollectionMenuPopup);
		}
		if (this.refreshItemMenuPopup) {
			this._removeListener('zotero-itemmenu', 'popupshowing', this.refreshItemMenuPopup);
		}
		if (this.refreshStandaloneMenuPopup) {
			this._removeListener('zotero-tb-note-add', 'popupshowing', this.refreshStandaloneMenuPopup);
		}
		if (this._panePopupDelegate) {
			Zotero.getMainWindow().document.removeEventListener('popupshowing', this._panePopupDelegate, true);
		}
	}
});