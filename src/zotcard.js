if (!Zotero.ZotCard) Zotero.ZotCard = {};

Zotero.ZotCard = Object.assign(Zotero.ZotCard, {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],
	addedWordElementIDs: [],
	_notifierID: 0,

	// ####### init #######
	
	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;

		// Add a stylesheet to the main Zotero pane
		let link1 = Zotero.getMainWindow().document.createElement('link');
		link1.id = 'zotcard-stylesheet';
		link1.type = 'text/css';
		link1.rel = 'stylesheet';
		link1.href = this.rootURI + `style-${Zotero.isMac ? 'mac' : 'win'}.css`;
		Zotero.getMainWindow().document.documentElement.appendChild(link1);
		this.storeAddedElement(link1);

		// Use Fluent for localization
		Zotero.getMainWindow().MozXULElement.insertFTLIfNeeded("zotcard.ftl");

		Zotero.ZotCard.Cards.initPrefs();

		this.createToolbarButton();
		this.createStandaloneMenu();
		this.registerEvent();

		Zotero.ZotCard.Prefs.clear('config.read.card-width');
		Zotero.ZotCard.Prefs.clear('config.read.card-height');
		Zotero.ZotCard.Prefs.clear('config.read.fit-height');
		Zotero.ZotCard.Prefs.clear('config.read.orderby');
		Zotero.ZotCard.Prefs.clear('config.read.orderbydesc');
		Zotero.ZotCard.Prefs.clear('config.read.desc');
		Zotero.ZotCard.Prefs.clear('config.read.highlight');
		Zotero.ZotCard.Prefs.clear('config.read.height_edt');
		Zotero.ZotCard.Prefs.clear('config.read.column_edt');
		Zotero.ZotCard.Prefs.clear('config.column_edt');
		Zotero.ZotCard.Prefs.clear('config.height_edt');
		Zotero.ZotCard.Prefs.clear('config.print');

		let val = Zotero.ZotCard.Prefs.get('config.recently_move_collection_quantity');
		if (val) {
			Zotero.ZotCard.Prefs.set('movemgr.recently_move_collection_quantity', val);
		}
		Zotero.ZotCard.Prefs.clear('config.recently_move_collection_quantity');
		val = Zotero.ZotCard.Prefs.get('config.recently_move_collections');
		if (val) {
			Zotero.ZotCard.Prefs.setJson('movemgr.recently_move_collections', val);
		}
		Zotero.ZotCard.Prefs.clear('config.recently_move_collections');
		val = Zotero.ZotCard.Prefs.get('config.tinify_api_key');
		if (val) {
			Zotero.ZotCard.Prefs.set('imagemgr.tinify_api_key', val);
		}
		Zotero.ZotCard.Prefs.clear('config.tinify_api_key');
		Zotero.ZotCard.Prefs.clear('config.compress_with_width_and_height');
		
		Zotero.ZotCard.Logger.log('Zotero.ZotCard inited.');
	},

	createNoteToolbar() {
		let editor_view_middle = Zotero.getMainWindow().document.getElementById('editor-view').contentDocument.querySelector('#editor-container .middle');
		Zotero.ZotCard.Logger.log(editor_view_middle);
		if (!editor_view_middle) {
			return;
		}

		let divOpenCardEditor = Zotero.getMainWindow().MozXULElement.parseXULToFragment(`<div id="zotero-card-editor" class="dropdown text-dropdown">
			<button aria-haspopup="true" aria-expanded="false" class="toolbar-button" title="源代码编辑器">
				<svg t="1700189370031" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2515" width="24" height="24">
					<path d="M224.96 653.376H158.72V223.104h618.496V288.64h94.72V128.32H64v619.776h160.96z" fill="currentColor" p-id="2516"></path>
					<path d="M251.52 318.464v560.704h704.192v-560.64H251.52z m243.392 369.28l-43.52 49.92-120-138.176 120.704-139.52 43.52 49.92-77.888 89.6 77.184 88.32z m127.872 43.52h-60.352l38.272-270.016h60.352l-38.272 269.952z m139.52 6.4l-43.52-49.92 77.248-88.96-77.824-89.536 43.456-49.92 121.344 139.52-120.704 138.88z" fill="currentColor" p-id="2517"></path>
				</svg>
			</button>
		</div>`).querySelector('div');
		divOpenCardEditor.querySelector('button').onclick = () => {
			Zotero.ZotCard.Dialogs.openCardEditor(Zotero.getMainWindow().document.getElementById('zotero-note-editor').item.id);
		}
		editor_view_middle.append(divOpenCardEditor);
		this.storeAddedElement(divOpenCardEditor);
	},
	
	createToolbarButton() {
		let root = 'zotero-collections-toolbar';
		let zotero_collections_toolbar = Zotero.getMainWindow().document.getElementById(root);

		let zotcardManager = Zotero.ZotCard.Doms.createMainWindowXULElement('toolbarbutton', {
			id: `zotero-tb-card-manager`,
			attrs: {
				'class': 'zotero-tb-button',
				'tooltiptext': Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-manager-title'),
				'tabindex': '0'
			},
			command: () => {
				let win = Zotero.ZotCard.Dialogs.findCardManager();
				if (win) {
					win.focus();
				} else {
					let cardManagerTabs = Zotero.ZotCard.Dialogs.findCardManagerTabs();
					if (Zotero.ZotCard.Objects.isNoEmptyArray(cardManagerTabs)) {
						Zotero.getMainWindow().Zotero_Tabs.select(cardManagerTabs[0].id);
					} else {
						Zotero.ZotCard.Dialogs.openCardManagerTab([]);
					}
				}
			},
			parent: zotero_collections_toolbar,
		});
    	zotcardManager.style.listStyleImage = `url(chrome://zotcard/content/images/card-manager.png)`;
		zotcardManager.style.width = 24;
		zotcardManager.style.height = 24;
		this.storeAddedElement(zotcardManager);
	},
	
	createCollectionMenu() {
		let allowTypes = ['library', 'collection', 'search', 'group'];
		let type = Zotero.getMainWindow().ZoteroPane.getCollectionTreeRow().type;
		Zotero.ZotCard.Logger.log(type);

		let root = 'zotero-collectionmenu';
		let zotero_collectionmenu = Zotero.getMainWindow().document.getElementById(root);

		let menuseparator = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			parent: zotero_collectionmenu,
		});
		this.storeAddedElement(menuseparator);
		menuseparator.hidden = !allowTypes.includes(type);

		let zotcardCardManager = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-manager`,
			command: this.collectionCardManager,
			parent: zotero_collectionmenu,
		});
		zotcardCardManager.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-manager-title'));
		this.storeAddedElement(zotcardCardManager);
		zotcardCardManager.hidden = !allowTypes.includes(type);

		let zotcardCardReport = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-report`,
			command: this.collectionCardReport,
			parent: zotero_collectionmenu,
		});
		zotcardCardReport.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-report-title'));
		this.storeAddedElement(zotcardCardReport);
		zotcardCardReport.hidden = !allowTypes.includes(type);
	},

	_createMenuItem({parent, after}, type, onlyRegular, onlySimple) {
		let id = `zotero-itemmenu-zotcard-menu-menupopup-${type}`;
		let menuitem = Zotero.getMainWindow().document.getElementById(id);
		if (!menuitem) {
			menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
				id: id,
				command: () => {
					this.newCardByItem(type);
				},
				parent: parent,
				after: after
			});
		}
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		menuitem.setAttribute('label', `${pref.card ? pref.label : '-'}`);
		menuitem.hidden = !pref.visible || !onlyRegular;
		return menuitem;
	},

	createItemMenu() {
		let items = Zotero.ZotCard.Items.getSelectedItems();
		let itemTypes = Zotero.ZotCard.Items.getSelectedItemTypes();
		let onlyNote = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'note';
		let onlyRegular = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'regular';
		var onlySimple = items && items.length === 1;
		let hasNote = itemTypes && itemTypes.includes('note');

		Zotero.ZotCard.Logger.log({onlyNote, onlyRegular, onlySimple});

		let root = 'zotero-itemmenu';
		let zotero_itemmenu = Zotero.getMainWindow().document.getElementById(root);
		let menuseparator = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			parent: zotero_itemmenu
		});
		this.storeAddedElement(menuseparator);

		// ZotCard
		let zotcardMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menu', {
			id: `${root}-zotcard-menu`,
			attrs: {
				'data-l10n-id': 'zotero-zotcard',
			},
			props: {
				'icon': 'chrome://zotcard/content/images/zotcard.png',
			},
			parent: zotero_itemmenu
		});
		this.storeAddedElement(zotcardMenu);
		zotcardMenu.disabled = true;
		// if (!items) {
		// 	zotcardMenu.disabled = true;
		// 	Zotero.ZotCard.Logger.log(`Not Select Item`);
		// } else if (items.length > 1 && !onlyRegular) {
		// 	zotcardMenu.disabled = true
		// 	Zotero.ZotCard.Logger.log(`Mutil-Select Items but not onlyNote`);
		// } else if (onlySimple && !onlyRegular) {
		// 	zotcardMenu.disabled = true;
		// 	Zotero.ZotCard.Logger.log(`Simple but not onlyRegular`);
		// }

		let mnupopupZotCard = Zotero.ZotCard.Doms.createMainWindowXULElement('menupopup', {
			id: `${root}-zotcard-menu-menupopup`,
			parent: zotcardMenu
		});

		// ZotCard > card1...
		let hasMenuitem = 0;
		Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
			let menuitem = this._createMenuItem({parent: mnupopupZotCard}, type, onlyRegular, onlySimple);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		});

		let separator1 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-menu-menupopup-separator1`,
			parent: mnupopupZotCard
		});
		separator1.hidden = hasMenuitem === 0;
		if (!separator1.hidden) {
			zotcardMenu.disabled = false;
		}

		Zotero.getMainWindow().document.querySelectorAll(`#zotero-itemmenu .custom-card`).forEach(e => {
			e.hidden = true;
		})
		hasMenuitem = 0;
		let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
		for (let index = parseInt(quantity) - 1; index >= 0; index--) {
			let menuitem = this._createMenuItem({after: separator1}, Zotero.ZotCard.Cards.customCardType(index), onlyRegular, onlySimple);
			menuitem.setAttribute('class', 'custom-card');
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		}

		// ZotCard > batch
		// batch
		let separator2 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-menu-menupopup-separator2`,
			parent: mnupopupZotCard
		});
		separator2.hidden = hasMenuitem === 0;

		menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-menu-menupopup-batch`,
			command: () => {
				let io = {};
				Zotero.getMainWindow().openDialog('chrome://zotcard/content/batchnewcard/batchnewcard.html', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io);
				if (io.dataOut && io.dataOut.length > 0) {
					var _this = this
					io.dataOut.forEach(async function (element) {
						for (let index = 0; index < element.value; index++) {
							_this.newCardByItem(element.type);
						}
					})
				}
			},
			parent: mnupopupZotCard
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotcard-newitem-batch'));
		menuitem.hidden = !onlyRegular;
		if (!menuitem.hidden) {
			zotcardMenu.disabled = false;
		}

		let separator3 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-menu-menupopup-separator3`,
			parent: mnupopupZotCard
		});
		separator3.hidden = menuitem.hidden;

		// ZotCard > copy
		// card-copy
		let cardCopyMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menu', {
			id: `${root}-zotcard-card-copy-menu`,
			props: {
				'icon': 'chrome://zotcard/content/images/zotcard.png',
			},
			parent: mnupopupZotCard
		});
		cardCopyMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-copy-title'));
		cardCopyMenu.hidden = !hasNote;
		if (!cardCopyMenu.hidden) {
			zotcardMenu.disabled = false;
		}
		let mnupopupZotCardCopy = Zotero.ZotCard.Doms.createMainWindowXULElement('menupopup', {
			id: `${root}-zotcard-card-copy-menu-menupopup`,
			parent: cardCopyMenu
		});
		// ZotCard > copy > content
		// card-copy-content
		let cardCopyContentMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-copy-content`,
			command: this.itemCardCopyContent,
			parent: mnupopupZotCardCopy
		});
		cardCopyContentMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-copy-content-title'));
		// ZotCard > copy > text
		// card-copy-text
		let cardCopyTextMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-copy-text`,
			command: this.itemCardCopyText,
			parent: mnupopupZotCardCopy
		});
		cardCopyTextMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-copy-text-title'));
		// ZotCard > copy > markdown
		// card-copy-markdown
		let cardCopyMarkdownMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-copy-markdown`,
			command: this.itemCardCopyMarkdown,
			parent: mnupopupZotCardCopy
		});
		cardCopyMarkdownMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-copy-markdown-title'));
		// ZotCard > copy > html
		// card-copy-html
		let cardCopyHtmlMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-copy-html`,
			command: this.itemCardCopyHtml,
			parent: mnupopupZotCardCopy
		});
		cardCopyHtmlMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-copy-html-title'));
		// ZotCard > copy > link
		// card-copy-link
		let cardCopyLinkMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-copy-link`,
			command: this.itemCardCopyLink,
			parent: mnupopupZotCardCopy
		});
		cardCopyLinkMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-copy-link-title'));

		// ZotCard > move
		// card-move
		let cardMoveMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menu', {
			id: `${root}-zotcard-card-move-menu`,
			props: {
				'icon': 'chrome://zotcard/content/images/zotcard.png',
			},
			parent: mnupopupZotCard
		});
		cardMoveMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-move-title'));
		cardMoveMenu.hidden = !hasNote;
		if (!cardMoveMenu.hidden) {
			zotcardMenu.disabled = false;
		}
		let mnupopupZotCardMovePopup = Zotero.ZotCard.Doms.createMainWindowXULElement('menupopup', {
			id: `${root}-zotcard-card-move-menu-popup`,
			parent: cardMoveMenu
		});

		// ZotCard > move > recently
		// recently
		let cardMoveRecentlyMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menu', {
			id: `${root}-zotcard-card-move-recently-menu`,
			parent: mnupopupZotCardMovePopup
		});
		cardMoveRecentlyMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-move-recently-title'));
		cardMoveRecentlyMenu.hidden = !hasNote;
		if (!cardMoveRecentlyMenu.hidden) {
			zotcardMenu.disabled = false;
		}
		let mnupopupZotCardMoveRecentlyPopup = Zotero.ZotCard.Doms.createMainWindowXULElement('menupopup', {
			id: `${root}-zotcard-card-move-recently-menu-popup`,
			parent: cardMoveRecentlyMenu
		});

		// ZotCard > move > -
		Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-card-move-menu-popup-separator3`,
			parent: mnupopupZotCardMovePopup
		});



		// ZotCard > replace
		// card-replace
		let cardReplaceMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-replace-menuitem`,
			command: this.itemCardReplace,
			parent: mnupopupZotCard
		});
		cardReplaceMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-replace-title'));
		cardReplaceMenu.hidden = !hasNote;
		if (!cardReplaceMenu.hidden) {
			zotcardMenu.disabled = false;
		}

		// ZotCard > print
		// card-print
		let cardPrintMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-print-menuitem`,
			command: this.itemCardPrint,
			parent: mnupopupZotCard
		});
		cardPrintMenu.label = Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-print-title');
		cardPrintMenu.hidden = !hasNote;
		if (!cardPrintMenu.hidden) {
			zotcardMenu.disabled = false;
		}

		// Viewer
		// card-viewer
		let cardImageCompressionMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-image-compression-menuitem`,
			command: this.itemCardImageCompression,
			parent: mnupopupZotCard
		});
		cardImageCompressionMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-image-compression-title'));
		cardImageCompressionMenu.hidden = !hasNote;
		if (!cardImageCompressionMenu.hidden) {
			zotcardMenu.disabled = false;
		}

		// ZotCard > edit
		// card-edit
		let cardEditMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-edit-menuitem`,
			command: this.itemCardEdit,
			parent: mnupopupZotCard
		});
		cardEditMenu.label = Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-edit-title');
		cardEditMenu.hidden = !hasNote;
		if (!cardEditMenu.hidden) {
			zotcardMenu.disabled = false;
		}

		// ZotCard > editor
		// card-editor
		let cardEditorMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-editor-menuitem`,
			command: this.itemCardEditor,
			parent: mnupopupZotCard
		});
		cardEditorMenu.label = Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-editor-title');
		cardEditorMenu.hidden = !(onlySimple && onlyNote);
		if (!cardEditorMenu.hidden) {
			zotcardMenu.disabled = false;
		}


		// card-statistics
		let cardStatisticsMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-statistics-menuitem`,
			command: this.itemCardStatistics,
			parent: mnupopupZotCard
		});
		cardStatisticsMenu.label = Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-statistics-title');
		cardStatisticsMenu.hidden = !(onlySimple && onlyNote);
		if (!cardStatisticsMenu.hidden) {
			zotcardMenu.disabled = false;
		}


		// Viewer
		// card-viewer
		let cardViewerMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-viewer-menuitem`,
			command: this.itemCardViewer,
			parent: zotero_itemmenu
		});
		cardViewerMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-viewer-title'));
		cardViewerMenu.hidden = !hasNote;
		this.storeAddedElement(cardViewerMenu);

		// Manager
		// card-manager
		let cardManagerMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-manager-menuitem`,
			command: this.itemCardManager,
			parent: zotero_itemmenu
		});
		cardManagerMenu.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-manager-title'));
		this.storeAddedElement(cardManagerMenu);
	},

	_createPaneMenuItem(menuseparator, type) {
		Zotero.ZotCard.Logger.log({type});
		
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		let menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `context-pane-add-child-note-button-popup-zotcard-${type}`,
			command: () => {
				this.newCardByPane(type, true);
			},
			after: menuseparator
		});
		menuitem.setAttribute('label', pref.label);
		menuitem.hidden = !pref.visible;
		return menuitem;
	},

	createPaneMenu() {
		let root = 'context-pane-add-child-note-button-popup';
		let elPanePopup = Zotero.getMainWindow().document.getElementById(root);
		let menuseparator1 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator1);

		let hasMenuitem = 0;
		Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
			let menuitem = this._createPaneMenuItem(menuseparator1, type);
			this.storeAddedElement(menuitem);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		});

		let menuseparator2 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator2`,
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator2);
		menuseparator2.hidden = hasMenuitem === 0;

		Zotero.getMainWindow().document.querySelectorAll(`#context-pane-add-child-note-button-popup .custom-card`).forEach(e => {
			e.hidden = true;
		})
		hasMenuitem = 0;
		let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
		for (let index = parseInt(quantity) - 1; index >= 0; index--) {
			let type = Zotero.ZotCard.Cards.customCardType(index);
			let menuitem = this._createPaneMenuItem(menuseparator2, type);
			menuitem.setAttribute('class', 'custom-card');
			this.storeAddedElement(menuitem);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		}

		// batch
		let menuseparator3 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator3`,
			parent: elPanePopup
		});
		menuseparator3.hidden = hasMenuitem === 0;
		this.storeAddedElement(menuseparator3);

		menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-batch`,
			command: () => {
				let io = {};
				Zotero.getMainWindow().openDialog('chrome://zotcard/content/batchnewcard/batchnewcard.html', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io);
				if (io.dataOut && io.dataOut.length > 0) {
					var _this = this
					io.dataOut.forEach(async function (element) {
						for (let index = 0; index < element.value; index++) {
							_this.newCardByPane(element.type, false);
						}
					})
				}
			},
			parent: elPanePopup
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotcard-newpane-batch'));
		this.storeAddedElement(menuitem);

		let menuseparator4 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator4`,
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator4);

		// card-viewer
		menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-viewer`,
			command: () =>{
				this.paneCardViewer();
			},
			parent: elPanePopup
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-viewer-title'));
		this.storeAddedElement(menuitem);

		// card-manager
		menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-manager`,
			command: () =>{
				this.paneCardManager();
			},
			parent: elPanePopup
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-manager-title'));
		this.storeAddedElement(menuitem);
	},

	_createStandaloneMenuItem(menuseparator, type) {
		let root = 'zotero-tb-note-add-popup';
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		let menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-${type}`,
			command: () => {
				this.newCardByCollection(type);
			},
			after: menuseparator
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotcard-newstandalone', {type:  pref.label}));
		menuitem.hidden = !pref.visible;
		return menuitem;
	},

	createStandaloneMenu() {
		let root = 'zotero-tb-note-add-popup';
		let zotero_tb_note_add_menupopup = Zotero.ZotCard.Doms.getMainWindowQuerySelector('#zotero-tb-note-add menupopup');
		let menuseparator1 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			parent: zotero_tb_note_add_menupopup
		});
		this.storeAddedElement(menuseparator1);

		let hasMenuitem = 0;
		Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
			let menuitem = this._createStandaloneMenuItem(menuseparator1, type);
			this.storeAddedElement(menuitem);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		});

		let menuseparator2 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator2`,
			parent: zotero_tb_note_add_menupopup
		});
		menuseparator2.hidden = hasMenuitem === 0;
		this.storeAddedElement(menuseparator2);

		Zotero.getMainWindow().document.querySelectorAll(`#zotero-tb-note-add menupopup .custom-card`).forEach(e => {
			e.hidden = true;
		})
		hasMenuitem = 0;
		let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
		for (let index = parseInt(quantity) - 1; index >= 0; index--) {
			let menuitem = this._createStandaloneMenuItem(menuseparator2, Zotero.ZotCard.Cards.customCardType(index));
			menuitem.setAttribute('class', 'custom-card');
			this.storeAddedElement(menuitem);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		}

		// batch
		let menuseparator3 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator3`,
			parent: zotero_tb_note_add_menupopup
		});
		menuseparator3.hidden = hasMenuitem === 0;
		this.storeAddedElement(menuseparator3);

		menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-batch`,
			command: () => {
				let io = {};
				Zotero.getMainWindow().openDialog('chrome://zotcard/content/batchnewcard/batchnewcard.html', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io);
				if (io.dataOut && io.dataOut.length > 0) {
					var _this = this
					io.dataOut.forEach(async function (element) {
						for (let index = 0; index < element.value; index++) {
							_this.newCardByCollection(element.type);
						}
					})
				}
			},
			parent: zotero_tb_note_add_menupopup
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotcard-newstandalone-batch'));
		this.storeAddedElement(menuitem);
	},

	createNoteStatistics: Zotero.Utilities.debounce(function (doc, prefix, noteHtml) {
		let {words, en_words, cn_words, num_words, length, lines, sizes} = Zotero.ZotCard.Notes.statistics(noteHtml);

		Zotero.ZotCard.Logger.log(`en_words:${en_words}, cn_words:${cn_words}, num_words:${num_words}, length:${length}, lines:${lines}, sizes:${sizes}`);

		// let links_box = doc.querySelector('#links-box>div');
		// if (links_box) {
		// 	links_box.style.flex = 1;
		// }
		
		// let links_box_grid = doc.querySelector('#links-box div.grid');

		this.statisticsProgressWindow.changeHeadline(Zotero.ZotCard.L10ns.getString('zotcard-statistics'));
		this.statisticsProgressWindow.show()
		let text_
		if (Zotero.ZotCard.Prefs.get('word_count_style', Zotero.ZotCard.Consts.wordCountStyle.all) === Zotero.ZotCard.Consts.wordCountStyle.onlyWords) {
			text_ = words.toString();
		} else {
			let {text, title, space} = Zotero.ZotCard.Notes.statisticsToText({words, en_words, cn_words, num_words, length, lines, sizes});
			text_ = text
		}
		this.statisticsProgressItemProgress.setText(text_)
		this.statisticsProgressWindow.startCloseTimer()

		// let links_box = doc.querySelector('#links-box');
		// let div1 = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-zotero-note-links-box-separator1',
		// 	attrs: {
		// 		'style': 'height: 8px; border-bottom: 1px Solid #D9D9D9;',
		// 		'class': 'label',
		// 	},
		// 	parent: links_box
		// });
		// this.storeAddedWordElement(div1);
		// let div2 = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-zotero-note-links-box-separator2',
		// 	attrs: {
		// 		'style': 'height: 8px; border-bottom: 1px Solid #D9D9D9;',
		// 		'class': 'value'
		// 	},
		// 	parent: links_box
		// });
		// this.storeAddedWordElement(div2);

		// let lablel = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-words-label',
		// 	attrs: {
		// 		'class': 'label',
		// 		'data-l10n-id': 'zotcard-words',
		// 	},
		// 	parent: links_box
		// });
		// this.storeAddedWordElement(lablel);
		
		// let value = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-words-value',
		// 	attrs: {
		// 		'class': 'value'
		// 	},
		// 	parent: links_box
		// });
		// value.textContent = text;
		// value.setAttribute('title', title);
		// value.setAttribute('text', text);
		// value.onclick = (e) => {
		// 	let text = e.target.getAttribute('text');
		// 	let title = e.target.getAttribute('title');
		// 	e.target.textContent = e.target.textContent === text ? title : text;
		// }
		// this.storeAddedWordElement(value);

		// lablel = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-lines-label',
		// 	attrs: {
		// 		'class': 'label',
		// 		'data-l10n-id': 'zotcard-lines',
		// 	},
		// 	parent: links_box
		// });
		// this.storeAddedWordElement(lablel);
		// value = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-lines-value',
		// 	attrs: {
		// 		'class': 'value'
		// 	},
		// 	parent: links_box
		// });
		// value.textContent = lines;
		// this.storeAddedWordElement(value);

		// lablel = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-sizes-label',
		// 	attrs: {
		// 		'class': 'label',
		// 		'data-l10n-id': 'zotcard-sizes',
		// 	},
		// 	parent: links_box
		// });
		// this.storeAddedWordElement(lablel);
		// value = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
		// 	id: prefix + '-sizes-value',
		// 	attrs: {
		// 		'class': 'value'
		// 	},
		// 	parent: links_box
		// });
		// value.textContent = space;
		// this.storeAddedWordElement(value);
	}),

	createPaneNoteStatistics(id) {
		Zotero.ZotCard.Utils.afterRun(() => {
			this._clearTabTimedRun();
			let interval = Zotero.ZotCard.Utils.TimedRun(() => {
				Zotero.ZotCard.Logger.log(`TimedRun(${interval}): ${id}`);
				if (Zotero.getMainWindow().Zotero_Tabs.selectedType === 'reader') {
					let tab = Zotero.Reader.getByTabID(Zotero.getMainWindow().Zotero_Tabs.selectedID);
					let activeEditor = tab._window.ZoteroContextPane.getActiveEditor();
					if (activeEditor) {
						let note = Zotero.Items.get(activeEditor.item.id);
						this.createNoteStatistics(activeEditor, 'tab-' + id, note.getNote());
	
						let onkeypress = () => {
							if (Zotero.ZotCard.Prefs.get('enable_word_count', true)) {
								this.createNoteStatistics(activeEditor, 'tab-' + id, activeEditor.querySelector('iframe').contentDocument.querySelector('.editor .ProseMirror').innerHTML);
							}
						};
						activeEditor.removeEventListener('keypress', onkeypress);
						activeEditor.addEventListener('keypress', onkeypress);
					}
				} else {
					this._clearTabTimedRun();
				}
			}, 5000);
			this._clearTabTimedRun();
			this._tab_timed_interval = interval;
			Zotero.ZotCard.Logger.log('create timedrun ' + this._tab_timed_interval);
		}, 1000);
	},

	registerEvent() {
		this._notifierID = Zotero.Notifier.registerObserver(this, ['tab'], 'zotcard');

		Zotero.ZotCard.Events.register({
			itemsViewOnSelect: this.itemsViewOnSelect.bind(this),
			noteEditorKeyup: this.noteEditorKeyup.bind(this),
			refreshCollectionMenuPopup: this.refreshCollectionMenuPopup.bind(this),
			refreshItemMenuPopup: this.refreshItemMenuPopup.bind(this),
			refreshStandaloneMenuPopup: this.refreshStandaloneMenuPopup.bind(this),
			refreshPaneItemMenuPopup: this.refreshPaneItemMenuPopup.bind(this)
		});

		Zotero.Prefs.registerObserver('zotcard.card_quantity', function () {
			var quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
			Zotero.ZotCard.Logger.trace('quantity changed', quantity);
			for (let index = 0; index < quantity; index++) {
				Zotero.ZotCard.Cards.initPrefs(Zotero.ZotCard.Cards.customCardType(index));
			}
			Zotero.ZotCard.Cards.resetCustomCard(quantity + 1);

			this.createStandaloneMenu();
		}.bind(this));

		// Zotero.Prefs.registerObserver('zotcard.enable_word_count', function () {
		// 	var enable_word_count = Zotero.ZotCard.Prefs.get('enable_word_count', true);
		// 	if (enable_word_count) {
		// 		if (Zotero.getMainWindow().Zotero_Tabs.selectedID !== Zotero.ZotCard.Zoteros.mainTabID) {
		// 			this.createPaneNoteStatistics(Zotero.getMainWindow().Zotero_Tabs.selectedID);
		// 		}

		// 		var selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		// 		if (selectedItems.length === 1) {
		// 			let item = selectedItems[0];
		// 			if (item.isNote()) {
		// 				this.createNoteStatistics(Zotero.getMainWindow().document, 'main', item.getNote());
		// 			}
		// 		}
		// 	} else {
		// 		this._clearTabTimedRun();
		// 		this.removeAddedWordElement();
		// 	}
		// }.bind(this));

		
	},

	// #####################


	// ####### menu event #######

	async newCardByPane(type, focus) {
		let collectionID = Zotero.getMainWindow().ZoteroPane.getSelectedCollection() ? Zotero.getMainWindow().ZoteroPane.getSelectedCollection().id : undefined;

		var item;
		var reader = Zotero.ZotCard.Readers.getSelectedReader();
		if (reader) {
			item = Zotero.Items.get(Zotero.Items.get(reader.itemID).parentID);
		}
		if (!item) {
			Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard-unsupported_entries'))
			return
		}

		if (!collectionID) {
			collectionID = item.getCollections()[0];
		} else {
			collectionID = item.getCollections().includes(collectionID) ? collectionID : item.getCollections()[0];
		}

		let collection = Zotero.Collections.get(collectionID);
		let text = Zotero.ZotCard.Readers.getReaderSelectedText();

		let note = new Zotero.Item('note');
		note.parentKey = item.getField('key');
		note.libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
		Zotero.ZotCard.Logger.log({collection, item, type, text});
		let noteContent = Zotero.ZotCard.Cards.newCard(Zotero.getMainWindow(), collection, item, type, text);
		note.setNote(noteContent || '');
		let itemID = await note.saveTx();

		Zotero.getActiveZoteroPane().updateLayout();

		if (focus) {
			var noteRows = reader._window.document.querySelectorAll('.note-row').length;
			var times = 0;
			var interval = setInterval(() => {
				times++;
				if (noteRows < reader._window.document.querySelectorAll('.note-row').length) {
					reader._window.document.querySelector('.note-row').click();
					clearInterval(interval);
				}
				if (times > 3) {
					clearInterval(interval);
				}
			}, 1000);
		}

		return itemID;
	},

	async newCardByItem(type) {
		var items = Zotero.ZotCard.Items.getSelectedItems('regular');
		if (!items || items.length <= 0) {
			Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard-unsupported_entries'));
			return
		}
		// if (items.length !== 1) {
		// 	Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard-only_one'));
		// 	return
		// }
		for (let index = 0; index < items.length; index++) {
			const item = items[index];
			let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
			let note = new Zotero.Item('note');
			note.parentKey = item.getField('key');
			note.libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
			let noteContent =  Zotero.ZotCard.Cards.newCard(Zotero.getMainWindow(), collection, item, type, undefined);
			note.setNote(noteContent || '');
			let itemID = await note.saveTx();
			Zotero.getMainWindow().ZoteroPane.selectItem(itemID);
			Zotero.getMainWindow().document.getElementById('zotero-note-editor').focus();
			
		}
	},

	async newCardByCollection(type) {
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let note = new Zotero.Item('note');
		if (collection) {
			note.addToCollection(collection.id);
		}
		note.libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
		let noteContent = await Zotero.ZotCard.Cards.newCard(Zotero.getMainWindow(), collection, undefined, type, undefined);
		note.setNote(noteContent || '');
		let itemID = await note.saveTx();
		Zotero.getMainWindow().ZoteroPane.selectItem(itemID);
		Zotero.getMainWindow().document.getElementById('zotero-note-editor').focus();
		return itemID;
	},

	collectionCardManager() {
		let items;

		switch (Zotero.getMainWindow().ZoteroPane.getCollectionTreeRow().type) {
			case 'library':
			case 'group':
				let libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
				items = [{
					type: Zotero.ZotCard.Consts.cardManagerType.library,
					id: libraryID
				}];
				break;
			case 'collection':
				let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
				items = [{
					type: Zotero.ZotCard.Consts.cardManagerType.collection,
					id: collection.id
				}];
				break;
			case 'search':
				let search = Zotero.getMainWindow().ZoteroPane.getSelectedSavedSearch();
				items = [{
					type: Zotero.ZotCard.Consts.cardManagerType.search,
					id: search.id
				}];
				break;
			default:
				break;
		}
		
		Zotero.ZotCard.Dialogs.openCardManagerTab(items);
	},

	collectionCardReport() {
		let items;
		let type;
		let id;
		switch (Zotero.getMainWindow().ZoteroPane.getCollectionTreeRow().type) {
			case 'library':
			case 'group':
				let libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
				items = [{
					type: Zotero.ZotCard.Consts.cardManagerType.library,
					id: libraryID
				}];
				type = 'library';
				id = libraryID;
				break;
			case 'collection':
				let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
				items = [{
					type: Zotero.ZotCard.Consts.cardManagerType.collection,
					id: collection.id
				}];
				type = 'collection';
				id = collection.id;
				break;
			case 'search':
				let search = Zotero.getMainWindow().ZoteroPane.getSelectedSavedSearch();
				items = [{
					type: Zotero.ZotCard.Consts.cardManagerType.search,
					id: search.id
				}];
				type = 'search';
				id = search.id;
				break;
		
			default:
				break;
		}
		
		Zotero.ZotCard.Dialogs.openCardReport(type, id);
	},

	itemCardManager() {
		let items = [];
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let selectedItems = Zotero.ZotCard.Items.getSelectedItems();
		selectedItems.forEach(item => {
			if (item.isNote()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.note,
					id: item.id
				});
			} else if (item.isRegularItem()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.item,
					id: item.id
				});
			}
		});
		
		Zotero.ZotCard.Dialogs.openCardManagerTab(items);
	},

	itemCardReplace() {
		let items = [];
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let selectedItems = Zotero.ZotCard.Items.getSelectedItems();
		selectedItems.forEach(item => {
			if (item.isNote()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.note,
					id: item.id
				});
			} else if (item.isRegularItem()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.item,
					id: item.id
				});
			}
		});
		
		Zotero.ZotCard.Dialogs.openCardReplace(items);
	},

	itemCardViewer() {
		let items = [];
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let selectedItems = Zotero.ZotCard.Items.getSelectedItems();
		selectedItems.forEach(item => {
			if (item.isNote()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.note,
					id: item.id
				});
			} else if (item.isRegularItem()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.item,
					id: item.id
				});
			}
		});
		
		Zotero.ZotCard.Dialogs.openCardViewer(items);
	},

	itemCardImageCompression() {
		let items = [];
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let selectedItems = Zotero.ZotCard.Items.getSelectedItems();
		selectedItems.forEach(item => {
			if (item.isNote()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.note,
					id: item.id
				});
			} else if (item.isRegularItem()) {
				items.push({
					collectionID: collection ? collection.id : undefined,
					type: Zotero.ZotCard.Consts.cardManagerType.item,
					id: item.id
				});
			}
		});
		
		Zotero.ZotCard.Dialogs.openCardImageCompression(items);
	},

	itemCardPrint() {
		let selectedItemIDs = Zotero.getMainWindow().ZoteroPane.getSelectedItems(true);
		if (selectedItemIDs.length > 0) {
			Zotero.ZotCard.Dialogs.openCardPrint(selectedItemIDs);
		}
	},

	itemCardEdit() {
		let selectedItemIDs = Zotero.getMainWindow().ZoteroPane.getSelectedItems(true);
		if (selectedItemIDs.length > 0) {
			Zotero.ZotCard.Dialogs.openMultiEditManager(selectedItemIDs);
		}
	},

	itemCardCopyContent() {
		let selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		if (selectedItems.length > 0) {
			let htmls = '';
			let texts = '';
			selectedItems.forEach(item => {
			  if (htmls.length > 0) {
				htmls += '<br />\n<br />\n<br />\n<br />\n';
			  }
			  htmls += item.getNote();
		
			  if (texts.length > 0) {
				texts += '\n\n\n\n';
			  }
			  texts += Zotero.ZotCard.Notes.htmlToText(item.getNote());
			});
			Zotero.ZotCard.Clipboards.copyHtmlTextToClipboard(htmls, texts);
		}
	},

	itemCardCopyText() {
		let selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		if (selectedItems.length > 0) {
            let texts = '';
            selectedItems.forEach(item => {
              if (texts.length > 0) {
                texts += '\n\n\n\n';
              }
			  texts += Zotero.ZotCard.Notes.htmlToText(item.getNote());
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(texts);
		}
	},

	itemCardCopyMarkdown() {
		let selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		if (selectedItems.length > 0) {
            let markdowns = '';
            selectedItems.forEach(item => {
              if (markdowns.length > 0) {
                markdowns += '\n\n\n\n';
              }
              markdowns += Zotero.ZotCard.Notes.translationToMarkdown(item.getNote());
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(markdowns);
		}
	},

	itemCardCopyHtml() {
		let selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		if (selectedItems.length > 0) {
            let htmls = '';
            selectedItems.forEach(item => {
              if (htmls.length > 0) {
                htmls += '<br />\n<br />\n<br />\n<br />\n';
              }
              htmls += item.getNote();
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(htmls);
		}
	},

	itemCardCopyLink() {
		let selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		if (selectedItems.length > 0) {
            let texts = '';
            selectedItems.forEach(item => {
              if (texts.length > 0) {
                texts += '\n';
              }
			  texts += Zotero.ZotCard.Items.getZoteroUrl(item.key);
            });
            Zotero.ZotCard.Clipboards.copyTextToClipboard(texts);
		}
	},

	itemCardEditor() {
		let selectedItems = Zotero.ZotCard.Items.getSelectedItems();
		if (selectedItems.length > 0) {
			Zotero.ZotCard.Dialogs.openCardEditor(selectedItems[0].id);
		}
	},

	itemCardStatistics() {
		let selectedItems = Zotero.ZotCard.Items.getSelectedItems();
		if (selectedItems.length > 0) {
			let {words, en_words, cn_words, num_words, length, lines, sizes} = Zotero.ZotCard.Notes.statistics(selectedItems[0].getNote());
	
			Zotero.ZotCard.Logger.log(`en_words:${en_words}, cn_words:${cn_words}, num_words:${num_words}, length:${length}, lines:${lines}, sizes:${sizes}`);
	
			let pw = new Zotero.ProgressWindow();
			pw.changeHeadline(selectedItems[0].getNoteTitle() + ' ' + Zotero.ZotCard.L10ns.getString('zotcard-statistics'));
			pw.show()
			// let pp = new pw.ItemProgress(null, null);
			let text_
			if (Zotero.ZotCard.Prefs.get('word_count_style', Zotero.ZotCard.Consts.wordCountStyle.all) === Zotero.ZotCard.Consts.wordCountStyle.onlyWords) {
				text_ = words.toString();
			} else {
				let {text, title, space} = Zotero.ZotCard.Notes.statisticsToText({words, en_words, cn_words, num_words, length, lines, sizes});
				text_ = text
			}
			// pp.setText(text_)
			pw.addDescription(text_)
			pw.startCloseTimer(5000)
		}
	},
	
	async itemMoveCollection(collectionid) {
		let items = Zotero.Items.keepTopLevel(Zotero.getMainWindow().ZoteroPane.getSelectedItems());
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			element.parentItemID = undefined;
			element.setCollections([collectionid]);
			await element.saveTx();
		}

		let collection = Zotero.Collections.get(collectionid);
		if (Zotero.ZotCard.Messages.confirm(undefined, Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-move-message', {collectionName: collection.name}))) {
			Zotero.getMainWindow().ZoteroPane.collectionsView.selectCollection(collectionid);
			Zotero.getMainWindow().ZoteroPane.collectionsView.selectItems(items.map(e => e.id));
		}
	},
	
	paneCardManager() {
		var reader = Zotero.ZotCard.Readers.getSelectedReader();
		if (reader) {
			let items = [{
				type: Zotero.ZotCard.Consts.cardManagerType.item,
				id: Zotero.Items.get(reader.itemID).parentID
			}];
			Zotero.ZotCard.Dialogs.openCardManager(items);
		}
	},
	
	paneCardViewer() {
		var reader = Zotero.ZotCard.Readers.getSelectedReader();
		if (reader) {
			let items = [{
				type: Zotero.ZotCard.Consts.cardViewerType.item,
				id: Zotero.Items.get(reader.itemID).parentID
			}];
			Zotero.ZotCard.Dialogs.openCardViewer(items);
		}
	},

	// #####################

	
	// ####### Zotero事件 #######

	handleSelectTab: Zotero.Utilities.debounce((id) => {
		if (id === Zotero.ZotCard.Zoteros.mainTabID) {
			Zotero.ZotCard.removeAddedWordElement('tab-');
			Zotero.ZotCard._clearTabTimedRun();
		} else if(id.startsWith('card-manager-')) {

		} else {
			// Zotero.ZotCard.createPaneNoteStatistics(id);
		}
	}, 1000),

	_tab_timed_interval: 0,
	notify: function (event, type, ids, extraData) {
		// 新增
		Zotero.ZotCard.Logger.log(`event:${event}, type:${type}, ids:${JSON.stringify(ids)}`);
		switch (type) {
			case 'tab':
				if (Zotero.ZotCard.Prefs.get('enable_word_count', true)) {
					let id = ids[0];
					if (event === 'add') {
					} else if (event === 'select') {
						this.handleSelectTab(id);
					} else if(event === 'close') {
						this.removeAddedWordElement('tab-');
						this._clearTabTimedRun();
					}
				}
				break;
			case 'item':
				break;
		
			default:
				break;
		}
	},

	itemsViewOnSelect() {
		Zotero.ZotCard.Logger.ding();
		// if (Zotero.ZotCard.Prefs.get('enable_word_count', true)) {
		// 	var selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
		// 	if (selectedItems.length === 1) {
		// 		let item = selectedItems[0];
		// 		if (item.isNote()) {
		// 			this.createNoteStatistics(Zotero.getMainWindow().document, 'main', item.getNote());
		// 		}
		// 	}
		// }
	},

	noteEditorKeyup(e) {
		// You do not need to add it. It automatically triggers itemsViewOnSelect.
	},

	refreshCollectionMenuPopup () {
		this.createCollectionMenu();
	},

	refreshItemMenuPopup(e) {
		Zotero.ZotCard.Logger.log(e.target.id);

		switch (e.target.id) {
			case 'zotero-itemmenu':
				this.createItemMenu();
				break;
			case 'zotero-itemmenu-zotcard-card-move-menu-popup':
				this.refreshMoveCollectionPopup();
				break;
		
			default:
				break;
		}
	},

	refreshPaneItemMenuPopup() {
		this.createPaneMenu();
	},

	refreshStandaloneMenuPopup() {
		this.createStandaloneMenu();
	},

	refreshMoveCollectionPopup(event) {
		this.buildRecentlyMoveToCollectionMenu();
		
		let popup = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-card-move-menu-popup');
		while (popup.childElementCount > 2) {
			popup.removeChild(popup.lastElementChild);
		}

		let items = Zotero.Items.keepTopLevel(Zotero.getMainWindow().ZoteroPane.getSelectedItems());
		let collections = Zotero.Collections.getByLibrary(Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID());
		for (let col of collections) {
			let menuItem = Zotero.Utilities.Internal.createMenuForTarget(
				col,
				popup,
				null,
				async function (event, collection) {
					if (event.target.tagName == 'menuitem') {
						await this.itemMoveCollection(collection.id);

						let collectionid = collection.id;
						let recentlyMoveCollectionQuantity = Zotero.ZotCard.Prefs.get('movemgr.recently_move_collection_quantity', Zotero.ZotCard.Consts.recently_move_collection_quantity);
						let recentlyMoveCollections = Zotero.ZotCard.Prefs.getJson('movemgr.recently_move_collections', []);
						if (recentlyMoveCollections && recentlyMoveCollections.length > 0) {
							let index = recentlyMoveCollections.indexOf(collectionid);
							if (index > -1) {
								recentlyMoveCollections.splice(index, 1);
							}
							recentlyMoveCollections.push(collectionid);

							if (recentlyMoveCollections.length > recentlyMoveCollectionQuantity) {
								recentlyMoveCollections.splice(0, 1);
							}
						} else {
							recentlyMoveCollections = [collectionid];
						}
						Zotero.ZotCard.Prefs.setJson('movemgr.recently_move_collections', recentlyMoveCollections);
						event.stopPropagation();
					}
				}.bind(this),
				collection => items.every(item => collection.hasItem(item))
			)
			popup.append(menuItem);
		}
	},

	buildRecentlyMoveToCollectionMenu() {
		let recentlyPopup = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-card-move-recently-menu-popup');
		let recentlyCollectionMenu = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-card-move-recently-menu');
		while (recentlyPopup.childElementCount > 0) {
			recentlyPopup.removeChild(recentlyPopup.lastElementChild);
		}

		let recentlyMoveCollections = Zotero.ZotCard.Prefs.getJson('movemgr.recently_move_collections', []);
		Zotero.ZotCard.Logger.log(recentlyMoveCollections);
		
		if (recentlyMoveCollections && recentlyMoveCollections.length > 0) {
			recentlyMoveCollections.reverse().forEach(collectionid => {
				let menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
					id: 'zotero-itemmenu-zotcard-card-move-recently-menu-popup-' + collectionid,
					command: () => {
						Zotero.ZotCard.Logger.log(collectionid);
						this.itemMoveCollection(collectionid);
					},
					parent: recentlyPopup
				});
				menuitem.disabled = Zotero.getMainWindow().ZoteroPane.getSelectedCollection()?.id === collectionid;
				menuitem.setAttribute('label', Zotero.ZotCard.Collections.showPath(collectionid));
				// let menuitem = Zotero.getMainWindow().document.createXULElement('menuitem');
				// menuitem.setAttribute('id', );
				// menuitem.setAttribute('collectionid', collectionid);
				// menuitem.setAttribute('label', Zotero.ZotCard.Collections.showPath(collectionid));
				// menuitem.onclick = async function (e) {
				// 	let collectionid = parseInt(e.target.getAttribute('collectionid'));
				// 	Zotero.ZotCard.Logger.log(collectionid);
				// 	await this.itemMoveCollection(collectionid);
				// }.bind(this)
				// recentlyPopup.append(menuitem);
			})

			recentlyCollectionMenu.disabled = false;
		} else {
			recentlyCollectionMenu.disabled = true;
		}
	},

	// #####################

	// deprecated
	async compressimg() {
		// downloadFile(url, path)
		//Zotero.Attachments.getStorageDirectoryByLibraryAndKey(1, 'L93X9AG9')
		// Zotero.Items.getByLibraryAndKey(1, 'L93X9AG9').getFilePath()//.attachmentLinkMode = 4
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}
		if (zitems.length !== 1) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}

		let tinifyApiKey = Zotero.ZotCard.Prefs.get('config.tinify_api_key')
		if (!tinifyApiKey) {
			Zotero.Prefs.set('zotcard.config.tinify_api_key', '')
			Zotero.ZotCard.Messages.warning(undefined, Utils.getString('zotcard.configuretinypng'))
			Zotero.openInViewer(`about:config?filter=zotero.zotcard.config.tinify_api_key`)
			return
		}
		let compressWithWidthAndHeight = Zotero.ZotCard.Prefs.get('config.compress_with_width_and_height', false);

		let pw = new Zotero.ProgressWindow()
		pw.changeHeadline(Utils.getString('zotcard.compression'))
		pw.addDescription(Utils.getString('zotcard.choose', zitems.length))
		pw.show()
		var zitem = zitems[0]
		let note = zitem.getNote()
		let matchImages = zitem.getNote().match(/<img.*?src="data:.*?;base64,.*?".*?\/>/g)
		if (matchImages) {
			pw.addLines(`${zitem.getNoteTitle()}: ${Utils.getString('zotcard.includesimages', matchImages.length)}`, `chrome://zotero/skin/tick${Zotero.hiDPISuffix}.png`)
			for (let index = 0; index < matchImages.length; index++) {
				let itemProgress = new pw.ItemProgress(
					`chrome://zotero/skin/spinner-16px${Zotero.hiDPISuffix}.png`,
					Utils.getString('zotcard.imagecompressed', index + 1)
				)
				itemProgress.setProgress(50)
				let matchImageSrcs = matchImages[index].match(/src="data:.*?;base64,.*?"/g)
				const element = matchImageSrcs[0]
				let width
				let height
				let matchImageWidths = matchImages[index].match(/width=".*?"/g)
				if (matchImageWidths) {
					width = matchImageWidths[0].replace('width=', '').replace(/"/g, '')
				}
				let matchImageHeights = matchImages[index].match(/height=".*?"/g)
				if (matchImageHeights) {
					height = matchImageHeights[0].replace('height=', '').replace(/"/g, '')
				}
				let content = element.replace('src="', '').replace('"', '')
				let authorization = 'Basic ' + Zotero.Utilities.Internal.Base64.encode('api:' + tinifyApiKey)
				try {
					let request = await Zotero.HTTP.request('POST', 'https://api.tinify.com/shrink',
						{
							body: Zotero.ZotCard.Utils.dataURItoBlob(content),
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': authorization
							}
						})
					if (request.status === 200 || request.status === 201) {
						let res = JSON.parse(request.responseText)
						if (res.error) {
							itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
							itemProgress.setText(Utils.getString('zotcard.imagecompressionfailed', index + 1) + `${res.error} - ${res.message}`)
							itemProgress.setProgress(100)
						} else {
							let image
							if (!compressWithWidthAndHeight || (!width && !height)) {
								image = await Zotero.HTTP.request('GET', res.output.url,
									{
										responseType: 'blob',
										followRedirects: false
									})
							} else {
								Zotero.debug(`zotcard@width: ${width}, height: ${height}`)
								image = await Zotero.HTTP.request('POST', res.output.url,
									{
										body: JSON.stringify({ resize: { method: 'fit', width: width ? parseInt(width) : 0, height: height ? parseInt(height) : 0 } }),
										headers: {
											'Content-Type': 'application/json',
											'Authorization': authorization
										},
										responseType: 'blob',
										followRedirects: false
									})
							}

							if (image.status === 200 || image.status === 201) {
								Zotero.ZotCard.Utils.blobToDataURI(image.response, function (base64) {
									note = note.replace(content, base64)
									zitem.setNote(note)
									zitem.saveTx()
									itemProgress.setIcon(`chrome://zotero/skin/tick${Zotero.hiDPISuffix}.png`)
									itemProgress.setText(Utils.getString('zotcard.imagesize', index + 1) + ` ${res.input.size}${compressWithWidthAndHeight && (width || height) ? ('(' + (width || '') + ',' + (height || '') + ')') : ''}, 压缩成 ${compressWithWidthAndHeight && (width || height) ? image.response.size : res.output.size}, 压缩率: ${res.output.ratio}。`)
									itemProgress.setProgress(100)
								})
							} else if (image.status === 0) {
								itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
								itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + ` - Net Error。`)
								itemProgress.setProgress(100)
							} else {
								itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
								itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + `，${image.status} - ${image.statusText}`)
								itemProgress.setProgress(100)
							}
						}
					} else if (request.status === 0) {
						itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
						itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + ` - Net Error。`)
						itemProgress.setProgress(100)
					} else {
						itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
						itemProgress.setText(Utils.getString('zotcard.imagefailed', index + 1) + `，${image.status} - ${image.statusText}`)
						itemProgress.setProgress(100)
					}
				} catch (e) {
					Zotero.debug(e)
					itemProgress.setIcon(`chrome://zotero/skin/cross${Zotero.hiDPISuffix}.png`)
					itemProgress.setText(Utils.getString('zotcard.imagecompressionfailed', index + 1) + e)
					itemProgress.setProgress(100)
				}
			}
		} else {
			pw.addLines(`${zitem.getNoteTitle()} ${Utils.getString('zotcard.noimagesincluded')}`, `chrome://zotero/skin/warning${Zotero.hiDPISuffix}.png`)
		}
		pw.addDescription(Utils.getString('uread.click_on_close'))
	},

	addToWindow(window) {
	},

	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},

	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		if (!this.addedElementIDs.includes(elem.id)) {
			this.addedElementIDs.push(elem.id);
		}
	},

	storeAddedWordElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		if (!this.addedWordElementIDs.includes(elem.id)) {
			this.addedWordElementIDs.push(elem.id);
		}
	},

	removeAddedWordElement(prefix) {
		let dels = [];
		for (let index = this.addedWordElementIDs.length - 1; index >= 0; index--) {
			let id = this.addedWordElementIDs[index];
			if (!prefix || id.startsWith(prefix)) {
				Zotero.getMainWindow().document.getElementById(id)?.remove();
				dels.push(index);
			}
		}
		dels.forEach(index => {
			this.addedWordElementIDs.splice(index, 1);
		});
	},
	
	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="zotcard.ftl"]').remove();
		this.removeAddedWordElement();
		this._clearTabTimedRun();
	},

	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},

	shutdown() {
		Zotero.Notifier.unregisterObserver(this.notifierID);
		Zotero.ZotCard.Events.shutdown();
	},

	async main() {
		// Global properties are included automatically in Zotero 7
		var host = new URL('https://github.com/018/zotcard').host;
		Zotero.ZotCard.Logger.log(`Host is ${host}`);

		// Retrieve a global pref
		Zotero.ZotCard.Logger.log(`Intensity is ${Zotero.Prefs.get('extensions.make-it-red.intensity', true)}`);
	},

	_clearTabTimedRun() {
		if (this._tab_timed_interval > 0) {
			Zotero.ZotCard.Utils.clearTimedRun(this._tab_timed_interval);
			Zotero.ZotCard.Logger.log('clear timedrun ' + this._tab_timed_interval);
			this._tab_timed_interval = 0;
		}
	},
});