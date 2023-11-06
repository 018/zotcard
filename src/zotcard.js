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
		link1.href = this.rootURI + 'style.css';
		Zotero.getMainWindow().document.documentElement.appendChild(link1);
		this.storeAddedElement(link1);

		// Use Fluent for localization
		Zotero.getMainWindow().MozXULElement.insertFTLIfNeeded("zotcard.ftl");

		Zotero.ZotCard.Cards.initPrefs();

		// this.createToolbarButton();
		this.createCollectionMenu();
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
		Zotero.ZotCard.Prefs.clear('config.print');

		Zotero.ZotCard.Logger.log('Zotero.ZotCard inited.');
	},
	
	createToolbarButton() {
		let root = 'zotero-collections-toolbar';
		let zotero_collections_toolbar = Zotero.getMainWindow().document.getElementById(root);

		let zotcardReadManager = Zotero.ZotCard.Doms.createMainWindowXULElement('toolbarbutton', {
			id: `zotero-tb-read-manager`,
			attrs: {
				'class': 'zotero-tb-button',
				'tooltiptext': '卡片管理',
				'tabindex': '0'
			},
			command: () => {
				var wm = Services.wm;
				var e = wm.getEnumerator(null);
				let winCardManager;
				while (e.hasMoreElements()) {
				  win = e.getNext();
				  if (win.name === 'card-manager') {
					winCardManager = win;
					break;
				  }
				}
				if (winCardManager) {
					winCardManager.focus();
				} else {
					let io = {
						dataIn: []
					};
					let win = Zotero.getMainWindow().openDialog('chrome://zotcard/content/cardmanager/card-manager.html', 'card-manager', 'chrome,centerscreen,height=' + Zotero.getMainWindow().screen.availHeight + ',width=' + Zotero.getMainWindow().screen.availWidth, io);
					win.focus();
				}
			},
			parent: zotero_collections_toolbar,
		});
		this.storeAddedElement(zotcardReadManager);
		// Zotero.ZotCard.Doms.createMainWindowXULElement('image', {
		// 	attrs: {
		// 		'class': 'toolbarbutton-icon',
		// 	},
		// 	parent: zotcardReadManager,
		// });
		// Zotero.ZotCard.Doms.createMainWindowXULElement('label', {
		// 	attrs: {
		// 		'class': 'toolbarbutton-text',
		// 		'crop': 'right',
		// 		'flex': '1',
		// 	},
		// 	parent: zotcardReadManager,
		// });
	},
	
	createCollectionMenu() {
		let root = 'zotero-collectionmenu';
		let zotero_collectionmenu = Zotero.getMainWindow().document.getElementById(root);

		let menuseparator = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			// after: zotcardRead
			parent: zotero_collectionmenu,
		});
		this.storeAddedElement(menuseparator);

		let zotcardRead = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-manager`,
			attrs: {
				'data-l10n-id': 'zotero-zotcard-card-manager',
			},
			command: this.collectionCardManagerd,
			parent: zotero_collectionmenu,
		});
		// zotero_collectionmenu.prepend(zotcardRead);
		this.storeAddedElement(zotcardRead);
	},

	_createMenuItem(mnupopupZotCard, type, onlyRegular, onlySimple) {
		let id = `zotero-itemmenu-zotcard-menu-menupopup-${type}`;
		let menuitem = Zotero.getMainWindow().document.getElementById(id);
		if (!menuitem) {
			menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
				id: id,
				command: () => {
					this.newCardByItem(type);
				},
				parent: mnupopupZotCard
			});
		}
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		menuitem.setAttribute('label', `${pref.card ? pref.label : '-'}`);
		menuitem.hidden = !pref.visible || !onlyRegular || !onlySimple;
		return menuitem;
	},

	createItemMenu() {
		let items = Zotero.ZotCard.Items.getSelectedItems();
		let itemTypes = Zotero.ZotCard.Items.getSelectedItemTypes();
		let onlyNote = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'note';
		let onlyRegular = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'regular';
		var onlySimple = items && items.length === 1;

		Zotero.ZotCard.Logger.log({onlyNote, onlyRegular, onlySimple});

		let root = 'zotero-itemmenu';
		let zotero_itemmenu = Zotero.getMainWindow().document.getElementById(root);
		let menuseparator = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			parent: zotero_itemmenu
		});
		this.storeAddedElement(menuseparator);

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
		zotcardMenu.disabled = false;
		if (!items) {
			zotcardMenu.disabled = true;
			Zotero.ZotCard.Logger.log(`Not Select Item`);
		} else if (items.length > 1 && !onlyNote) {
			zotcardMenu.disabled = true
			Zotero.ZotCard.Logger.log(`Mutil-Select Items but not onlyNote`);
		} else if (itemTypes.length > 1) {
			zotcardMenu.disabled = true;
			Zotero.ZotCard.Logger.log(`Mutil item types`);
		} else if (onlySimple && !onlyRegular) {
			zotcardMenu.disabled = true;
			Zotero.ZotCard.Logger.log(`Simple but not onlyRegular and onlyNote`);
		}

		let mnupopupZotCard = Zotero.ZotCard.Doms.createMainWindowXULElement('menupopup', {
			id: `${root}-zotcard-menu-menupopup`,
			parent: zotcardMenu
		});

		let hasMenuitem = 0;
		Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
			let menuitem = this._createMenuItem(mnupopupZotCard, type, onlyRegular, onlySimple);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		});

		let separator1 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-menu-menupopup-separator1`,
			parent: mnupopupZotCard
		});
		separator1.hidden = hasMenuitem === 0;

		hasMenuitem = 0;
		let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
		for (let index = 0; index < quantity; index++) {
			this._createMenuItem(mnupopupZotCard, Zotero.ZotCard.Cards.customCardType(index), onlyRegular, onlySimple);
			if (!menuitem.hidden) {
				hasMenuitem++;
			}
		}

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
		menuitem.hidden = !onlyRegular || !onlySimple;

		zotcardMenu.disabled = zotcardMenu.children.length === 0;

		let cardManagerMenu = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-card-manager-menuitem`,
			attrs: {
				'data-l10n-id': 'zotero-zotcard-card-manager',
			},
			command: this.itemCardManager,
			parent: zotero_itemmenu
		});
		this.storeAddedElement(cardManagerMenu);
	},

	_createPaneMenuItem(elPanePopup, type) {
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		let menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${elPanePopup.id}-zotcard-${type}`,
			command: () => {
				this.newCardByPane(type, true);
			},
			parent: elPanePopup
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
			let menuitem = this._createPaneMenuItem(elPanePopup, type);
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

		hasMenuitem = 0;
		let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
		for (let index = 0; index < quantity; index++) {
			let type = Zotero.ZotCard.Cards.customCardType(index);
			let menuitem = this._createPaneMenuItem(elPanePopup, type);
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

		// card-manager
		let menuseparator4 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator4`,
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator4);

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

	_createStandaloneMenuItem(zotero_tb_note_add_menupopup, type) {
		let root = 'zotero-tb-note-add-popup';
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		let menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotcard-${type}`,
			command: () => {
				this.newCardByCollection(type);
			},
			parent: zotero_tb_note_add_menupopup
		});
		menuitem.setAttribute('label', Zotero.ZotCard.L10ns.getString('zotcard-newstandalone', {type:  pref.label}));
		menuitem.hidden = !pref.visible;
		return menuitem;
	},

	createStandaloneMenu() {
		let root = 'zotero-tb-note-add-popup';
		let zotero_tb_note_add_menupopup = Zotero.ZotCard.Doms.getMainWindowquerySelector('#zotero-tb-note-add menupopup');
		let menuseparator1 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotcard-separator1`,
			parent: zotero_tb_note_add_menupopup
		});
		this.storeAddedElement(menuseparator1);

		let hasMenuitem = 0;
		Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
			let menuitem = this._createStandaloneMenuItem(zotero_tb_note_add_menupopup, type);
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

		hasMenuitem = 0;
		let quantity = Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity);
		for (let index = 0; index < quantity; index++) {
			let menuitem = this._createStandaloneMenuItem(zotero_tb_note_add_menupopup, Zotero.ZotCard.Cards.customCardType(index));
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

		let links_box = doc.querySelector('#links-box>div');
		if (links_box) {
			links_box.style.flex = 1;
		}
		
		let links_box_grid = doc.querySelector('#links-box div.grid');
		let div1 = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-zotero-note-links-box-separator1',
			attrs: {
				'style': 'height: 8px; border-bottom: 1px Solid #D9D9D9;',
				'class': 'label',
			},
			parent: links_box_grid
		});
		this.storeAddedWordElement(div1);
		let div2 = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-zotero-note-links-box-separator2',
			attrs: {
				'style': 'height: 8px; border-bottom: 1px Solid #D9D9D9;',
				'class': 'value'
			},
			parent: links_box_grid
		});
		this.storeAddedWordElement(div2);

		let lablel = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-words-label',
			attrs: {
				'class': 'label',
				'data-l10n-id': 'zotcard-words',
			},
			parent: links_box_grid
		});
		this.storeAddedWordElement(lablel);

		let value = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-words-value',
			attrs: {
				'class': 'value'
			},
			parent: links_box_grid
		});
		let {text, title, space} = Zotero.ZotCard.Notes.statisticsToText({words, en_words, cn_words, num_words, length, lines, sizes});
		if (Zotero.ZotCard.Prefs.get('word_count_style', Zotero.ZotCard.Consts.wordCountStyle.all) === Zotero.ZotCard.Consts.wordCountStyle.onlyWords) {
			text = words.toString();
		}
		value.textContent = text;
		value.setAttribute('title', title);
		value.setAttribute('text', text);
		value.onclick = (e) => {
			let text = e.target.getAttribute('text');
			let title = e.target.getAttribute('title');
			e.target.textContent = e.target.textContent === text ? title : text;
		}
		this.storeAddedWordElement(value);

		lablel = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-lines-label',
			attrs: {
				'class': 'label',
				'data-l10n-id': 'zotcard-lines',
			},
			parent: links_box_grid
		});
		this.storeAddedWordElement(lablel);
		value = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-lines-value',
			attrs: {
				'class': 'value'
			},
			parent: links_box_grid
		});
		value.textContent = lines;
		this.storeAddedWordElement(value);

		lablel = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-sizes-label',
			attrs: {
				'class': 'label',
				'data-l10n-id': 'zotcard-sizes',
			},
			parent: links_box_grid
		});
		this.storeAddedWordElement(lablel);
		value = Zotero.ZotCard.Doms.createMainWindowXULElement('div', {
			id: prefix + '-sizes-value',
			attrs: {
				'class': 'value'
			},
			parent: links_box_grid
		});
		value.textContent = space;
		this.storeAddedWordElement(value);
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

		Zotero.Prefs.registerObserver('zotcard.enable_word_count', function () {
			var enable_word_count = Zotero.ZotCard.Prefs.get('enable_word_count', true);
			if (enable_word_count) {
				if (Zotero.getMainWindow().Zotero_Tabs.selectedID !== Zotero.ZotCard.Zoteros.mainTabID) {
					this.createPaneNoteStatistics(Zotero.getMainWindow().Zotero_Tabs.selectedID);
				}

				var selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
				if (selectedItems.length === 1) {
					let item = selectedItems[0];
					if (item.isNote()) {
						this.createNoteStatistics(Zotero.getMainWindow().document, 'main', item.getNote());
					}
				}
			} else {
				this._clearTabTimedRun();
				this.removeAddedWordElement();
			}
		}.bind(this));

		
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
		if (items.length !== 1) {
			Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard-only_one'));
			return
		}
		let item = items[0];

		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let note = new Zotero.Item('note');
		note.parentKey = item.getField('key');
		note.libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
		let noteContent =  Zotero.ZotCard.Cards.newCard(Zotero.getMainWindow(), collection, item, type, undefined);
		note.setNote(noteContent || '');
		let itemID = await note.saveTx();
		Zotero.getMainWindow().ZoteroPane.selectItem(itemID);
		Zotero.getMainWindow().document.getElementById('zotero-note-editor').focus();
		return itemID;
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

	collectionCardManagerd() {
		let items;
		let libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID();
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		let search = Zotero.getMainWindow().ZoteroPane.getSelectedSavedSearch();

		if (collection) {
			items = [{
				type: Zotero.ZotCard.Consts.cardManagerType.collection,
				id: collection.id
			}];
		} else if(search) {
			items = [{
				type: Zotero.ZotCard.Consts.cardManagerType.search,
				id: search.id
			}];
		} else {
			items = [{
				type: Zotero.ZotCard.Consts.cardManagerType.library,
				id: libraryID
			}];
		}
		
		Zotero.ZotCard.Dialogs.openCardManagerTab(items);
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

	collectionreport() {
		let selectedCollection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection()
		let selectedSavedSearch = Zotero.getMainWindow().ZoteroPane.getSelectedSavedSearch()

		let io = {
			libraryID: Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID(),
			name: '',
			type: ''
		}
		if (selectedCollection) {
			io.type = 'collection'
			io.selectedCollection = selectedCollection
			io.name = selectedCollection.name
		} else if (selectedSavedSearch) {
			io.type = 'savedSearch'
			io.selectedSavedSearch = selectedSavedSearch
			io.name = selectedSavedSearch.name
		} else {
			let lib = Zotero.Libraries.get(io.libraryID)
			io.type = 'library'
			io.name = lib.name
		}

		Zotero.getMainWindow().Zotero.ZotCard.report = io
		Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/report.html' : 'chrome://zoterozotcard/content/report_en.html')
	},

	// #####################

	
	// ####### Zotero事件 #######

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
						if (id === Zotero.ZotCard.Zoteros.mainTabID) {
							this.removeAddedWordElement('tab-');
							this._clearTabTimedRun();
						} else if(id.startsWith('card-manager-')) {

						} else {
							this.createPaneNoteStatistics(id);
						}
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
		if (Zotero.ZotCard.Prefs.get('enable_word_count', true)) {
			var selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems();
			if (selectedItems.length === 1) {
				let item = selectedItems[0];
				if (item.isNote()) {
					this.createNoteStatistics(Zotero.getMainWindow().document, 'main', item.getNote());
				}
			}
		}
	},

	noteEditorKeyup(e) {
		// You do not need to add it. It automatically triggers itemsViewOnSelect.
	},

	refreshItemMenuPopup() {
		this.createItemMenu();
	},

	refreshPaneItemMenuPopup() {
		this.createPaneMenu();
	},

	refreshStandaloneMenuPopup() {
		this.createStandaloneMenu();
	},

	// #####################

	reset() {
		if (Zotero.ZotCard.Messages.confirm(undefined, Zotero.ZotCard.L10ns.getString('zotcard.resetconfig'))) {
			Zotero.Prefs.clear('zotcard.quotes')
			Zotero.Prefs.clear('zotcard.quotes.visible')
			Zotero.Prefs.clear('zotcard.quotes.label')
			Zotero.Prefs.clear('zotcard.concept')
			Zotero.Prefs.clear('zotcard.concept.visible')
			Zotero.Prefs.clear('zotcard.concept.label')
			Zotero.Prefs.clear('zotcard.character')
			Zotero.Prefs.clear('zotcard.character.visible')
			Zotero.Prefs.clear('zotcard.character.label')
			Zotero.Prefs.clear('zotcard.not_commonsense')
			Zotero.Prefs.clear('zotcard.not_commonsense.visible')
			Zotero.Prefs.clear('zotcard.not_commonsense.label')
			Zotero.Prefs.clear('zotcard.skill')
			Zotero.Prefs.clear('zotcard.skill.visible')
			Zotero.Prefs.clear('zotcard.skill.label')
			Zotero.Prefs.clear('zotcard.structure')
			Zotero.Prefs.clear('zotcard.structure.visible')
			Zotero.Prefs.clear('zotcard.structure.label')
			Zotero.Prefs.clear('zotcard.abstract')
			Zotero.Prefs.clear('zotcard.abstract.visible')
			Zotero.Prefs.clear('zotcard.abstract.label')
			Zotero.Prefs.clear('zotcard.general')
			Zotero.Prefs.clear('zotcard.general.visible')
			Zotero.Prefs.clear('zotcard.general.label')
			Zotero.Prefs.clear('zotcard.card_quantity')
			Zotero.Prefs.clear('zotcard.config.column_edt')

			Zotero.ZotCard.Cards.resetCustomCard.resetCustomCard(1)

			Zotero.ZotCard.Messages.success(undefined, Zotero.ZotCard.L10ns.getString('zotcard.resetsuccessful'))
			Zotero.Utilities.Internal.quit(true)
		}
	},

	readcard() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Messages.warning(undefined, Utils.getString('zotcard.only_note'))
			return
		}

		this.showReadCard(zitems, Zotero.ZotCard.L10ns.getString('zotcard.yourchoice'))
	},

	recentlyMoveToCollectionPopup(event) {
		Zotero.debug('zotcard@recentlyMoveToCollectionPopup...')
		let recentlypopup = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-recently-move-to-collection-popup')
		while (recentlypopup.childElementCount > 0) {
			recentlypopup.removeChild(recentlypopup.lastElementChild)
		}

		let recently_move_collections = Zotero.ZotCard.Prefs.get('config.recently_move_collections', []);
		if (recently_move_collections && recently_move_collections.length > 0) {
			let recentlyMoveCollections = recently_move_collections.split(',')

			recentlyMoveCollections.reverse().forEach(collectionid => {
				let menuitem = Zotero.getMainWindow().document.createElement('menuitem')
				menuitem.setAttribute('id', 'zotero-itemmenu-zotcard-recently-move-to-collection-popup-' + collectionid)
				menuitem.setAttribute('collectionid', collectionid)
				menuitem.setAttribute('label', Zotero.ZotCard.Collections.showPath(collectionid))
				menuitem.onclick = async function (e) {
					await this.moveToCollection(parseInt(e.target.getAttribute('collectionid')))
				}.bind(this)
				recentlypopup.append(menuitem)
			})

			let recentlycollection = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-recently-move-to-collection')
			recentlycollection.disabled = false
		} else {
			let recentlycollection = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-recently-move-to-collection')
			recentlycollection.disabled = true
		}
	},

	moveToCollectionPopup(event) {
		this.recentlyMoveToCollectionPopup()
		if (event.target.id !== 'zotero-itemmenu-zotcard-move-to-collection-popup') return

		let popup = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-move-to-collection-popup')
		while (popup.childElementCount > 2) {
			popup.removeChild(popup.lastElementChild)
		}

		let items = Zotero.Items.keepParents(Zotero.getMainWindow().ZoteroPane.getSelectedItems())
		let collections = Zotero.Collections.getByLibrary(Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID())
		for (let col of collections) {
			let menuItem = Zotero.Utilities.Internal.createMenuForTarget(
				col,
				popup,
				null,
				async function (event, collection) {
					if (event.target.tagName == 'menuitem') {
						await this.moveToCollection(collection.id)

						let collectionid = `${collection.id}`
						let recentlyMoveCollectionQuantity = Zotero.ZotCard.PrefsPrefs.get('config.recently_move_collection_quantity', 5);
						let recently_move_collections = Zotero.ZotCard.PrefsPrefs.get('config.recently_move_collections', [])
						if (recently_move_collections && recently_move_collections.length > 0) {
							let recentlyMoveCollections = recently_move_collections.split(',')
							let index = recentlyMoveCollections.indexOf(collectionid)
							if (index > -1) {
								recentlyMoveCollections.splice(index, 1)
							}
							recentlyMoveCollections.push(collectionid)

							if (recentlyMoveCollections.length > recentlyMoveCollectionQuantity) {
								recentlyMoveCollections.splice(0, 1)
							}
							recently_move_collections = recentlyMoveCollections.join(',')
						} else {
							recently_move_collections = collectionid
						}
						Zotero.Prefs.set('zotcard.config.recently_move_collections', recently_move_collections)
						event.stopPropagation()
					}
				}.bind(this),
				collection => items.every(item => collection.hasItem(item))
			)
			popup.append(menuItem);
		}
	},

	async moveToCollection(collectionid) {
		let items = Zotero.Items.keepParents(Zotero.getMainWindow().ZoteroPane.getSelectedItems())
		for (let index = 0; index < items.length; index++) {
			const element = items[index]
			element.parentItemID = undefined
			element.setCollections([collectionid])
			await element.saveTx()
		}
		Zotero.getMainWindow().ZoteroPane.collectionsView.selectCollection(collectionid)
		Zotero.getMainWindow().ZoteroPane.collectionsView.selectItems(items.map(e => e.id))
	},

	showReadCard(items, title) {
		Zotero.showZoteroPaneProgressMeter(Zotero.ZotCard.L10ns.getString('zotcard.loding'))
		var cards = []
		var options = {}
		items.forEach((item, index) => {
			let cardItem = Zotero.ZotCard.Utils.toCardItem(item)
			cards.push(cardItem)
			options = Zotero.ZotCard.Utils.refreshOptions(cardItem, options)
			Zotero.updateZoteroPaneProgressMeter((index + 1) / items.length)
		})

		let io = {
			window: 'read',
			dataIn: {
				title: title,
				cards: cards,
				options: options
			}
		}
		Zotero.hideZoteroPaneOverlays()

		Zotero.getMainWindow().Zotero.ZotCard.read = io
		Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/read.html' : 'chrome://zoterozotcard/content/read_en.html')
	},

	replace() {
		window.openDialog(
			'chrome://zoterozotcard/content/replace.xul',
			'replace', 'chrome, centerscreen')
	},

	doReplace(target) {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
			ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
			return
		}

		console.info(Zotero.getMainWindow().document.getElementById('zoterozotcard-replacedialog'));
		var edit_text = Zotero.getMainWindow().document.getElementById('edit_text');
		if (edit_text) {
			var text = edit_text.value;
			var replaceto = Zotero.getMainWindow().document.getElementById('edit_replaceto').value;
			zitems.forEach(zitem => {
				zitem.setNote(zitem.getNote().replaceAll(text, replaceto));
				var itemID = zitem.saveTx();
				if (isDebug()) Zotero.debug('item.id: ' + itemID);
			})
		}
	},

	async copy() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
			ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
			return
		}

		var notes = ''
		Zotero.debug(`zotcard@zitems.length${zitems.length}`)
		for (let index = 0; index < zitems.length; index++) {
			const zitem = zitems[index]
			let noteContent = zitem.getNote()
			if (Zotero.ZotCard.Utils.attachmentExistsImg(noteContent)) {
				let ret = await Zotero.ZotCard.Utils.loadAttachmentImg(zitem)
				Zotero.debug(`zotcard@loadAttachmentImg${ret}`)
				noteContent = ret.note
			}
			if (!noteContent.startsWith('<div')) {
				noteContent = `<div data-schema-version="8" cardlink="${Zotero.ZotCard.Items.getZoteroUrl(zitem.key)}">${noteContent}</div>`
			} else {
				let doc = new DOMParser().parseFromString(noteContent, 'text/html')
				doc.body.children[0].setAttribute('cardlink', Zotero.ZotCard.Items.getZoteroUrl(zitem.key))
				noteContent = doc.body.innerHTML
			}
			notes += noteContent + '<br class="card-separator" /><br class="card-separator" />'
		}
		if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(notes)) {
			Zotero.ZotCard.Messages.error(undefined, Zotero.ZotCard.L10ns.getString('zotcard.readcard.copythefailure'))
		} else {
			Zotero.ZotCard.Messages.success(undefined, Zotero.ZotCard.L10ns.getString('zotcard.readcard.copysucceededcount', zitems.length))
		}
	},

	copyandcreate() {
		ZoteroPane_Local.duplicateSelectedItem()
	},

	open() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
			ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
			return
		}

		zitems.forEach(zitem => {
			Zotero.getMainWindow().ZoteroPane.openNoteWindow(zitem.id)
		})

		if (zitems.length > 1) {
			this.adjust()
		}
	},

	adjust() {
		window.openDialog(
			'chrome://zoterozotcard/content/adjust.xul',
			'zotcard-config', 'chrome, centerscreen',
			{})
	},

	close() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
			ps.alert(window, Utils.getString('zotcard.warning'), Utils.getString('zotcard.only_note'))
			return
		}

		zitems.forEach(zitem => {
			let win = Zotero.getMainWindow().ZoteroPane.findNoteWindow(zitem.id)
			if (win) {
				win.close()
			}
		})
	},

	closeall() {
		var wm = Services.wm
		var e = wm.getEnumerator('zotero:note')
		while (e.hasMoreElements()) {
			var w = e.getNext()
			w.close()
		}
	},

	async compressimg() {
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

	async print() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}

		var ids = zitems.map(e => e.id)
		Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer('chrome://zoterozotcard/content/cardcontent.html?ids=' + ids.join(','))
	},

	async copylink() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}
		if (zitems.length !== 1) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}

		var zitem = zitems[0]
		var link = Zotero.ZotCard.Items.getZoteroUrl(zitem.key)
		//Zotero.ZotCard.Utils.copyTextToClipboard(link)
		Zotero.ZotCard.Utils.copyHtmlTextToClipboard(`<a href="${link}">${zitem.getNoteTitle()}</>`, link)
	},
  
  	async notesourcecode() {
		var zitems = Zotero.ZotCard.Items.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}
		if (zitems.length !== 1) {
			Zotero.ZotCard.Messages.error(undefined, Utils.getString('zotcard.only_note'))
			return
		}

		var zitem = zitems[0]
		let io = {
			dataIn: zitem.id
		}

		window.openDialog('chrome://zoterozotcard/content/notesourcecode.xul', 'notesourcecode', 'chrome,modal,centerscreen,scrollbars', io)
	},

	config() {
		//Zotero.openInViewer('chrome://zoterozotcard/content/preferences.html')
		//window.openDialog('chrome://zoterouread/content/option.html', 'option', `chrome,dialog,resizable=no,centerscreen,menubar=no`)
		Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/preferences.html' : 'chrome://zoterozotcard/content/preferences_en.html', `menubar=yes,toolbar=no,location=no,scrollbars,centerscreen,resizable=no,height=640,width=780`)

		//   Zotero.ZotCard.Messages.warning(undefined, `${Zotero.ZotCard.L10ns.getString('zotcard.aboutconfig')}
		//   ${Zotero.ZotCard.L10ns.getString('zotcard.default')}：
		//   zotcard.abstract\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.abstractcard')}
		//   zotcard.quotes\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.quotescard')}
		//   zotcard.concept\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.conceptcard')}
		//   zotcard.character\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.personagecard')}
		//   zotcard.not_commonsense\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.uncommonsensecard')}
		//   zotcard.skill\t\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.skillcard')}
		//   zotcard.structure\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.structurecard')}
		//   zotcard.general\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.essaycard')}

		// ${Zotero.ZotCard.L10ns.getString('zotcard.custom')}：
		//   zotcard.card_quantity\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.customizecards')}
		//   zotcard.card1\t\t\t\t\t\t${Zotero.ZotCard.L10ns.getString('zotcard.cardtemplate')}
		//   ...

		//   ${Zotero.ZotCard.L10ns.getString('zotcard.visitwebsite')}: https://github.com/018/zotcard`)

		//   Zotero.openInViewer('about:config?filter=zotero.zotcard')
	},

	backup() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
		fp.init(window, '备份', Ci.nsIFilePicker.modeSave)
		fp.appendFilter('ZotCard Backup', '*.zotcard')
		fp.open(function (returnConstant) {
			if (returnConstant === 0) {
				let file = fp.file
				file.QueryInterface(Ci.nsIFile)
				let backup = Zotero.ZotCard.Cards.initPrefs()
				backup.last_updated = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
				Zotero.File.putContents(Zotero.File.pathToFile(file.path + '.zotcard'), JSON.stringify(backup))
				Zotero.ZotCard.Messages.success(undefined, Zotero.ZotCard.L10ns.getString('zotcard.backupsucceeded'))
			}
		}.bind(this))
	},

	restore() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
		fp.init(window, Zotero.ZotCard.L10ns.getString('zotcard.restore'), Ci.nsIFilePicker.modeOpen)
		fp.appendFilter('ZotCard Backup', '*.zotcard')
		fp.open(function (returnConstant) {
			if (returnConstant === 0) {
				let file = fp.file
				file.QueryInterface(Ci.nsIFile)
				let content = Zotero.File.getContents(file.path)
				if (content) {
					try {
						let json = JSON.parse(content)
						if (json.quotes && json.quotes.card &&
							json.concept && json.concept.card &&
							json.character && json.character.card &&
							json.not_commonsense && json.not_commonsense.card &&
							json.skill && json.skill.card &&
							json.structure && json.structure.card &&
							json.abstract && json.abstract.card &&
							json.general && json.general.card &&
							json.card_quantity !== undefined) {
							for (let index = 0; index < json.card_quantity; index++) {
								let name = Zotero.ZotCard.Cards.customCardType(index)
								if (!json[name]) {
									Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard.restorefailed'))
									return
								}
							}
							Zotero.Prefs.set(`zotcard.quotes`, json.quotes.card)
							Zotero.Prefs.set(`zotcard.quotes.visible`, json.quotes.visible === undefined ? true : json.quotes.visible)
							Zotero.Prefs.set(`zotcard.concept`, json.concept.card)
							Zotero.Prefs.set(`zotcard.concept.visible`, json.concept.visible === undefined ? true : json.concept.visible)
							Zotero.Prefs.set(`zotcard.character`, json.character.card)
							Zotero.Prefs.set(`zotcard.character.visible`, json.character.visible === undefined ? true : json.character.visible)
							Zotero.Prefs.set(`zotcard.not_commonsense`, json.not_commonsense.card)
							Zotero.Prefs.set(`zotcard.not_commonsense.visible`, json.not_commonsense.visible === undefined ? true : json.not_commonsense.visible)
							Zotero.Prefs.set(`zotcard.skill`, json.skill.card)
							Zotero.Prefs.set(`zotcard.skill.visible`, json.skill.visible === undefined ? true : json.skill.visible)
							Zotero.Prefs.set(`zotcard.structure`, json.structure.card)
							Zotero.Prefs.set(`zotcard.structure.visible`, json.structure.visible === undefined ? true : json.structure.visible)
							Zotero.Prefs.set(`zotcard.abstract`, json.abstract.card)
							Zotero.Prefs.set(`zotcard.abstract.visible`, json.abstract.visible === undefined ? true : json.abstract.visible)
							Zotero.Prefs.set(`zotcard.general`, json.general.card)
							Zotero.Prefs.set(`zotcard.general.visible`, json.general.visible === undefined ? true : json.general.visible)
							Zotero.Prefs.set(`zotcard.card_quantity`, json.card_quantity)

							let index = 0
							for (; index < json.card_quantity; index++) {
								let name = Zotero.ZotCard.Cards.customCardType(index)
								let pref = json[name]
								if (pref) {
									Zotero.Prefs.set(`zotcard.${name}`, pref.card)
									Zotero.Prefs.set(`zotcard.${name}.label`, pref.label)
									Zotero.Prefs.set(`zotcard.${name}.visible`, pref.visible)
								}
							}
							Zotero.ZotCard.Cards.resetCustomCard(index + 1)
							Zotero.ZotCard.Messages.success(undefined, Zotero.ZotCard.L10ns.getString('zotcard.restoresucceeded') + json.last_updated)
						} else {
							Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard.contentcorrupted'))
						}
					} catch (e) {
						Zotero.ZotCard.Messages.warning(undefined, e)
					}
				} else {
					Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard.filenocontent'))
				}
			}
		}.bind(this))
	},

	transitionstyle() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
		fp.init(window, Zotero.ZotCard.L10ns.getString('zotcard.restore'), Ci.nsIFilePicker.modeOpen)
		fp.appendFilter('ZotCard Default Style', '*.zotcardstyle')
		fp.open(function (returnConstant) {
			if (returnConstant === 0) {
				let file = fp.file
				file.QueryInterface(Ci.nsIFile)
				let content = Zotero.File.getContents(file.path)
				if (content) {
					try {
						let json = JSON.parse(content)
						if (json.quotes && json.quotes.card &&
							json.concept && json.concept.card &&
							json.character && json.character.card &&
							json.not_commonsense && json.not_commonsense.card &&
							json.skill && json.skill.card &&
							json.structure && json.structure.card &&
							json.general && json.general.card) {
							Zotero.Prefs.set(`zotcard.quotes`, json.quotes.card)
							Zotero.Prefs.set(`zotcard.quotes.visible`, json.quotes.visible === undefined ? true : json.quotes.visible)
							Zotero.Prefs.set(`zotcard.concept`, json.concept.card)
							Zotero.Prefs.set(`zotcard.concept.visible`, json.concept.visible === undefined ? true : json.concept.visible)
							Zotero.Prefs.set(`zotcard.character`, json.character.card)
							Zotero.Prefs.set(`zotcard.character.visible`, json.character.visible === undefined ? true : json.character.visible)
							Zotero.Prefs.set(`zotcard.not_commonsense`, json.not_commonsense.card)
							Zotero.Prefs.set(`zotcard.not_commonsense.visible`, json.not_commonsense.visible === undefined ? true : json.not_commonsense.visible)
							Zotero.Prefs.set(`zotcard.skill`, json.skill.card)
							Zotero.Prefs.set(`zotcard.skill.visible`, json.skill.visible === undefined ? true : json.skill.visible)
							Zotero.Prefs.set(`zotcard.structure`, json.structure.card)
							Zotero.Prefs.set(`zotcard.structure.visible`, json.structure.visible === undefined ? true : json.structure.visible)
							Zotero.Prefs.set(`zotcard.abstract`, json.abstract.card)
							Zotero.Prefs.set(`zotcard.abstract.visible`, json.abstract.visible === undefined ? true : json.abstract.visible)
							Zotero.Prefs.set(`zotcard.general`, json.general.card)
							Zotero.Prefs.set(`zotcard.general.visible`, json.general.visible === undefined ? true : json.general.visible)

							Zotero.ZotCard.Messages.success(undefined, Zotero.ZotCard.L10ns.getString('zotcard.changingsucceeded') + json.last_updated)
						} else {
							Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard.contentcorrupted'))
						}
					} catch (e) {
						Zotero.ZotCard.Messages.warning(undefined, e)
					}
				} else {
					Zotero.ZotCard.Messages.warning(undefined, Zotero.ZotCard.L10ns.getString('zotcard.filenocontent'))
				}
			}
		}.bind(this))
	},

	refreshLineHeigthMenuItemChecked() {
		let height = this.getNoteLineHeight()
		for (let menuitem of Zotero.getMainWindow().document.querySelectorAll(`#note-line-heigth-menu menuitem`)) {
			if (menuitem.getAttribute('line-height') === height) {
				menuitem.setAttribute('checked', true)
			} else {
				menuitem.removeAttribute('checked')
			}
		}
	},

	refreshParagraphSpacingMenuItemChecked() {
		let height = this.getNoteParagraphSpacing()
		for (let menuitem of Zotero.getMainWindow().document.querySelectorAll(`#note-paragraph-spacing-menu menuitem`)) {
			if (menuitem.getAttribute('paragraph-spacing') === height) {
				menuitem.setAttribute('checked', true)
			} else {
				menuitem.removeAttribute('checked')
			}
		}
	},

	copyStringToClipboard(clipboardText) {
		const gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper)
		gClipboardHelper.copyString(clipboardText, document)
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