if (!Zotero.ZotCard) Zotero.ZotCard = {};

Zotero.ZotCard = Object.assign(Zotero.ZotCard, {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],
	_notifierID: 0,

	notifierCallback: {
		notify: function (event, type, ids, extraData) {
			// 新增
			Zotero.ZotCard.Logger.trace('notifierCallback', {event, type, ids, extraData});
			if (event === 'add') {
			} else if (event === 'edit') {
			}
		}
	},

	init({ id, version, rootURI }) {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard inited.');
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;

		this._notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);

		Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zotcard-utils.js');
		Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zotcard-notes.js');
		Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zotcard-cards.js');
		Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zotcard-doms.js');
		Services.scriptloader.loadSubScript(rootURI + '/chrome/content/cardsearcher.js');


		let doc = Zotero.getMainWindow().document;

		// Add a stylesheet to the main Zotero pane
		let link1 = doc.createElement('link');
		link1.id = 'zotcard-stylesheet';
		link1.type = 'text/css';
		link1.rel = 'stylesheet';
		link1.href = this.rootURI + 'style.css';
		doc.documentElement.appendChild(link1);
		this.storeAddedElement(link1);

		// Use Fluent for localization
		Zotero.getMainWindow().MozXULElement.insertFTLIfNeeded("zotcard.ftl");

		// Add item right menu
		let menuseparator = Zotero.ZotCard.Doms.createXULElement(doc, 'menuseparator', {
			id: 'zotero-zotcard-menuseparator',
			parent: doc.getElementById('zotero-itemmenu')
		});
		this.storeAddedElement(menuseparator);

		let mnuZotCard = Zotero.ZotCard.Doms.createXULElement(doc, 'menu', {
			id: 'zotero-itemmenu-zotcard',
			attrs: {
				'data-l10n-id': 'zotero-zotcard-zotcard',
			},
			parent: doc.getElementById('zotero-itemmenu')
		});
		this.storeAddedElement(mnuZotCard);

		let mnupopupZotCard = Zotero.ZotCard.Doms.createXULElement(doc, 'menupopup', {
			id: 'zotero-itemmenu-zotcard-menupopup',
			parent: mnuZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-abstract',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-abstract',
			},
			command: () => {
				Zotero.ZotCard.abstract(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-quotes',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-quotes',
			},
			command: () => {
				Zotero.ZotCard.quotes(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-concept',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-concept',
			},
			command: () => {
				Zotero.ZotCard.concept(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-character',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-character',
			},
			command: () => {
				Zotero.ZotCard.character(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-not_commonsense',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-not_commonsense',
			},
			command: () => {
				Zotero.ZotCard.not_commonsense(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-skill',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-skill',
			},
			command: () => {
				Zotero.ZotCard.skill(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-structure',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-structure',
			},
			command: () => {
				Zotero.ZotCard.structure(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});
		Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'zotero-itemmenu-zotcard-general',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple',
				'data-l10n-id': 'zotero-zotcard-general',
			},
			command: () => {
				Zotero.ZotCard.general(Zotero.getMainWindow());
			},
			parent: mnupopupZotCard
		});

		Zotero.ZotCard.Doms.createXULElement(doc, 'menuseparator', {
			id: 'zotero-itemmenu-zotcard-separator2',
			attrs: {
				'class': 'dynamic-menu only-regular only-simple'
			},
			parent: mnupopupZotCard
		});


		// Add pane menu
		let elPanePopup = doc.getElementById('context-pane-add-child-note-button-popup')
		let menuseparator1 = Zotero.ZotCard.Doms.createXULElement(doc, 'menuseparator', {
			id: 'zotero-itemmenu-zotcard-pane-separator2',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple'
			},
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator1);
		let el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-abstract',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-abstract',
			},
			command: () => {
				Zotero.ZotCard.abstract(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-quotes',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-quotes',
			},
			command: () => {
				Zotero.ZotCard.quotes(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-concept',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-concept',
			},
			command: () => {
				Zotero.ZotCard.concept(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-character',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-character',
			},
			command: () => {
				Zotero.ZotCard.character(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-not_commonsense',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-not_commonsense',
			},
			command: () => {
				Zotero.ZotCard.not_commonsense(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-skill',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-skill',
			},
			command: () => {
				Zotero.ZotCard.skill(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-structure',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-structure',
			},
			command: () => {
				Zotero.ZotCard.structure(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		el = Zotero.ZotCard.Doms.createXULElement(doc, 'menuitem', {
			id: 'context-pane-add-child-note-button-popup-zotcard-general',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple',
				'data-l10n-id': 'zotero-zotcard-general',
			},
			command: () => {
				Zotero.ZotCard.general(Zotero.getMainWindow(), true);
			},
			parent: elPanePopup
		});
		this.storeAddedElement(el);
		menuseparator1 = Zotero.ZotCard.Doms.createXULElement(doc, 'menuseparator', {
			id: 'context-pane-add-child-note-button-popup-zotcard-separator2',
			attrs: {
				'class': 'pane-dynamic-menu pane-only-regular pane-only-simple'
			},
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator1);



		Zotero.Prefs.registerObserver('zotcard.card_quantity', function () {
			var quantity = Zotero.Prefs.get('zotcard.card_quantity')
			Zotero.ZotCard.Logger.trace('quantity', quantity);
			for (let index = 0; index < quantity; index++) {
				let name = `card${index + 1}`
				Zotero.ZotCard.Cards.initPrefs(name)
			}
			this.resetCard(quantity + 1)

			this.initStandCardMenu()
		}.bind(this))

		doc.getElementById('zotero-items-tree').addEventListener('select', this.itemsTreeOnSelect.bind(this), false);
		// if (Zotero.ZotCard.Utils.version() >= 6) {
		// 	Zotero.debug(`zotcard@addListener onSelect: ${Zotero.ZotCard.Utils.version()}`)
		// 	var interval1 = setInterval(() => {
		// 		if (Zotero.getMainWindow().ZoteroPane.itemsView) {
		// 			Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.addListener(this.itemsTreeOnSelect);
		// 			clearInterval(interval1)
		// 		}
		// 	}, 1000);
		// } else {
		// 	doc.getElementById('zotero-items-tree').addEventListener('select', this.itemsTreeOnSelect.bind(this), false)
		// }

		doc.getElementById('zotero-note-editor').addEventListener('keyup', this.noteEditorOnKeyup.bind(this), false)
		doc.getElementById('zotero-itemmenu').addEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false)
		doc.getElementById('context-pane-add-child-note-button-popup').addEventListener('popupshowing', this.refreshZoteroPanePopup.bind(this), false)

		//doc.getElementById('zotero-toolspopup-zotcard-option-notebackgroundcolor').hidden = Zotero.ZotCard.Utils.version() >= 6;

		Zotero.ZotCard.Cards.initPrefs();

		let tinifyApiKey = Zotero.Prefs.get('zotcard.config.tinify_api_key')
		if (!tinifyApiKey) {
			Zotero.Prefs.set('zotcard.config.tinify_api_key', '')
		}

		let recentlyMoveCollectionQuantity = Zotero.Prefs.get('zotcard.config.recently_move_collection_quantity')
		if (!recentlyMoveCollectionQuantity) {
			Zotero.Prefs.set('zotcard.config.recently_move_collection_quantity', 5)
		}

		// 独立笔记
		this.initStandCardMenu();

		if (Zotero.ZotCard.Utils.version() < 6) {
			this.initNoteLineHeight()
			this.initNoteParagraphSpacing()
		}
	},

	abstract(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'abstract', true)
		} else {
			this.newCardByItem(window, 'abstract')
		}
	},


	async newCardByPane(window, name, focus) {
		let collectionID = window.ZoteroPane.getSelectedCollection() ? window.ZoteroPane.getSelectedCollection().id : undefined

		var item
		var reader = Zotero.Reader.getByTabID(window.Zotero_Tabs.selectedID)
		if (reader) {
			item = Zotero.Items.get(Zotero.Items.get(reader.itemID).parentID)
		}
		if (!item) {
			Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.unsupported_entries'))
			return
		}

		if (!collectionID) {
			collectionID = item.getCollections()[0]
		} else {
			collectionID = item.getCollections().includes(collectionID) ? collectionID : item.getCollections()[0]
		}

		let collection = Zotero.Collections.get(collectionID)
		let text = Zotero.ZotCard.Utils.getReaderSelectedText()

		let note = new Zotero.Item('note')
		note.parentKey = item.getField('key')
		note.libraryID = window.ZoteroPane.getSelectedLibraryID()
		Zotero.ZotCard.Logger.log({collection, item, name, text});
		let noteContent = Zotero.ZotCard.Cards.newCard(collection, item, name, text)
		note.setNote(noteContent)
		let itemID = await note.saveTx()

		Zotero.getActiveZoteroPane().updateLayout()

		if (focus) {
			var noteRows = reader._window.document.querySelectorAll('.note-row').length
			var times = 0
			var interval = setInterval(() => {
				times++
				if (noteRows < reader._window.document.querySelectorAll('.note-row').length) {
					reader._window.document.querySelector('.note-row').click()
					clearInterval(interval)
				}
				if (times > 3) {
					clearInterval(interval)
				}
			}, 1000)
		}

		return itemID
	},

	async newCardByItem(window, name) {
		var items = Zotero.ZotCard.Utils.getSelectedItems('regular')
		if (!items || items.length <= 0) {
			Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard-unsupported_entries'))
			return
		}
		if (items.length !== 1) {
			Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard-only_one'))
			return
		}
		let item = items[0]

		let collection = window.ZoteroPane.getSelectedCollection()
		let note = new Zotero.Item('note')
		note.parentKey = item.getField('key')
		note.libraryID = window.ZoteroPane.getSelectedLibraryID()
		let noteContent =  Zotero.ZotCard.Cards.newCard(collection, item, name, undefined)
		note.setNote(noteContent)
		let itemID = await note.saveTx()
		window.ZoteroPane.selectItem(itemID)
		window.document.getElementById('zotero-note-editor').focus()
		return itemID
	},

	noteEditorOnKeyup(e) {

		let label = Zotero.getMainWindow().document.getElementById('zotero-view-note-counts')
		if (!label) {
			label = Zotero.getMainWindow().document.createElement('label')
			label.setAttribute('id', 'zotero-view-note-counts')
			label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', 0, 0, 0)
			Zotero.getMainWindow().document.getElementById('zotero-view-note').prepend(label)
		}

		let noteEditor = e.currentTarget
		let note
		if (Zotero.ZotCard.Utils.version() >= 6) {
			let parser = Components.classes['@mozilla.org/xmlextras/domparser;1'].createInstance(Components.interfaces.nsIDOMParser)
			let doc = parser.parseFromString(Zotero.getMainWindow().document.getElementById('zotero-note-editor').editorInstance._iframeWindow.document.body.innerHTML, 'text/html')
			let proseMirror = doc.querySelector('.ProseMirror')
			if (proseMirror) {
				note = proseMirror.innerHTML
			} else {
				note = noteEditor.editorInstance._iframeWindow.document.body.innerHTML
			}

		} else {
			note = noteEditor.value
		}
		Zotero.debug(`zotcard@note: ${note}`)
		let hangzis = Zotero.ZotCard.Utils.hangzi(note)
		let liness = Zotero.ZotCard.Utils.lines(note)
		label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', hangzis, liness, Zotero.Utilities.Internal.byteLength(note))
		Zotero.debug(`zotcard@onkeyup: ${new Date().getTime()} ${hangzis} ${liness}`)
	},

	itemsTreeOnSelect() {
		var selectedItems = Zotero.getMainWindow().ZoteroPane.getSelectedItems()
		Zotero.ZotCard.Logger.log('ItemsTreeOnSelect length', selectedItems.length);
		if (selectedItems.length === 1) {
			let item = selectedItems[0]
			if (item.isNote()) {
				let label = Zotero.getMainWindow().document.getElementById('zotero-view-note-counts')
				if (!label) {
					label = Zotero.getMainWindow().document.createElement('label')
					label.setAttribute('id', 'zotero-view-note-counts')
					label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', 0, 0, 0)
					let noteEditor = Zotero.getMainWindow().document.getElementById('zotero-view-note')
					noteEditor.prepend(label)
				}
				let hangzis = Zotero.ZotCard.Utils.hangzi(item.getNote())
				let liness = Zotero.ZotCard.Utils.lines(item.getNote())
				label.textContent = Zotero.ZotCard.Utils.getString('zotcard.wordnumber', hangzis, liness, Zotero.Utilities.Internal.byteLength(item.getNote()))
				
				Zotero.ZotCard.Logger.log({hangzis, liness});
			}
		}
	},

	refreshZoteroPanePopup() {
		this.refreshZoteroCardPopup(true)
	},

	refreshZoteroItemPopup() {
		this.refreshZoteroCardPopup(false)
	},

	refreshZoteroCardPopup(pane) {
		Zotero.ZotCard.Logger.trace('refreshZoteroCardPopup, pane', pane);
		let items = Zotero.ZotCard.Utils.getSelectedItems();
		let itemTypes = Zotero.ZotCard.Utils.getSelectedItemTypes();
		let onlyNote = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'note';
		let onlyRegular = itemTypes && itemTypes.length === 1 && itemTypes[0] === 'regular';
		var onlySimple = items && items.length === 1;

		Zotero.ZotCard.Logger.log({onlyNote, onlyRegular, onlySimple});

		if (!pane) {
			Zotero.ZotCard.Logger.ding();
			let zotcardMenu = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard');
			zotcardMenu.disabled = false;
			if (!items) {
				zotcardMenu.disabled = true
				Zotero.ZotCard.Logger.log(`Not Select Item`)
			} else if (items.length > 1 && !onlyNote) {
				zotcardMenu.disabled = true
				Zotero.ZotCard.Logger.log(`Mutil-Select Items but not onlyNote`)
			} else if (itemTypes.length > 1) {
				zotcardMenu.disabled = true
				Zotero.ZotCard.Logger.log(`Mutil item types`)
			} else if (onlySimple && !onlyRegular) {
				zotcardMenu.disabled = true
				Zotero.ZotCard.Logger.log(`Simple but not onlyRegular and onlyNote`)
			}

			Zotero.getMainWindow().document.querySelectorAll('.dynamic-menu').forEach(element => {
				element.hidden = false
			})
			Zotero.getMainWindow().document.querySelectorAll('.only-regular').forEach(element => {
				element.hidden = element.hidden ? element.hidden : !onlyRegular
			})
			Zotero.getMainWindow().document.querySelectorAll('.only-note').forEach(element => {
				element.hidden = element.hidden ? element.hidden : !onlyNote
			})
			Zotero.getMainWindow().document.querySelectorAll('.only-simple').forEach(element => {
				element.hidden = element.hidden ? element.hidden : !onlySimple
			})
		}

		this.initDefCardMenu('quotes', pane)
		this.initDefCardMenu('concept', pane)
		this.initDefCardMenu('character', pane)
		this.initDefCardMenu('not_commonsense', pane)
		this.initDefCardMenu('skill', pane)
		this.initDefCardMenu('structure', pane)
		this.initDefCardMenu('abstract', pane)
		this.initDefCardMenu('general', pane)

		Zotero.getMainWindow().document.querySelectorAll(pane ? '.pane-card' : '.card').forEach(element => {
			element.hidden = true
		})

		if (pane || (onlyRegular && onlySimple)) {
			let quantity = Zotero.ZotCard.Cards.initPrefs('card_quantity')
			Zotero.ZotCard.Logger.trace('quantity', quantity);
			for (let index = 0; index < quantity; index++) {
				let name = `card${index + 1}`
				let id = pane ? `zotero-itemmenu-zotcard-pane-${name}` : `zotero-itemmenu-zotcard-${name}`
				let pref = Zotero.ZotCard.Cards.initPrefs(name)
				let card = Zotero.getMainWindow().document.getElementById(id);
				if (!card) {
					card = Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuitem', {
						id: id,
						attrs: {
							'class': pane ? 'pane-card' : 'card',
							'name': name
						},
						command: () => {
							Zotero.ZotCard.Logger.ding();
							if (pane) {
								this.newCardByPane(Zotero.getMainWindow(), name, true);
							} else {
								this.newCardByItem(Zotero.getMainWindow(), name);
							}
						},
						parent: Zotero.getMainWindow().document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup')
					});
				}
				card.setAttribute('label', `${pref.card ? pref.label : '-'}`)
				card.hidden = !pref.visible
			}
			Zotero.getMainWindow().document.getElementById(pane ? 'zotero-itemmenu-zotcard-pane-separator2' : 'zotero-itemmenu-zotcard-separator2').hidden = quantity === 0

			if (false) {
				let batchid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch' : 'zotero-itemmenu-zotcard-menupopup-batch'
				if (!Zotero.getMainWindow().document.getElementById(batchid)) {
					// let menuitem = Zotero.getMainWindow().document.createElement('menuitem')
					// menuitem.setAttribute('id', batchid)
					// menuitem.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.batchaddnote'))
					// menuitem.setAttribute('class', pane ? 'pane-card' : 'card')
					// menuitem.onclick = function () {
					// 	let io = {
					// 		dataIn: {
					// 			items: []
					// 		}
					// 	}

					// 	let pushPref = function (items, type) {
					// 		let pref = Zotero.ZotCard.Cards.initPrefs(type)
					// 		if (pref.visible && pref.card.length > 0) {
					// 			Zotero.debug(`zotcard@push ${type}`)
					// 			items.push({
					// 				id: type,
					// 				label: pref.label,
					// 				value: ''
					// 			})
					// 		}
					// 	}.bind(this)

					// 	pushPref(io.dataIn.items, 'quotes')
					// 	pushPref(io.dataIn.items, 'concept')
					// 	pushPref(io.dataIn.items, 'character')
					// 	pushPref(io.dataIn.items, 'not_commonsense')
					// 	pushPref(io.dataIn.items, 'skill')
					// 	pushPref(io.dataIn.items, 'structure')
					// 	pushPref(io.dataIn.items, 'abstract')
					// 	pushPref(io.dataIn.items, 'general')

					// 	let quantity = Zotero.ZotCard.Cards.initPrefs('card_quantity')
					// 	Zotero.debug(`zotcard@card_quantity ${quantity}`)
					// 	for (let index = 0; index < quantity; index++) {
					// 		let name = `card${index + 1}`
					// 		Zotero.debug(`zotcard@push ${name}`)
					// 		pushPref(io.dataIn.items, name)
					// 	}

					// 	Zotero.debug(`zotcard@openDialog`)
					// 	window.openDialog('chrome://zoterozotcard/content/batchnewcard.xul', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io)
					// 	if (io.dataOut) {
					// 		var _this = this
					// 		io.dataOut.forEach(async function (element) {
					// 			Zotero.debug('uRead@element: ' + element)
					// 			for (let index = 0; index < element.value; index++) {
					// 				if (pane) {
					// 					_this.newCardByPane(element.id)
					// 				} else {
					// 					_this.newCardByItem(element.id)
					// 				}
					// 			}
					// 		})
					// 	}
					// }.bind(this)
					// let menuseparatorid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch-menuseparator' : 'zotero-itemmenu-zotcard-menupopup-batch-menuseparator'
					// let menuseparator = Zotero.getMainWindow().document.createElement('menuseparator');
					// menuitem.setAttribute('id', menuseparatorid)
					// menuseparator.setAttribute('class', pane ? 'pane-card' : 'card')
					// Zotero.getMainWindow().document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup').append(menuseparator)
					// Zotero.getMainWindow().document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup').append(menuitem)

					Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuseparator', {
						id: pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch-menuseparator' : 'zotero-itemmenu-zotcard-menupopup-batch-menuseparator',
						parent: Zotero.getMainWindow().document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup')
					});

					Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuitem', {
						id: batchid,
						attrs: {
							'class': pane ? 'pane-card' : 'card',
							'data-l10n-id': 'zotcard-batchaddnote'
						},
						command: () => {
							let io = {
								dataIn: {
									items: []
								}
							}
		
							let pushPref = function (items, type) {
								let pref = Zotero.ZotCard.Cards.initPrefs(type)
								if (pref.visible && pref.card.length > 0) {
									Zotero.debug(`zotcard@push ${type}`)
									items.push({
										id: type,
										label: pref.label,
										value: ''
									})
								}
							}.bind(this)
		
							pushPref(io.dataIn.items, 'quotes')
							pushPref(io.dataIn.items, 'concept')
							pushPref(io.dataIn.items, 'character')
							pushPref(io.dataIn.items, 'not_commonsense')
							pushPref(io.dataIn.items, 'skill')
							pushPref(io.dataIn.items, 'structure')
							pushPref(io.dataIn.items, 'abstract')
							pushPref(io.dataIn.items, 'general')
		
							let quantity = Zotero.ZotCard.Cards.initPrefs('card_quantity')
							Zotero.ZotCard.Logger.log('quantity', quantity);
							for (let index = 0; index < quantity; index++) {
								let name = `card${index + 1}`
								Zotero.ZotCard.Logger.log(`zotcard@push ${name}`)
								pushPref(io.dataIn.items, name)
							}
		
							Zotero.getMainWindow().openDialog(this.rootURI + 'chrome/content/batchnewcard/batchnewcard.xhtml', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io)
							if (io.dataOut) {
								var _this = this
								io.dataOut.forEach(async function (element) {
									Zotero.ZotCard.Logger.log('element', element);
									for (let index = 0; index < element.value; index++) {
										if (pane) {
											_this.newCardByPane(element.id)
										} else {
											_this.newCardByItem(element.id)
										}
									}
								})
							}
						},
						parent: Zotero.getMainWindow().document.getElementById(pane ? 'context-pane-add-child-note-button-popup' : 'zotero-itemmenu-zotcard-menupopup')
					});
				} else {
					Zotero.ZotCard.Logger.ding();
					let batchid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch' : 'zotero-itemmenu-zotcard-menupopup-batch'
					let menuseparatorid = pane ? 'zotero-itemmenu-zotcard-pane-menupopup-batch-menuseparator' : 'zotero-itemmenu-zotcard-menupopup-batch-menuseparator'
					Zotero.getMainWindow().document.getElementById(batchid).hidden = false
					Zotero.getMainWindow().document.getElementById(menuseparatorid).hidden = false
				}
			}
		}

		// if (!pane && Zotero.ZotCard.Utils.version() >= 6) {
		// 	Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-compressimg').hidden = true
		// 	Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-compressimg-separator').hidden = true
		// }
	},

	initStandCardMenu() {
		if (!Zotero.getMainWindow().document.getElementById('zotcard-tb-note-add-separator1')) {
			Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuseparator',{
				id: 'zotcard-tb-note-add-separator1',
				parent: Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').querySelector('menupopup')
			});
		}

		this.initStandDefCardMenu('abstract');
		this.initStandDefCardMenu('quotes');
		this.initStandDefCardMenu('concept');
		this.initStandDefCardMenu('character');
		this.initStandDefCardMenu('not_commonsense');
		this.initStandDefCardMenu('skill');
		this.initStandDefCardMenu('structure');
		this.initStandDefCardMenu('general');

		if (!Zotero.getMainWindow().document.getElementById('zotcard-tb-note-add-separator2')) {
			Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuseparator',{
				id: 'zotcard-tb-note-add-separator2',
				parent: Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').querySelector('menupopup')
			});
		}

		Zotero.getMainWindow().document.querySelectorAll('.custom-card').forEach(element => {
			element.remove();
		})

		let quantity = Zotero.ZotCard.Cards.initPrefs('card_quantity')
		for (let index = 0; index < quantity; index++) {
			let name = `card${index + 1}`
			let id = `zotcard-tb-note-add-${name}`
			let pref = Zotero.ZotCard.Cards.initPrefs(name)
			let card = Zotero.getMainWindow().document.getElementById(id)
			if (!card) {
				card = Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuitem',{
					id: id,
					attrs: {
						'class': 'custom-card',
						'label': Zotero.ZotCard.Utils.getString('zotcard-newstandalone',{name:  pref.label})
					},
					props: {
						'hidden': !pref.visible
					},
					command: () => {
						this.newCardByCollection(name)
					},
					parent: Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').querySelector('menupopup')
				});
			}
		}

		// let menuitem = Zotero.getMainWindow().document.getElementById('zotcard-tb-note-add-batch')
		// if (!menuitem) {
		// 	menuitem = Zotero.getMainWindow().document.createElement('menuitem')
		// 	menuitem.setAttribute('id', `zotcard-tb-note-add-batch`)
		// 	menuitem.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.batchnewstandalone'))
		// 	menuitem.onclick = function () {
		// 		let io = {
		// 			dataIn: {
		// 				items: []
		// 			}
		// 		}

		// 		let pushPref = function (items, type) {
		// 			let pref = Zotero.ZotCard.Cards.initPrefs(type)
		// 			if (pref.visible && pref.card.length > 0) {
		// 				Zotero.debug(`zotcard@push ${type}`)
		// 				items.push({
		// 					id: type,
		// 					label: pref.label,
		// 					value: ''
		// 				})
		// 			}
		// 		}.bind(this)

		// 		pushPref(io.dataIn.items, 'quotes')
		// 		pushPref(io.dataIn.items, 'concept')
		// 		pushPref(io.dataIn.items, 'character')
		// 		pushPref(io.dataIn.items, 'not_commonsense')
		// 		pushPref(io.dataIn.items, 'skill')
		// 		pushPref(io.dataIn.items, 'structure')
		// 		pushPref(io.dataIn.items, 'abstract')
		// 		pushPref(io.dataIn.items, 'general')

		// 		let quantity = Zotero.ZotCard.Cards.initPrefs('card_quantity')
		// 		Zotero.debug(`zotcard@card_quantity ${quantity}`)
		// 		for (let index = 0; index < quantity; index++) {
		// 			let name = `card${index + 1}`
		// 			Zotero.debug(`zotcard@push ${name}`)
		// 			pushPref(io.dataIn.items, name)
		// 		}

		// 		Zotero.debug(`zotcard@openDialog`)
		// 		window.openDialog('chrome://zoterozotcard/content/batchnewcard.xul', 'batchnewcard', 'chrome,modal,centerscreen,scrollbars', io)
		// 		if (io.dataOut) {
		// 			var _this = this
		// 			io.dataOut.forEach(async function (element) {
		// 				Zotero.debug('uRead@element: ' + element)
		// 				for (let index = 0; index < element.value; index++) {
		// 					_this.newCardByCollection(element.id)
		// 				}
		// 			})
		// 		}
		// 	}.bind(this)
		// 	let menuseparator = Zotero.getMainWindow().document.createElement('menuseparator');
		// 	menuseparator.setAttribute('id', `zotcard-tb-note-add-batch-menuseparator`)
		// 	Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').firstChild.append(menuseparator)
		// 	Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').firstChild.append(menuitem)
		// }
	},

	initNoteLineHeight() {
		if (!Zotero.getMainWindow().document.getElementById('note-line-heigth-menu')) {
			let menu = Zotero.getMainWindow().document.createElement('menu')
			menu.setAttribute('id', 'note-line-heigth-menu')
			menu.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.notelinespacing'))
			let menupopup = Zotero.getMainWindow().document.createElement('menupopup')
			menu.append(menupopup)
			let menuitem1 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem1.setAttribute('type', 'checkbox')
			menuitem1.setAttribute('label', '1')
			menuitem1.setAttribute('line-height', '1')
			menuitem1.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1")')
			menupopup.append(menuitem1)
			let menuitem12 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem12.setAttribute('type', 'checkbox')
			menuitem12.setAttribute('label', '1.2')
			menuitem12.setAttribute('line-height', '1.2')
			menuitem12.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.2")')
			menupopup.append(menuitem12)
			let menuitem14 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem14.setAttribute('type', 'checkbox')
			menuitem14.setAttribute('label', '1.4')
			menuitem14.setAttribute('line-height', '1.4')
			menuitem14.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.4")')
			menupopup.append(menuitem14)
			let menuitem16 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem16.setAttribute('type', 'checkbox')
			menuitem16.setAttribute('label', '1.6')
			menuitem16.setAttribute('line-height', '1.6')
			menuitem16.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.6")')
			menupopup.append(menuitem16)
			let menuitem18 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem18.setAttribute('type', 'checkbox')
			menuitem18.setAttribute('label', '1.8')
			menuitem18.setAttribute('line-height', '1.8')
			menuitem18.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("1.8")')
			menupopup.append(menuitem18)
			let menuitem2 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem2.setAttribute('type', 'checkbox')
			menuitem2.setAttribute('label', '2')
			menuitem2.setAttribute('line-height', '2')
			menuitem2.setAttribute('oncommand', 'Zotero.ZotCard.noteLineHeight("2")')
			menupopup.append(menuitem2)
			Zotero.getMainWindow().document.getElementById('note-font-size-menu').after(menu)

			this.refreshLineHeigthMenuItemChecked()
		}
	},

	initNoteParagraphSpacing() {
		if (!Zotero.getMainWindow().document.getElementById('note-paragraph-spacing-menu')) {
			let menu = Zotero.getMainWindow().document.createElement('menu')
			menu.setAttribute('id', 'note-paragraph-spacing-menu')
			menu.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.noteparagraphspacing'))
			let menupopup = Zotero.getMainWindow().document.createElement('menupopup')
			menu.append(menupopup)
			let menuitem0 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem0.setAttribute('type', 'checkbox')
			menuitem0.setAttribute('label', '3')
			menuitem0.setAttribute('paragraph-spacing', '3')
			menuitem0.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("3")')
			menupopup.append(menuitem0)
			menuitem0 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem0.setAttribute('type', 'checkbox')
			menuitem0.setAttribute('label', '5')
			menuitem0.setAttribute('paragraph-spacing', '5')
			menuitem0.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("5")')
			menupopup.append(menuitem0)
			menuitem0 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem0.setAttribute('type', 'checkbox')
			menuitem0.setAttribute('label', '7')
			menuitem0.setAttribute('paragraph-spacing', '7')
			menuitem0.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("7")')
			menupopup.append(menuitem0)
			let menuitem18 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem18.setAttribute('type', 'checkbox')
			menuitem18.setAttribute('label', '9')
			menuitem18.setAttribute('paragraph-spacing', '9')
			menuitem18.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("9")')
			menupopup.append(menuitem18)
			let menuitem2 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem2.setAttribute('type', 'checkbox')
			menuitem2.setAttribute('label', '11')
			menuitem2.setAttribute('paragraph-spacing', '11')
			menuitem2.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("11")')
			menupopup.append(menuitem2)
			let menuitem13 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem13.setAttribute('type', 'checkbox')
			menuitem13.setAttribute('label', '13')
			menuitem13.setAttribute('paragraph-spacing', '13')
			menuitem13.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("13")')
			menupopup.append(menuitem13)
			let menuitem1 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem1.setAttribute('type', 'checkbox')
			menuitem1.setAttribute('label', '15')
			menuitem1.setAttribute('paragraph-spacing', '15')
			menuitem1.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("15")')
			menupopup.append(menuitem1)
			let menuitem12 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem12.setAttribute('type', 'checkbox')
			menuitem12.setAttribute('label', '17')
			menuitem12.setAttribute('paragraph-spacing', '17')
			menuitem12.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("17")')
			menupopup.append(menuitem12)
			let menuitem14 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem14.setAttribute('type', 'checkbox')
			menuitem14.setAttribute('label', '19')
			menuitem14.setAttribute('paragraph-spacing', '19')
			menuitem14.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("19")')
			menupopup.append(menuitem14)
			let menuitem16 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem16.setAttribute('type', 'checkbox')
			menuitem16.setAttribute('label', '21')
			menuitem16.setAttribute('paragraph-spacing', '21')
			menuitem16.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("21")')
			menupopup.append(menuitem16)
			let menuitem15 = Zotero.getMainWindow().document.createElement('menuitem')
			menuitem15.setAttribute('type', 'checkbox')
			menuitem15.setAttribute('label', '默认')
			menuitem15.setAttribute('paragraph-spacing', '')
			menuitem15.setAttribute('oncommand', 'Zotero.ZotCard.noteParagraphSpacing("")')
			menupopup.append(menuitem15)
			Zotero.getMainWindow().document.getElementById('note-line-heigth-menu').after(menu)

			this.refreshParagraphSpacingMenuItemChecked()
		}
	},

	initDefCardMenu(type, pane) {
		let pref = Zotero.ZotCard.Cards.initPrefs(type)
		Zotero.ZotCard.Logger.log('pane: ' + pane + ', type:' + type)
		let quotes = Zotero.getMainWindow().document.getElementById(pane ? `context-pane-add-child-note-button-popup-zotcard-${type}` : `zotero-itemmenu-zotcard-${type}`)
		if (pane) {
			quotes.hidden = !pref.visible
		} else {
			quotes.hidden = quotes.hidden ? quotes.hidden : !pref.visible
		}
		quotes.setAttribute('label', pref.label)
	},

	initStandDefCardMenu(type) {
		Zotero.ZotCard.Logger.log(type);
		let pref = Zotero.ZotCard.Cards.initPrefs(type);
		if (!Zotero.getMainWindow().document.getElementById(`zotcard-tb-note-add-${type}`)) {
			Zotero.ZotCard.Logger.log(Zotero.ZotCard.Utils.getString('zotcard-newstandalone', {name: pref.label}));
			let menuitem = Zotero.ZotCard.Doms.createXULElement(Zotero.getMainWindow().document, 'menuitem', {
				id: `zotcard-tb-note-add-${type}`,
				attrs: {
					'label': Zotero.ZotCard.Utils.getString('zotcard-newstandalone', {name: pref.label})
				},
				command: () => {
					this.newCardByCollection(type)
				},
				parent: Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').querySelector('menupopup')
			});
			menuitem.hidden = !pref.visible
		}
	},

	reset() {
		if (Zotero.ZotCard.Utils.confirm(Zotero.ZotCard.Utils.getString('zotcard.resetconfig'))) {
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

			this.resetCard(1)

			Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.resetsuccessful'))
			Zotero.Utilities.Internal.quit(true)
		}
	},

	async newCardByCollection(name) {
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection()
		if (!collection) {
			Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.selectcollection'))
		}

		let note = new Zotero.Item('note')
		note.addToCollection(collection.id)
		note.libraryID = Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID()
		let noteContent = await Zotero.ZotCard.Cards.newCard(collection, undefined, name, undefined)
		note.setNote(noteContent)
		let itemID = await note.saveTx()
		Zotero.getMainWindow().ZoteroPane.selectItem(itemID)
		Zotero.getMainWindow().document.getElementById('zotero-note-editor').focus()
		return itemID
	},

	quotes(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'quotes', true)
		} else {
			this.newCardByItem(window, 'quotes')
		}
	},

	concept(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'concept', true)
		} else {
			this.newCardByItem(window, 'concept')
		}
	},

	character(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'character', true)
		} else {
			this.newCardByItem(window, 'character')
		}
	},

	not_commonsense(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'not_commonsense', true)
		} else {
			this.newCardByItem(window, 'not_commonsense')
		}
	},

	skill(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'skill', true)
		} else {
			this.newCardByItem(window, 'skill')
		}
	},

	structure(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'structure', true)
		} else {
			this.newCardByItem(window, 'structure')
		}
	},
  
  
  general(window, pane) {
		if (pane) {
			this.newCardByPane(window, 'general', true)
		} else {
			this.newCardByItem(window, 'general')
		}
	},

	readcard() {
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Utils.warning(Utils.getString('zotcard.only_note'))
			return
		}

		this.showReadCard(zitems, Zotero.ZotCard.Utils.getString('zotcard.yourchoice'))
	},

	recentlyMoveToCollectionPopup(event) {
		Zotero.debug('zotcard@recentlyMoveToCollectionPopup...')
		let recentlypopup = Zotero.getMainWindow().document.getElementById('zotero-itemmenu-zotcard-recently-move-to-collection-popup')
		while (recentlypopup.childElementCount > 0) {
			recentlypopup.removeChild(recentlypopup.lastElementChild)
		}

		let recently_move_collections = Zotero.Prefs.get('zotcard.config.recently_move_collections')
		if (recently_move_collections && recently_move_collections.length > 0) {
			let recentlyMoveCollections = recently_move_collections.split(',')

			recentlyMoveCollections.reverse().forEach(collectionid => {
				let menuitem = Zotero.getMainWindow().document.createElement('menuitem')
				menuitem.setAttribute('id', 'zotero-itemmenu-zotcard-recently-move-to-collection-popup-' + collectionid)
				menuitem.setAttribute('collectionid', collectionid)
				menuitem.setAttribute('label', Zotero.getMainWindow().Zotero.ZotCard.Utils.showPath(collectionid))
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
						let recentlyMoveCollectionQuantity = Zotero.Prefs.get('zotcard.config.recently_move_collection_quantity')
						let recently_move_collections = Zotero.Prefs.get('zotcard.config.recently_move_collections')
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
			popup.append(menuItem)
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

	readcollectioncard() {
		let selectedCollection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection()
		let selectedSavedSearch = Zotero.getMainWindow().ZoteroPane.getSelectedSavedSearch()

		Zotero.showZoteroPaneProgressMeter(Zotero.ZotCard.Utils.getString('zotcard.loding'))
		let callback = (ids, name) => {
			var items = Zotero.Items.get(ids)
			Zotero.debug(`搜索到：${items.length}`)
			var cards = []
			var options = {}
			for (let index = 0; index < items.length; index++) {
				const item = items[index]
				if (!item.isNote()) {
					Zotero.debug(`跳过统计。`)
					continue
				}

				let noteTitle = item.getNoteTitle()

				if (['目录', '豆瓣短评', '初步评价'].includes(noteTitle)) {
					Zotero.debug(`${noteTitle}跳过统计。`)
					continue
				}
				let cardItem = Zotero.ZotCard.Utils.toCardItem(item)
				cards.push(cardItem)
				options = Zotero.ZotCard.Utils.refreshOptions(cardItem, options)
				Zotero.updateZoteroPaneProgressMeter((index + 1) / items.length)
			}

			Zotero.hideZoteroPaneOverlays()
			if (cards.length > 0) {
				let options = Zotero.ZotCard.Utils.bulidOptions(cards)
				let io = {
					dataIn: {
						title: name,
						cards: cards,
						options: options
					}
				}

				Zotero.getMainWindow().Zotero.ZotCard.read = io
				Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer(Zotero.locale.startsWith('zh') ? 'chrome://zoterozotcard/content/read.html' : 'chrome://zoterozotcard/content/read_en.html')
			} else {
				Zotero.ZotCard.Utils.error(Zotero.ZotCard.Utils.getString('zotcard.nocard'))
			}
		}

		Zotero.ZotCard.CardSearcher.search(Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID(), selectedCollection, selectedSavedSearch, callback)
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

	showReadCard(items, title) {
		Zotero.showZoteroPaneProgressMeter(Zotero.ZotCard.Utils.getString('zotcard.loding'))
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
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
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
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
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
				noteContent = `<div data-schema-version="8" cardlink="${Zotero.ZotCard.Utils.getZoteroItemUrl(zitem.key)}">${noteContent}</div>`
			} else {
				let doc = new DOMParser().parseFromString(noteContent, 'text/html')
				doc.body.children[0].setAttribute('cardlink', Zotero.ZotCard.Utils.getZoteroItemUrl(zitem.key))
				noteContent = doc.body.innerHTML
			}
			notes += noteContent + '<br class="card-separator" /><br class="card-separator" />'
		}
		if (!Zotero.ZotCard.Utils.copyHtmlToClipboard(notes)) {
			Zotero.ZotCard.Utils.error(Zotero.ZotCard.Utils.getString('zotcard.readcard.copythefailure'))
		} else {
			Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.readcard.copysucceededcount', zitems.length))
		}
	},

	copyandcreate() {
		ZoteroPane_Local.duplicateSelectedItem()
	},

	open() {
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
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
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
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
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
			return
		}
		if (zitems.length !== 1) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
			return
		}

		let tinifyApiKey = Zotero.Prefs.get('zotcard.config.tinify_api_key')
		if (!tinifyApiKey) {
			Zotero.Prefs.set('zotcard.config.tinify_api_key', '')
			Zotero.ZotCard.Utils.warning(Utils.getString('zotcard.configuretinypng'))
			Zotero.openInViewer(`about:config?filter=zotero.zotcard.config.tinify_api_key`)
			return
		}
		let compressWithWidthAndHeight = Zotero.Prefs.get('zotcard.config.compress_with_width_and_height')
		if (!compressWithWidthAndHeight) {
			compressWithWidthAndHeight = false
			Zotero.Prefs.set('zotcard.config.compress_with_width_and_height', compressWithWidthAndHeight)
		}

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
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
			return
		}

		var ids = zitems.map(e => e.id)
		Zotero.getMainWindow().Zotero.ZotCard.Utils.openInViewer('chrome://zoterozotcard/content/cardcontent.html?ids=' + ids.join(','))
	},

	async copylink() {
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
			return
		}
		if (zitems.length !== 1) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
			return
		}

		var zitem = zitems[0]
		var link = Zotero.ZotCard.Utils.getZoteroItemUrl(zitem.key)
		//Zotero.ZotCard.Utils.copyTextToClipboard(link)
		Zotero.ZotCard.Utils.copyHtmlTextToClipboard(`<a href="${link}">${zitem.getNoteTitle()}</>`, link)
	},
  
  
  async notesourcecode() {
		var zitems = Zotero.ZotCard.Utils.getSelectedItems(['note'])
		if (!zitems || zitems.length <= 0) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
			return
		}
		if (zitems.length !== 1) {
			Zotero.ZotCard.Utils.error(Utils.getString('zotcard.only_note'))
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

		//   Zotero.ZotCard.Utils.warning(`${Zotero.ZotCard.Utils.getString('zotcard.aboutconfig')}
		//   ${Zotero.ZotCard.Utils.getString('zotcard.default')}：
		//   zotcard.abstract\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.abstractcard')}
		//   zotcard.quotes\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.quotescard')}
		//   zotcard.concept\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.conceptcard')}
		//   zotcard.character\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.personagecard')}
		//   zotcard.not_commonsense\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.uncommonsensecard')}
		//   zotcard.skill\t\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.skillcard')}
		//   zotcard.structure\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.structurecard')}
		//   zotcard.general\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.essaycard')}

		// ${Zotero.ZotCard.Utils.getString('zotcard.custom')}：
		//   zotcard.card_quantity\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.customizecards')}
		//   zotcard.card1\t\t\t\t\t\t${Zotero.ZotCard.Utils.getString('zotcard.cardtemplate')}
		//   ...

		//   ${Zotero.ZotCard.Utils.getString('zotcard.visitwebsite')}: https://github.com/018/zotcard`)

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
				Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.backupsucceeded'))
			}
		}.bind(this))
	},

	restore() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
		fp.init(window, Zotero.ZotCard.Utils.getString('zotcard.restore'), Ci.nsIFilePicker.modeOpen)
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
								let name = `card${index + 1}`
								if (!json[name]) {
									Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.restorefailed'))
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
								let name = `card${index + 1}`
								let pref = json[name]
								if (pref) {
									Zotero.Prefs.set(`zotcard.${name}`, pref.card)
									Zotero.Prefs.set(`zotcard.${name}.label`, pref.label)
									Zotero.Prefs.set(`zotcard.${name}.visible`, pref.visible)
								}
							}
							this.resetCard(index + 1)
							Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.restoresucceeded') + json.last_updated)
						} else {
							Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.contentcorrupted'))
						}
					} catch (e) {
						Zotero.ZotCard.Utils.warning(e)
					}
				} else {
					Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.filenocontent'))
				}
			}
		}.bind(this))
	},

	transitionstyle() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker)
		fp.init(window, Zotero.ZotCard.Utils.getString('zotcard.restore'), Ci.nsIFilePicker.modeOpen)
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

							Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.changingsucceeded') + json.last_updated)
						} else {
							Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.contentcorrupted'))
						}
					} catch (e) {
						Zotero.ZotCard.Utils.warning(e)
					}
				} else {
					Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.filenocontent'))
				}
			}
		}.bind(this))
	},

	resetCard(index) {
		let val = Zotero.Prefs.get(`zotcard.card${index}.visible`)
		while (val) {
			Zotero.Prefs.clear(`zotcard.card${index}`)
			Zotero.Prefs.clear(`zotcard.card${index}.label`)
			Zotero.Prefs.clear(`zotcard.card${index}.visible`)

			index++
			val = Zotero.Prefs.get(`zotcard.card${index}.visible`)
		}
	},

	effectNoteCss() {
		let fontSize = Zotero.Prefs.get('note.fontSize')
		// Fix empty old font prefs before a value was enforced
		if (fontSize < 6) {
			fontSize = 11;
		}
		var css = 'body#zotero-tinymce-note, '
			+ 'body#zotero-tinymce-note p, '
			+ 'body#zotero-tinymce-note th, '
			+ 'body#zotero-tinymce-note td, '
			+ 'body#zotero-tinymce-note pre { '
			+ 'font-size: ' + fontSize + 'px; '
			+ '} '
			+ 'body#zotero-tinymce-note, '
			+ 'body#zotero-tinymce-note p { '
			+ 'font-family: '
			+ Zotero.Prefs.get('note.fontFamily') + '; '
			+ '} '
			+ Zotero.Prefs.get('note.css')

		var editor = Zotero.getMainWindow().document.getElementById('zotero-note-editor').noteField._editor
		if (editor) {
			var doc = editor.contentDocument
			var head = doc.getElementsByTagName('head')[0]
			var style = doc.createElement('style')
			style.innerHTML = css
			head.appendChild(style)
		}
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

	noteLineHeight(height) {
		Zotero.debug(`height = ${height}`)
		let val = Zotero.Prefs.get('note.css')
		if (val) {
			if (height) {
				if (val.match(/body +{ line-height: .*?; }/g)) {
					val = val.replace(/line-height: (.*?);/, `line-height: ${height};`)
				} else {
					val += ` body { line-height: ${height}; }`
				}
			} else {
				val = val.replace(/body +{ line-height: .*?; }/g, '')
			}
		} else {
			if (height) {
				val = `body { line-height: ${height}; }`
			}
		}
		Zotero.debug(`note.css = ${val}`)
		Zotero.Prefs.set('note.css', val)

		this.refreshLineHeigthMenuItemChecked()
		this.effectNoteCss()
	},

	getNoteLineHeight() {
		let val = Zotero.Prefs.get('note.css')
		if (val) {
			let match = val.match(/body +{ line-height: (.*?); }/)
			if (match) {
				return match[1].split(';')[0]
			}
		}
		return '1'
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

	noteParagraphSpacing(paragraphSpacing) {
		Zotero.debug(`paragraphSpacing = ${paragraphSpacing}`)
		let val = Zotero.Prefs.get('note.css')
		if (val) {
			if (paragraphSpacing) {
				if (val.match(/p +{ padding: 0; margin: (\d*)px 0; }/g)) {
					val = val.replace(/p +{ padding: 0; margin: (\d*)px 0; }/, `p { padding: 0; margin: ${paragraphSpacing}px 0; }`)
				} else {
					val += ` p { padding: 0; margin: ${paragraphSpacing}px 0; }`
				}
			} else {
				val = val.replace(/p +{ padding: 0; margin: (\d*)px 0; }/g, '')
			}
		} else {
			if (paragraphSpacing) {
				val = `p { padding: 0; margin: ${paragraphSpacing}px 0; }`
			}
		}
		Zotero.debug(`note.css = ${val}`)
		Zotero.Prefs.set('note.css', val)

		this.refreshParagraphSpacingMenuItemChecked()
		this.effectNoteCss()
	},

	getNoteParagraphSpacing() {
		let val = Zotero.Prefs.get('note.css')
		if (val) {
			let match = val.match(/p +{ padding: 0; margin: (\d*)px 0; }/)
			if (match) {
				return match[1].split(';')[0]
			}
		}
		return ''
	},

	noteBGColor(color) {
		let val = Zotero.Prefs.get('note.css')
		if (val) {
			if (color) {
				if (val.match(/body +{ background-color: .*?; }/g)) {
					val = val.replace(/background-color: (.*?);/, `background-color: ${color};`)
				} else {
					val += ` body { background-color: ${color}; }`
				}
			} else {
				val = val.replace(/body +{ background-color: .*?; }/g, '')
			}
		} else {
			if (color) {
				val = `body { background-color: ${color}; }`
			}
		}
		Zotero.Prefs.set('note.css', val)

		this.effectNoteCss()
	},

	resetNoteBGColor() {
		this.noteBGColor()
		Zotero.ZotCard.Utils.promptForRestart(Zotero.ZotCard.Utils.getString('zotcard.resetnotebackground'))
	},

	darkNoteBGColor() {
		this.noteBGColor('#5E5E5E')
	},

	grayNoteBGColor() {
		this.noteBGColor('#F5F5F5')
	},

	yellowNoteBGColor() {
		this.noteBGColor('#EFEB93')
	},

	blueNoteBGColor() {
		this.noteBGColor('#D3DEF3')
	},

	brownNoteBGColor() {
		this.noteBGColor('#B49D84')
	},

	pinkNoteBGColor() {
		this.noteBGColor('#DCADA5')
	},

	cyanNoteBGColor() {
		this.noteBGColor('#A8B799')
	},

	purpleNoteBGColor() {
		this.noteBGColor('#C0ADC5')
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
		this.addedElementIDs.push(elem.id);
	},

	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="zotcard.ftl"]').remove();
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

		if (Zotero.ZotCard.Utils.version() >= 6) {
			Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.removeListener(this.itemsTreeOnSelect);
		} else {
			Zotero.getMainWindow().document.getElementById('zotero-items-tree').removeEventListener('select', this.itemsTreeOnSelect.bind(this), false);
		}

		Zotero.getMainWindow().document.getElementById('zotero-note-editor').removeEventListener('keyup', this.noteEditorOnKeyup.bind(this), false);
		Zotero.getMainWindow().document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', this.refreshZoteroItemPopup.bind(this), false);
		Zotero.getMainWindow().document.getElementById('context-pane-add-child-note-button-popup').removeEventListener('popupshowing', this.refreshZoteroPanePopup.bind(this), false);
	},

	async main() {
		// Global properties are included automatically in Zotero 7
		var host = new URL('https://github.com/018/zotcard').host;
		Zotero.ZotCard.Logger.log(`Host is ${host}`);

		// Retrieve a global pref
		Zotero.ZotCard.Logger.log(`Intensity is ${Zotero.Prefs.get('extensions.make-it-red.intensity', true)}`);
	},
});