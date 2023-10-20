const { createApp, ref, reactive, toRaw } = Vue
const { ElLoading } = ElementPlus

window.onload = function() {
	const isDev = !window.Zotero;
	const _l10n =  isDev ? undefined : new Localization(["zotcard-preferences.ftl"], true);
	const defCards = isDev ? ['a', 'b'] : Zotero.ZotCard.Consts.defCardTypes;

	async function _buildPreview(template) {
		if (template) {
			var items = Zotero.ZotCard.Items.getSelectedItems('regular');
			let item;
			if (!items || items.length <= 0) {      
				let allitems = (await Zotero.Items.getAll(Zotero.Libraries.userLibraryID, true));
				for (let index = 0; index < allitems.length; index++) {
					const e = allitems[index];
					if (e.isRegularItem()) {
						item = e;
						break;
					}
				}
			} else {
				item = items[0];
			}

			if (item) {
				let collection =item.getCollections().length > 0 ? Zotero.Collections.get(item.getCollections()[0]) : undefined;
				let noteContent = await Zotero.ZotCard.Cards.newCardWithTemplate(collection, item, template, undefined);
				return noteContent;
			}
		}
	}

	function _insertPrefixSuffix(textarea, prefix, suffix) {
		let selectionStart = textarea.selectionStart;
		let selectionEnd = textarea.selectionEnd;
		let start = textarea.value.substring(0, selectionStart);
		let end = textarea.value.substring(selectionEnd);
		let selection = textarea.value.substring(selectionStart, selectionEnd);
		textarea.value = start + prefix + selection + suffix + end;
		textarea.selectionStart = selectionStart + prefix.length;
		textarea.selectionEnd = textarea.selectionStart + selection.length;
		textarea.focus();
		return textarea.value;
	}

	function _insertContent(textarea, val) {
		let selectionStart = textarea.selectionStart;
		let selectionEnd = textarea.selectionEnd;
		let start = textarea.value.substring(0, selectionStart);
		let end = textarea.value.substring(selectionEnd);
		textarea.value = start + val + end;
		textarea.selectionStart = selectionStart;
		textarea.selectionEnd = selectionStart + val.length;
		textarea.focus();
		return textarea.value;
	}

	// const app = createApp({
	// 	setup() {
	// 		const curCards = reactive([]);
	// 		const datas = reactive([]);
	// 		const prefs = reactive({
	// 			card_quantity: isDev ? 0 : Zotero.Prefs.get('zotcard.card_quantity'),
	// 			note_background_color: isDev ? '' : Zotero.ZotCard.Notes.getNoteBGColor(),
	// 			startOfWeek: isDev ? 0 : Zotero.Prefs.get('zotcard.startOfWeek'),
	// 			recently_move_collection_quantity: isDev ? 0 : Zotero.Prefs.get('zotcard.config.recently_move_collection_quantity'),
	// 		})
	// 		const preview = ref('');
	// 		const position = ref(-1);
	// 		const searchField = ref('');
	// 		const chars = reactive([{
	// 			name: '<', value: '&amp;lt;'
	// 		}, {
	// 			name: '>', value: '&amp;gt;'
	// 		}, {
	// 			name: '<space>', value: '&amp;nbsp;'
	// 		}, {
	// 			name: '&', value: '&amp;amp;'
	// 		}, {
	// 			name: '"', value: '&amp;quot;'
	// 		}, {
	// 			name: '\'', value: '&amp;apos;'
	// 		}, {
	// 			name: isDev ? '换行' : _l10n.formatValueSync('zotcard-preferences-line'), value: '<br/>'
	// 		}, {
	// 			name: isDev ? '分割线' :  _l10n.formatValueSync('zotcard-preferences-parting'), value: '<hr/>'
	// 		}]);
	// 		const emojis = reactive([])
	// 		const fields = reactive([])
	// 		const popover = reactive({
	// 			chars: false,
	// 			emojis: false,
	// 			fields: false
	// 		});

	// 		const _loadDatas = (quantity) => {
	// 			curCards.splice(0, curCards.length);
	// 			datas.splice(0, datas.length);

	// 			for (let index = 0; index < quantity; index++) {
	// 				curCards.push('card' + (index + 1))
	// 			}

	// 			[...defCards].forEach(element => {
	// 				// { card: card, label: label, visible: visible }
	// 				var card = isDev ? {
	// 					card: '11',
	// 					label: element,
	// 					default: 1,
	// 					visible: false
	// 				} : Zotero.ZotCard.Cards.initPrefs(element);
	// 				datas.push({
	// 					type: element,
	// 					default: 1,
	// 					card: card
	// 				});
	// 			});

	// 			[...curCards].forEach(element => {
	// 				// { card: card, label: label, visible: visible }
	// 				var card = isDev ? {
	// 					card: '11',
	// 					label: element,
	// 					default: 0,
	// 					visible: false
	// 				} : Zotero.ZotCard.Cards.initPrefs(element);
	// 				datas.push({
	// 					type: element,
	// 					default: 0,
	// 					card: card
	// 				});
	// 			});
	// 		}

	// 		const _init = () => {
	// 			isDev || Zotero.Prefs.registerObserver('zotcard.card_quantity', function () {
	// 				var quantity = Zotero.Prefs.get('zotcard.card_quantity');
	// 				_loadDatas(quantity);
	// 			})

	// 			var quantity = isDev ? 1 : Zotero.Prefs.get('zotcard.card_quantity');
	// 			_loadDatas(quantity);

	// 			_buildPreview(datas[0].card.card).then(e => {
	// 				preview.value = e;
	// 			});
	// 		}

	// 		const handleMenuOpen = async (index) => {
	// 			position.value = index;
	// 			preview.value = await _buildPreview(datas[position.value].card.card);
	// 		}

	// 		const handlePrefsInput = (pref, value) => {
	// 			var goon = true;
	// 			switch (pref) {
	// 				case 'card_quantity':
						
	// 					break;
	// 				case 'note_background_color':
	// 					goon = false;
	// 					Zotero.ZotCard.Notes.noteBGColor(value);
	// 					break;
				
	// 				default:
	// 					break;
	// 			}

	// 			if (goon) {
	// 				Zotero.Prefs.set(`zotcard.${pref}`, value);
	// 			}
	// 		}

	// 		const handleNoteBackgroundColorResetDefault = () => {
	// 			Zotero.ZotCard.Notes.noteBGColor();
	// 			prefs.note_background_color = '';
	// 		}

	// 		const handleTemplateInput = async () => {
	// 			let template = datas[position.value].card.card;
	// 			preview.value = await _buildPreview(template);
	// 			Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
	// 		};

	// 		const handleTemplateFocus = () => {
	// 			popover.chars = false;
	// 			popover.fields = false;
	// 			popover.emojis = false;
	// 		}

	// 		const handleVisibleChange = () => {
	// 			Zotero.Prefs.set(`zotcard.${datas[position.value].type}.visible`, datas[position.value].card.visible);
	// 		};

	// 		const handleLabelInput = () => {
	// 			Zotero.Prefs.set(`zotcard.${datas[position.value].type}.label`, datas[position.value].card.label);
	// 		};

	// 		const handlePreview = async () => {
	// 			preview.value = await _buildPreview(datas[position.value].card.card);
	// 		};

	// 		const handleResetDefault = async () => {
	// 			if (Zotero.ZotCard.Messages.confirm(_l10n.formatValueSync('zotcard-reset-default'))) {
	// 				var template;
	// 				if (Object.hasOwnProperty.call(Zotero.ZotCard.Cards, datas[position.value].type)) {
	// 					template = Zotero.ZotCard.Cards[datas[position.value].type].default;
	// 				} else {
	// 					template = '';
	// 				}
	// 				preview.value = await _buildPreview(template);
	// 				Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
	// 				datas[position.value].card.card = template;
	// 			}
	// 		}

	// 		const handleToRSS = () => {
	// 			Zotero.launchURL('https://github.com/018/zotcard/discussions/2');
	// 		}

	// 		const handleStyles = async (type, param) => {
	// 			let textarea = window.document.querySelector('.template textarea');
	// 			let template;
	// 			switch (type) {
	// 				case 'B':
	// 					template = _insertPrefixSuffix(textarea, '<strong>', '</strong>');
	// 					break;
	// 				case 'I':
	// 					template = _insertPrefixSuffix(textarea, '<em>', '</em>');
	// 					break;
	// 				case 'U':
	// 					template = _insertPrefixSuffix(textarea, '<u>', '</u>');
	// 					break;
	// 				case 'S':
	// 					template = _insertPrefixSuffix(textarea, '<span style="text-decoration: line-through">', '</span>');
	// 					break;
	// 				case 'h1':
	// 					template = _insertPrefixSuffix(textarea, '<h1>', '</h1>');
	// 					break;
	// 				case 'h2':
	// 					template = _insertPrefixSuffix(textarea, '<h2>', '</h2>');
	// 					break;
	// 				case 'h3':
	// 					template = _insertPrefixSuffix(textarea, '<h3>', '</h3>');
	// 					break;
	// 				case 'p':
	// 					template = _insertPrefixSuffix(textarea, '<p>', '</p>');
	// 					break;
	// 				case 'pre':
	// 					template = _insertPrefixSuffix(textarea, '<pre>', '</pre>');
	// 					break;
	// 				case 'blockquote':
	// 					template = _insertPrefixSuffix(textarea, '<blockquote>', '</blockquote>');
	// 					break;
	// 				case 'left':
	// 					template = _insertPrefixSuffix(textarea, '<p style="text-align: left">', '</p>');
	// 					break;
	// 				case 'center':
	// 					template = _insertPrefixSuffix(textarea, '<p style="text-align: center">', '</p>');
	// 					break;
	// 				case 'right':
	// 					template = _insertPrefixSuffix(textarea, '<p style="text-align: right">', '</p>');
	// 					break;
	// 				case 'color':
	// 					template = _insertPrefixSuffix(textarea, '<span style="color: ' + param + '">', '</span>');
	// 					break;
	// 				case 'background-color':
	// 					template = _insertPrefixSuffix(textarea, '<span style="background-color: ' + param + '">', '</span>');
	// 					break;
	// 				default:
	// 					break;
	// 			}

	// 			if (template) {
	// 				datas[position.value].card.card = template;
	// 				preview.value = await _buildPreview(template);
	// 				Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
	// 			}
	// 		}

	// 		function handleFontColor(event) {
	// 			window.document.getElementById('font-color-picker').querySelector('.el-color-picker__trigger').click();
	// 		}

	// 		function handleFontColorChange(value) {
	// 			if (value) {
	// 				handleStyles('color', value);
	// 			}
	// 			window.document.querySelector('.template textarea').focus();
	// 		}

	// 		function handleBackgroundColor(event) {
	// 			window.document.getElementById('background-color-picker').querySelector('.el-color-picker__trigger').click();
	// 		}

	// 		function handleBackgroundColorChange(value) {
	// 			if (value) {
	// 				handleStyles('background-color', value);
	// 			}
	// 			window.document.querySelector('.template textarea').focus();
	// 		}

	// 		async function _handleInsertContent(value) {
	// 			let textarea = window.document.querySelector('.template textarea');
	// 			let template = _insertContent(textarea, value);
	// 			if (template) {
	// 				datas[position.value].card.card = template;
	// 				preview.value = await _buildPreview(template);
	// 				Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
	// 			}
	// 		}

	// 		async function handleSChars(value) {
	// 			_handleInsertContent(value);
	// 		}

	// 		async function handleEmojis(value) {
	// 			popover.emojis = false;
	// 			_handleInsertContent(value);
	// 		}

	// 		async function handleFileds(value) {
	// 			popover.fields = false;
	// 			_handleInsertContent(value);
	// 		}
			
	// 		function handleShowCharsPopover() {
	// 			popover.chars = !popover.chars;
	// 			if (popover.chars) {
	// 				popover.fields = false;
	// 				popover.emojis = false;
	// 			}
	// 		}

	// 		function handleShowEmojisPopover() {
	// 			popover.emojis = !popover.emojis;
				
	// 			if (popover.emojis) {
	// 				popover.fields = false;
	// 				popover.chars = false;
	// 				if (emojis.length === 0) {
	// 					emojis.push({
	// 						name: '😀',
	// 						values: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🫣', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😶‍🌫️', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '🫤', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '🥹', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊']
	// 					}, {
	// 						name: '💘',
	// 						values: ['💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤']
	// 					}, {
	// 						name: '🙎',
	// 						values: ['👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '🫦', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '🧔‍♂️', '🧔‍♀️', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🧑‍🦱', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🧑‍🌾', '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🎤', '👨‍🎤', '👩‍🎤', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍✈️', '👨‍✈️', '👩‍✈️', '🧑‍🚀', '👨‍🚀', '👩‍🚀', '🧑‍🚒', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️', '🥷', '👷', '👷‍♂️', '👷‍♀️', '🫅', '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '🤵‍♂️', '🤵‍♀️', '👰', '👰‍♂️', '👰‍♀️', '🤰', '🫃', '🫄', '🤱', '👩‍🍼', '👨‍🍼', '🧑‍🍼', '👼', '🎅', '🤶', '🧑‍🎄', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️', '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🧜', '🧜‍♂️', '🧜‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️', '🧞', '🧞‍♂️', '🧞‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '🧌', '💆', '💆‍♂️', '💆‍♀️', '💇', '💇‍♂️', '💇‍♀️', '🛀', '🛌', '🧑‍🤝‍🧑', '👭', '👫', '👬', '💏', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👦', '👨‍👦‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👧‍👧', '👩‍👦', '👩‍👦‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👧‍👧', '🗣️', '👤', '👥', '🫂', '👣']
	// 					}, {
	// 						name: '🤾',
	// 						values: ['🚶', '🚶‍♂️', '🚶‍♀️', '🧍', '🧍‍♂️', '🧍‍♀️', '🧎', '🧎‍♂️', '🧎‍♀️', '🧑‍🦯', '👨‍🦯', '👩‍🦯', '🧑‍🦼', '👨‍🦼', '👩‍🦼', '🧑‍🦽', '👨‍🦽', '👩‍🦽', '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', '🕴️', '👯', '👯‍♂️', '👯‍♀️', '🧖', '🧖‍♂️', '🧖‍♀️', '🧗', '🧗‍♂️', '🧗‍♀️', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏄', '🏄‍♂️', '🏄‍♀️', '🚣', '🚣‍♂️', '🚣‍♀️', '🏊', '🏊‍♂️', '🏊‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🚴', '🚴‍♂️', '🚴‍♀️', '🚵', '🚵‍♂️', '🚵‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '🤼', '🤼‍♂️', '🤼‍♀️', '🤽', '🤽‍♂️', '🤽‍♀️', '🤾', '🤾‍♂️', '🤾‍♀️', '🤹', '🤹‍♂️', '🤹‍♀️', '🧘', '🧘‍♂️', '🧘‍♀️']
	// 					}, {
	// 						name: '🦊',
	// 						values: ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐕', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🦫', '🦔', '🦇', '🐻', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🪸', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷', '🕸', '🦂', '🦟', '🪰', '🪱']
	// 					}, {
	// 						name: '🌸',
	// 						values: ['🦠', '💐', '🌸', '💮', '🪷', '🏵', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃', '🪹', '🪺']
	// 					}, {
	// 						name: '🍅',
	// 						values: ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🫘', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽', '🍴', '🥄', '🔪', '🫙', '🏺']
	// 					}, {
	// 						name: '🚗',
	// 						values: ['🌍', '🌎', '🌏', '🌐', '🗺', '🗾', '🧭', '🏔', '⛰', '🌋', '🗻', '🏕', '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🧱', '🪨', '🪵', '🛖', '🏘', '🏚', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙', '🌄', '🌅', '🌆', '🌇', '🌉', '♨', '🎠', '🛝', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎', '🏍', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣', '🛤', '🛢', '⛽', '🛞', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '🛟', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '🛎', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡', '☀', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁', '⛅', '⛈', '🌤', '🌥', '🌦', '🌧', '🌨', '🌩', '🌪', '🌫', '🌬', '🌀', '🌈', '🌂', '☂', '☔', '⛱', '⚡', '❄', '☃', '⛄', '☄', '🔥', '💧', '🌊']
	// 					}, {
	// 						name: '⚽',
	// 						values: ['🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🪬', '🎮', '🕹', '🎰', '🎲', '🧩', '🧸', '🪅', '🪩', '🪆', '♠', '♥', '♦', '♣', '♟', '🃏', '🀄', '🎴', '🎭', '🖼', '🎨', '🧵', '🪡', '🧶', '🪢']
	// 					}, {
	// 						name: '👜',
	// 						values: ['👓', '🕶', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙', '🎚', '🎛', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '📱', '📲', '☎', '📞', '📟', '📠', '🔋', '🪫', '🔌', '💻', '🖥', '🖨', '⌨', '🖱', '🖲', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏', '✒', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨', '🪓', '⛏', '⚒', '🛠', '🗡', '⚔', '🔫', '🪃', '🏹', '🛡', '🪚', '🔧', '🪛', '🔩', '⚙', '🗜', '⚖', '🦯', '🔗', '⛓', '🪝', '🧰', '🧲', '🪜', '⚗', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩼', '🩺', '🩻', '🚪', '🛗', '🪞', '🪟', '🛏', '🛋', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🫧', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰', '🪦', '⚱', '🗿', '🪧', '🪪']
	// 					}, {
	// 						name: '🅰️',
	// 						values: ['🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧️', '✖️', '➕', '➖', '➗', '🟰', '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲']
	// 					}, {
	// 						name: '🇨🇳',
	// 						values: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇳', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺', '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿']
	// 					});
	// 				}
	// 			}
	// 		}

	// 		function handleShowFieldsPopover() {
	// 			popover.fields = !popover.fields;

	// 			if (popover.fields) {
	// 				popover.emojis = false;
	// 				popover.chars = false;
	// 				if (fields.length === 0) {
	// 					fields.push({
	// 						name: 'ZotCard',
	// 						values: [
	// 							{value: '${clipboardText}', name: isDev ? 'clipboardText' : _l10n.formatValueSync('zotcard-preferences-clipboardText')},
	// 							{value: '${today}', name: isDev ? 'today' : _l10n.formatValueSync('zotcard-preferences-today')},
	// 							{value: '${month}', name: isDev ? 'month' : _l10n.formatValueSync('zotcard-preferences-month')},
	// 							{value: '${dayOfYear}', name: isDev ? 'dayOfYear' : _l10n.formatValueSync('zotcard-preferences-dayOfYear')},
	// 							{value: '${weekOfYear}', name: isDev ? 'weekOfYear' : _l10n.formatValueSync('zotcard-preferences-weekOfYear')},
	// 							{value: '${week}', name: '星期几'},
	// 							{value: '${week_en}', name: 'Week(English)'},
	// 							{value: '${now}', name: isDev ? 'now' : _l10n.formatValueSync('zotcard-preferences-now')},
	// 							{value: '${text}', name: isDev ? 'text' : _l10n.formatValueSync('zotcard-preferences-text')},
	// 							{value: '${collectionName}', name: isDev ? 'collectionName' : _l10n.formatValueSync('zotcard-preferences-collectionName')},
	// 							{value: '${itemLink}', name: isDev ? 'itemLink' : _l10n.formatValueSync('zotcard-preferences-itemLink')},
	// 							{value: '${collectionLink}', name: isDev ? 'collectionLink' : _l10n.formatValueSync('zotcard-preferences-collectionLink')},
	// 							{value: '${year}', name: isDev ? 'year' : _l10n.formatValueSync('zotcard-preferences-year')},
	// 							{value: '${tags && tags.length > 0 ? tags.join(\',\') : \'\'}', name: isDev ? 'tags' : _l10n.formatValueSync('zotcard-preferences-tags')}]
	// 					});
	// 					const itemFields =  isDev ? [] : Zotero.ItemFields.getAll().map(element => {
	// 						let value = '${' + element.name + '}';
	// 						let name = (Zotero.ItemFields.getLocalizedString(element.name) + `(${element.name})`) || element.name;
	// 						return {value, name};
	// 					});
	// 					const CreatorTypes = isDev ? [] : Zotero.CreatorTypes.getTypes().map(element => {
	// 						let value = '${' + element.name + 's}';
	// 						let name = (Zotero.CreatorTypes.getLocalizedString(element.name) + `(${element.name}s)`) || element.name;
	// 						return {value, name};
	// 					});
	// 					fields.push({
	// 						name: 'Zotero',
	// 						values: [
	// 							...itemFields,
	// 							...CreatorTypes
	// 						]
	// 					});
	// 				}
	// 			}
	// 		}

	// 		function filterField(values) {
	// 			return values.filter(e => e.name.toLowerCase().includes(searchField.value.toLowerCase()));
	// 		}
			
	// 		_init();

	// 		return {
	// 			datas,
	// 			prefs,
	// 			preview,
	// 			position,
	// 			chars,
	// 			emojis,
	// 			fields,
	// 			popover,
	// 			searchField,
	// 			handleMenuOpen,
	// 			handlePrefsInput,
	// 			handleNoteBackgroundColorResetDefault,
	// 			handleTemplateInput,
	// 			handleTemplateFocus,
	// 			handleVisibleChange,
	// 			handleLabelInput,
	// 			handleResetDefault,
	// 			handleToRSS,
	// 			handleStyles,
	// 			handleFontColor,
	// 			handleFontColorChange,
	// 			handleBackgroundColor,
	// 			handleBackgroundColorChange,
	// 			handleSChars,
	// 			handleEmojis,
	// 			handleFileds,
	// 			handleShowCharsPopover,
	// 			handleShowEmojisPopover,
	// 			handleShowFieldsPopover,
	// 			filterField,
	// 			handlePreview
	// 		}
	// 	}
	// });
	// app.use(ElementPlus, {
	// 	locale: isDev || Zotero.locale === 'zh-CN' ? ElementPlusLocaleZhCn : (Zotero.locale === 'zh-TW' ? ElementPlusLocaleZhTw : ElementPlusLocaleEn),
	//   });
	// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	//   app.component(key, component)
	// }
	// app.mount(document.getElementById('app'));

	createElementPlusApp({
		setup() {
			const curCards = reactive([]);
			const datas = reactive([]);
			const prefs = reactive({
				card_quantity: isDev ? 0 : Zotero.Prefs.get('zotcard.card_quantity'),
				note_background_color: isDev ? '' : Zotero.ZotCard.Notes.getNoteBGColor(),
				startOfWeek: isDev ? 0 : Zotero.Prefs.get('zotcard.startOfWeek'),
				recently_move_collection_quantity: isDev ? 0 : Zotero.Prefs.get('zotcard.config.recently_move_collection_quantity'),
			})
			const preview = ref('');
			const position = ref(-1);
			const searchField = ref('');
			const chars = reactive([{
				name: '<', value: '&amp;lt;'
			}, {
				name: '>', value: '&amp;gt;'
			}, {
				name: '<space>', value: '&amp;nbsp;'
			}, {
				name: '&', value: '&amp;amp;'
			}, {
				name: '"', value: '&amp;quot;'
			}, {
				name: '\'', value: '&amp;apos;'
			}, {
				name: isDev ? '换行' : _l10n.formatValueSync('zotcard-preferences-line'), value: '<br/>'
			}, {
				name: isDev ? '分割线' :  _l10n.formatValueSync('zotcard-preferences-parting'), value: '<hr/>'
			}]);
			const emojis = reactive([])
			const fields = reactive([])
			const popover = reactive({
				chars: false,
				emojis: false,
				fields: false
			});

			const _loadDatas = (quantity) => {
				curCards.splice(0, curCards.length);
				datas.splice(0, datas.length);

				for (let index = 0; index < quantity; index++) {
					curCards.push('card' + (index + 1))
				}

				[...defCards].forEach(element => {
					// { card: card, label: label, visible: visible }
					var card = isDev ? {
						card: '11',
						label: element,
						default: 1,
						visible: false
					} : Zotero.ZotCard.Cards.initPrefs(element);
					datas.push({
						type: element,
						default: 1,
						card: card
					});
				});

				[...curCards].forEach(element => {
					// { card: card, label: label, visible: visible }
					var card = isDev ? {
						card: '11',
						label: element,
						default: 0,
						visible: false
					} : Zotero.ZotCard.Cards.initPrefs(element);
					datas.push({
						type: element,
						default: 0,
						card: card
					});
				});
			}

			const _init = () => {
				isDev || Zotero.Prefs.registerObserver('zotcard.card_quantity', function () {
					var quantity = Zotero.Prefs.get('zotcard.card_quantity');
					_loadDatas(quantity);
				})

				var quantity = isDev ? 1 : Zotero.Prefs.get('zotcard.card_quantity');
				_loadDatas(quantity);

				_buildPreview(datas[0].card.card).then(e => {
					preview.value = e;
				});
			}

			const handleMenuOpen = async (index) => {
				position.value = index;
				if (index > -1) {
					preview.value = await _buildPreview(datas[position.value].card.card);
				}
			}

			const handlePrefsInput = (pref, value) => {
				var goon = true;
				switch (pref) {
					case 'card_quantity':
						
						break;
					case 'note_background_color':
						goon = false;
						Zotero.ZotCard.Notes.noteBGColor(value);
						break;
				
					default:
						break;
				}

				if (goon) {
					Zotero.Prefs.set(`zotcard.${pref}`, value);
				}
			}

			const handleNoteBackgroundColorResetDefault = () => {
				Zotero.ZotCard.Notes.noteBGColor();
				prefs.note_background_color = '';
			}

			const handleTemplateInput = async () => {
				let template = datas[position.value].card.card;
				preview.value = await _buildPreview(template);
				Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
			};

			const handleTemplateFocus = () => {
				popover.chars = false;
				popover.fields = false;
				popover.emojis = false;
			}

			const handleVisibleChange = () => {
				Zotero.Prefs.set(`zotcard.${datas[position.value].type}.visible`, datas[position.value].card.visible);
			};

			const handleLabelInput = () => {
				Zotero.Prefs.set(`zotcard.${datas[position.value].type}.label`, datas[position.value].card.label);
			};

			const handlePreview = async () => {
				preview.value = await _buildPreview(datas[position.value].card.card);
			};

			const handleResetDefault = async () => {
				if (Zotero.ZotCard.Messages.confirm(_l10n.formatValueSync('zotcard-reset-default'))) {
					var template;
					if (Object.hasOwnProperty.call(Zotero.ZotCard.Cards, datas[position.value].type)) {
						template = Zotero.ZotCard.Cards[datas[position.value].type].default;
					} else {
						template = '';
					}
					preview.value = await _buildPreview(template);
					Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
					datas[position.value].card.card = template;
				}
			}

			const handleToRSS = () => {
				Zotero.launchURL('https://github.com/018/zotcard/discussions/2');
			}

			const handleStyles = async (type, param) => {
				let textarea = window.document.querySelector('.template textarea');
				let template;
				switch (type) {
					case 'B':
						template = _insertPrefixSuffix(textarea, '<strong>', '</strong>');
						break;
					case 'I':
						template = _insertPrefixSuffix(textarea, '<em>', '</em>');
						break;
					case 'U':
						template = _insertPrefixSuffix(textarea, '<u>', '</u>');
						break;
					case 'S':
						template = _insertPrefixSuffix(textarea, '<span style="text-decoration: line-through">', '</span>');
						break;
					case 'h1':
						template = _insertPrefixSuffix(textarea, '<h1>', '</h1>');
						break;
					case 'h2':
						template = _insertPrefixSuffix(textarea, '<h2>', '</h2>');
						break;
					case 'h3':
						template = _insertPrefixSuffix(textarea, '<h3>', '</h3>');
						break;
					case 'p':
						template = _insertPrefixSuffix(textarea, '<p>', '</p>');
						break;
					case 'pre':
						template = _insertPrefixSuffix(textarea, '<pre>', '</pre>');
						break;
					case 'blockquote':
						template = _insertPrefixSuffix(textarea, '<blockquote>', '</blockquote>');
						break;
					case 'left':
						template = _insertPrefixSuffix(textarea, '<p style="text-align: left">', '</p>');
						break;
					case 'center':
						template = _insertPrefixSuffix(textarea, '<p style="text-align: center">', '</p>');
						break;
					case 'right':
						template = _insertPrefixSuffix(textarea, '<p style="text-align: right">', '</p>');
						break;
					case 'color':
						template = _insertPrefixSuffix(textarea, '<span style="color: ' + param + '">', '</span>');
						break;
					case 'background-color':
						template = _insertPrefixSuffix(textarea, '<span style="background-color: ' + param + '">', '</span>');
						break;
					default:
						break;
				}

				if (template) {
					datas[position.value].card.card = template;
					preview.value = await _buildPreview(template);
					Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
				}
			}

			function handleFontColor(event) {
				window.document.getElementById('font-color-picker').querySelector('.el-color-picker__trigger').click();
			}

			function handleFontColorChange(value) {
				if (value) {
					handleStyles('color', value);
				}
				window.document.querySelector('.template textarea').focus();
			}

			function handleBackgroundColor(event) {
				window.document.getElementById('background-color-picker').querySelector('.el-color-picker__trigger').click();
			}

			function handleBackgroundColorChange(value) {
				if (value) {
					handleStyles('background-color', value);
				}
				window.document.querySelector('.template textarea').focus();
			}

			async function _handleInsertContent(value) {
				let textarea = window.document.querySelector('.template textarea');
				let template = _insertContent(textarea, value);
				if (template) {
					datas[position.value].card.card = template;
					preview.value = await _buildPreview(template);
					Zotero.Prefs.set(`zotcard.${datas[position.value].type}`, template);
				}
			}

			async function handleSChars(value) {
				_handleInsertContent(value);
			}

			async function handleEmojis(value) {
				popover.emojis = false;
				_handleInsertContent(value);
			}

			async function handleFileds(value) {
				popover.fields = false;
				_handleInsertContent(value);
			}
			
			function handleShowCharsPopover() {
				popover.chars = !popover.chars;
				if (popover.chars) {
					popover.fields = false;
					popover.emojis = false;
				}
			}

			function handleShowEmojisPopover() {
				popover.emojis = !popover.emojis;
				
				if (popover.emojis) {
					popover.fields = false;
					popover.chars = false;
					if (emojis.length === 0) {
						emojis.push({
							name: '😀',
							values: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🫣', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😶‍🌫️', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '🫤', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '🥹', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊']
						}, {
							name: '💘',
							values: ['💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️‍🔥', '❤️‍🩹', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤']
						}, {
							name: '🙎',
							values: ['👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '🫦', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '🧔‍♂️', '🧔‍♀️', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🧑‍🦱', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🧑‍🌾', '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🎤', '👨‍🎤', '👩‍🎤', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍✈️', '👨‍✈️', '👩‍✈️', '🧑‍🚀', '👨‍🚀', '👩‍🚀', '🧑‍🚒', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️', '🥷', '👷', '👷‍♂️', '👷‍♀️', '🫅', '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '🤵‍♂️', '🤵‍♀️', '👰', '👰‍♂️', '👰‍♀️', '🤰', '🫃', '🫄', '🤱', '👩‍🍼', '👨‍🍼', '🧑‍🍼', '👼', '🎅', '🤶', '🧑‍🎄', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️', '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🧜', '🧜‍♂️', '🧜‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️', '🧞', '🧞‍♂️', '🧞‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '🧌', '💆', '💆‍♂️', '💆‍♀️', '💇', '💇‍♂️', '💇‍♀️', '🛀', '🛌', '🧑‍🤝‍🧑', '👭', '👫', '👬', '💏', '👩‍❤️‍💋‍👨', '👨‍❤️‍💋‍👨', '👩‍❤️‍💋‍👩', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '👪', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👨‍👨‍👦', '👨‍👨‍👧', '👨‍👨‍👧‍👦', '👨‍👨‍👦‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👦', '👩‍👩‍👧', '👩‍👩‍👧‍👦', '👩‍👩‍👦‍👦', '👩‍👩‍👧‍👧', '👨‍👦', '👨‍👦‍👦', '👨‍👧', '👨‍👧‍👦', '👨‍👧‍👧', '👩‍👦', '👩‍👦‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👧‍👧', '🗣️', '👤', '👥', '🫂', '👣']
						}, {
							name: '🤾',
							values: ['🚶', '🚶‍♂️', '🚶‍♀️', '🧍', '🧍‍♂️', '🧍‍♀️', '🧎', '🧎‍♂️', '🧎‍♀️', '🧑‍🦯', '👨‍🦯', '👩‍🦯', '🧑‍🦼', '👨‍🦼', '👩‍🦼', '🧑‍🦽', '👨‍🦽', '👩‍🦽', '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', '🕴️', '👯', '👯‍♂️', '👯‍♀️', '🧖', '🧖‍♂️', '🧖‍♀️', '🧗', '🧗‍♂️', '🧗‍♀️', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏄', '🏄‍♂️', '🏄‍♀️', '🚣', '🚣‍♂️', '🚣‍♀️', '🏊', '🏊‍♂️', '🏊‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🚴', '🚴‍♂️', '🚴‍♀️', '🚵', '🚵‍♂️', '🚵‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '🤼', '🤼‍♂️', '🤼‍♀️', '🤽', '🤽‍♂️', '🤽‍♀️', '🤾', '🤾‍♂️', '🤾‍♀️', '🤹', '🤹‍♂️', '🤹‍♀️', '🧘', '🧘‍♂️', '🧘‍♀️']
						}, {
							name: '🦊',
							values: ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐕', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🦫', '🦔', '🦇', '🐻', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🪸', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷', '🕸', '🦂', '🦟', '🪰', '🪱']
						}, {
							name: '🌸',
							values: ['🦠', '💐', '🌸', '💮', '🪷', '🏵', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘', '🍀', '🍁', '🍂', '🍃', '🪹', '🪺']
						}, {
							name: '🍅',
							values: ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🫘', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽', '🍴', '🥄', '🔪', '🫙', '🏺']
						}, {
							name: '🚗',
							values: ['🌍', '🌎', '🌏', '🌐', '🗺', '🗾', '🧭', '🏔', '⛰', '🌋', '🗻', '🏕', '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🧱', '🪨', '🪵', '🛖', '🏘', '🏚', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙', '🌄', '🌅', '🌆', '🌇', '🌉', '♨', '🎠', '🛝', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎', '🏍', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣', '🛤', '🛢', '⛽', '🛞', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '🛟', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '🛎', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡', '☀', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁', '⛅', '⛈', '🌤', '🌥', '🌦', '🌧', '🌨', '🌩', '🌪', '🌫', '🌬', '🌀', '🌈', '🌂', '☂', '☔', '⛱', '⚡', '❄', '☃', '⛄', '☄', '🔥', '💧', '🌊']
						}, {
							name: '⚽',
							values: ['🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🪬', '🎮', '🕹', '🎰', '🎲', '🧩', '🧸', '🪅', '🪩', '🪆', '♠', '♥', '♦', '♣', '♟', '🃏', '🀄', '🎴', '🎭', '🖼', '🎨', '🧵', '🪡', '🧶', '🪢']
						}, {
							name: '👜',
							values: ['👓', '🕶', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙', '🎚', '🎛', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '📱', '📲', '☎', '📞', '📟', '📠', '🔋', '🪫', '🔌', '💻', '🖥', '🖨', '⌨', '🖱', '🖲', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏', '✒', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨', '🪓', '⛏', '⚒', '🛠', '🗡', '⚔', '🔫', '🪃', '🏹', '🛡', '🪚', '🔧', '🪛', '🔩', '⚙', '🗜', '⚖', '🦯', '🔗', '⛓', '🪝', '🧰', '🧲', '🪜', '⚗', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩼', '🩺', '🩻', '🚪', '🛗', '🪞', '🪟', '🛏', '🛋', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🫧', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰', '🪦', '⚱', '🗿', '🪧', '🪪']
						}, {
							name: '🅰️',
							values: ['🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧️', '✖️', '➕', '➖', '➗', '🟰', '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲']
						}, {
							name: '🇨🇳',
							values: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇳', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺', '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿']
						});
					}
				}
			}

			function handleShowFieldsPopover() {
				popover.fields = !popover.fields;

				if (popover.fields) {
					popover.emojis = false;
					popover.chars = false;
					if (fields.length === 0) {
						fields.push({
							name: 'ZotCard',
							values: [
								{value: '${clipboardText}', name: isDev ? 'clipboardText' : _l10n.formatValueSync('zotcard-preferences-clipboardText')},
								{value: '${today}', name: isDev ? 'today' : _l10n.formatValueSync('zotcard-preferences-today')},
								{value: '${month}', name: isDev ? 'month' : _l10n.formatValueSync('zotcard-preferences-month')},
								{value: '${dayOfYear}', name: isDev ? 'dayOfYear' : _l10n.formatValueSync('zotcard-preferences-dayOfYear')},
								{value: '${weekOfYear}', name: isDev ? 'weekOfYear' : _l10n.formatValueSync('zotcard-preferences-weekOfYear')},
								{value: '${week}', name: '星期几'},
								{value: '${week_en}', name: 'Week(English)'},
								{value: '${now}', name: isDev ? 'now' : _l10n.formatValueSync('zotcard-preferences-now')},
								{value: '${text}', name: isDev ? 'text' : _l10n.formatValueSync('zotcard-preferences-text')},
								{value: '${collectionName}', name: isDev ? 'collectionName' : _l10n.formatValueSync('zotcard-preferences-collectionName')},
								{value: '${itemLink}', name: isDev ? 'itemLink' : _l10n.formatValueSync('zotcard-preferences-itemLink')},
								{value: '${collectionLink}', name: isDev ? 'collectionLink' : _l10n.formatValueSync('zotcard-preferences-collectionLink')},
								{value: '${year}', name: isDev ? 'year' : _l10n.formatValueSync('zotcard-preferences-year')},
								{value: '${tags && tags.length > 0 ? tags.join(\',\') : \'\'}', name: isDev ? 'tags' : _l10n.formatValueSync('zotcard-preferences-tags')}]
						});
						const itemFields =  isDev ? [] : Zotero.ItemFields.getAll().map(element => {
							let value = '${' + element.name + '}';
							let name = (Zotero.ItemFields.getLocalizedString(element.name) + `(${element.name})`) || element.name;
							return {value, name};
						});
						const CreatorTypes = isDev ? [] : Zotero.CreatorTypes.getTypes().map(element => {
							let value = '${' + element.name + 's}';
							let name = (Zotero.CreatorTypes.getLocalizedString(element.name) + `(${element.name}s)`) || element.name;
							return {value, name};
						});
						fields.push({
							name: 'Zotero',
							values: [
								...itemFields,
								...CreatorTypes
							]
						});
					}
				}
			}

			function filterField(values) {
				return values.filter(e => e.name.toLowerCase().includes(searchField.value.toLowerCase()));
			}
			
			_init();

			return {
				datas,
				prefs,
				preview,
				position,
				chars,
				emojis,
				fields,
				popover,
				searchField,
				handleMenuOpen,
				handlePrefsInput,
				handleNoteBackgroundColorResetDefault,
				handleTemplateInput,
				handleTemplateFocus,
				handleVisibleChange,
				handleLabelInput,
				handleResetDefault,
				handleToRSS,
				handleStyles,
				handleFontColor,
				handleFontColorChange,
				handleBackgroundColor,
				handleBackgroundColorChange,
				handleSChars,
				handleEmojis,
				handleFileds,
				handleShowCharsPopover,
				handleShowEmojisPopover,
				handleShowFieldsPopover,
				filterField,
				handlePreview
			}
		}
	});
}