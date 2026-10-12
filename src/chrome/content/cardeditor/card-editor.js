const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

var notifierID = 0;
var _dataIn;
var _cards;
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined;
if (!io || !io.noteID) {
	window.close();
	Zotero.ZotCard.Messages.error(undefined, 'The parameter io is incorrect.');
} else {
	const noteID = io.noteID;
    const _l10n = new Localization(["card-editor.ftl", "zotcard-preferences.ftl", "zotcard.ftl"], true);

	window.onload = async function () {

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

		ZotElementPlus.createElementPlusApp({
			setup() {
				const ZotCardConsts = reactive(Zotero.ZotCard.Consts);
				const popover = reactive({
					chars: false,
					emojis: false,
					fields: false
				});
				let note = Zotero.Items.get(noteID);
				document.title = note.getNoteTitle();
				const searchField = ref('');
				const html = ref(note.getNote());
				const chars = reactive([]);
				const emojis = reactive([]);
				const fields = reactive([]);

				const loading = ElLoading.service({
					lock: true,
					background: 'rgba(0, 0, 0, 0.7)',
				});

				const _init = async () => {
					notifierID = Zotero.Notifier.registerObserver({
					  notify: function (event, type, ids, extraData) {
						// 新增
						Zotero.ZotCard.Logger.log(`event:${event}, type:${type}, ids:${JSON.stringify(ids)}`);
						if (ids.includes(note.id)) {
							switch (type) {
								case 'item':
								  switch (event) {
									case 'modify':
										let note = Zotero.Items.get(noteID);
										document.title = note.getNoteTitle();
										html.value = note.getNote();
									  	break;
									case 'trash':
										window.close();
										break;
								  }
								  break;
							  
								default:
								  break;
							  }
						}
					  },
					}, ['item'], 'zotcard');
					loading.close();
				}

				const handleTemplateFocus = () => {
					popover.chars = false;
					popover.fields = false;
					popover.emojis = false;
				}

				function handleTools(key) {
					switch (key) {
					  case 'copy':
						Zotero.ZotCard.Clipboards.copyTextToClipboard(html.value);
						break;
					  default:
						break;
					}
				  }

				const handleStyles = async (type, param) => {
					let textarea = window.document.querySelector('.input textarea');
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
							template = _insertPrefixSuffix(textarea, '<h1>', '</h1>\n');
							break;
						case 'h2':
							template = _insertPrefixSuffix(textarea, '<h2>', '</h2>\n');
							break;
						case 'h3':
							template = _insertPrefixSuffix(textarea, '<h3>', '</h3>\n');
							break;
						case 'p':
							template = _insertPrefixSuffix(textarea, '<p>', '</p>\n');
							break;
						case 'pre':
							template = _insertPrefixSuffix(textarea, '<pre>', '</pre>');
							break;
						case 'blockquote':
							template = _insertPrefixSuffix(textarea, '<blockquote>', '</blockquote>');
							break;
						case 'left':
							template = _insertPrefixSuffix(textarea, '<p style="text-align: left">', '</p>\n');
							break;
						case 'center':
							template = _insertPrefixSuffix(textarea, '<p style="text-align: center">', '</p>\n');
							break;
						case 'right':
							template = _insertPrefixSuffix(textarea, '<p style="text-align: right">', '</p>\n');
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
					html.value = template;
					handleTemplateInput();
				}

				function handleFontColor(event) {
					window.document.getElementById('font-color-picker').querySelector('.el-color-picker__trigger').click();
				}

				function handleFontColorChange(value) {
					if (value) {
						handleStyles('color', value);
					}
					window.document.querySelector('.input textarea').focus();
				}

				function handleBackgroundColor(event) {
					window.document.getElementById('background-color-picker').querySelector('.el-color-picker__trigger').click();
				}

				function handleBackgroundColorChange(value) {
					if (value) {
						handleStyles('background-color', value);
					}
					window.document.querySelector('.input textarea').focus();
				}

				async function _handleInsertContent(value) {
					let textarea = window.document.querySelector('.input textarea');
					let template = _insertContent(textarea, value);
					html.value = template;
					handleTemplateInput();
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
					if (Object.prototype.toString.call(value) === '[object Function]') {
						Zotero.ZotCard.Logger.log(value);
						
						value = value();
					}
					_handleInsertContent(value);
				}

				function handleShowCharsPopover() {
					popover.chars = !popover.chars;
					if (popover.chars) {
						popover.fields = false;
						popover.emojis = false;
						if (chars.length === 0) {
							chars.push({
								name: '<', value: '&lt;'
							}, {
								name: '>', value: '&gt;'
							}, {
								name: '<space>', value: '&nbsp;'
							}, {
								name: '&', value: '&amp;'
							}, {
								name: '"', value: '&quot;'
							}, {
								name: '\'', value: '&apos;'
							}, {
								name: ZotElementPlus.isZoteroDev ? '换行' : _l10n.formatValueSync('zotcard-preferences-line'), value: '<br/>'
							}, {
								name: ZotElementPlus.isZoteroDev ? '分割线' : _l10n.formatValueSync('zotcard-preferences-parting'), value: '<hr/>'
							}, {
								name: '⬇︎', value: '⬇︎'
							}, {
								name: '⇩', value: '⇩'
							}, {
								name: '⬌', value: '⬌'
							}, {
								name: '➡︎', value: '➡︎'
							}, {
								name: '➤', value: '➤'
							}, {
								name: '☛', value: '☛'
							}, {
								name: '☞', value: '☞'
							}, {
								name: '➠', value: '➠'
							}, {
								name: '➽', value: '➽'
							}, {
								name: '⬅︎', value: '⬅︎'
							}, {
								name: '⬆︎', value: '⬆︎'
							}, {
								name: '🅐', value: '🅐'
							}, {
								name: '🅑', value: '🅑'
							}, {
								name: '🅒', value: '🅒'
							}, {
								name: '🅓', value: '🅓'
							}, {
								name: '🅔', value: '🅔'
							}, {
								name: '🅰', value: '🅰'
							}, {
								name: '🅱', value: '🅱'
							}, {
								name: '🅲', value: '🅲'
							}, {
								name: '🅳', value: '🅳'
							}, {
								name: '🅴', value: '🅴'
							}, {
								name: '①', value: '①'
							}, {
								name: '②', value: '②'
							}, {
								name: '③', value: '③'
							}, {
								name: '④', value: '④'
							}, {
								name: '⑤', value: '⑤'
							}, {
								name: '➊', value: '➊'
							}, {
								name: '➋', value: '➋'
							}, {
								name: '➌', value: '➌'
							}, {
								name: '➍', value: '➍'
							}, {
								name: '➎', value: '➎'
							}, {
								name: '㊀', value: '㊀'
							}, {
								name: '㊁', value: '㊁'
							}, {
								name: '㊂', value: '㊂'
							}, {
								name: '㊃', value: '㊃'
							}, {
								name: '㊄', value: '㊄'
							}, {
								name: 'Ⅰ', value: 'Ⅰ'
							}, {
								name: 'Ⅱ', value: 'Ⅱ'
							}, {
								name: 'Ⅲ', value: 'Ⅲ'
							}, {
								name: 'Ⅳ', value: 'Ⅳ'
							}, {
								name: 'Ⅴ', value: 'Ⅴ'
							}, {
								name: '®', value: '®'
							}, {
								name: '©', value: '©'
							}, {
								name: '℃', value: '℃'
							}, {
								name: '℉', value: '℉'
							}, {
								name: '⊕', value: '⊕'
							}, {
								name: '⊖', value: '⊖'
							}, {
								name: '⊗', value: '⊗'
							}, {
								name: '⦿', value: '⦿'
							}, {
								name: '⦿', value: '⦿'
							}, {
								name: '◉', value: '◉'
							}, {
								name: '▶︎', value: '▶︎'
							}, {
								name: '◀︎', value: '◀︎'
							}, {
								name: '▼', value: '▼'
							}, {
								name: '▲', value: '▲'
							}, {
								name: '★', value: '★'
							}, {
								name: '✻', value: '✻'
							}, {
								name: '❁', value: '❁'
							}, {
								name: '☑︎', value: '☑︎'
							}, {
								name: '☐', value: '☐'
							}, {
								name: '☒', value: '☒'
							}, {
								name: '☎︎', value: '☎︎'
							}, {
								name: '✉︎', value: '✉︎'
							}, {
								name: '⚠︎', value: '⚠︎'
							}, {
								name: '♾', value: '♾'
							}, {
								name: '♿︎', value: '♿︎'
							}, {
								name: '❖', value: '❖'
							}, {
								name: '✓', value: '✓'
							}, {
								name: '✕', value: '✕'
							}, {
								name: '✺', value: '✺'
							}, {
								name: '❤︎', value: '❤︎'
							}, {
								name: '◼︎', value: '◼︎'
							});
							Zotero.ZotCard.Logger.log(chars);
							
						}
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
							let itemFields = [];
							let item = note.parentItem || note;

							var nowDate = new Date();
							let startOfWeek = Zotero.ZotCard.Prefs.get('startOfWeek', Zotero.ZotCard.Consts.startOfWeek.sunday);
							let w = Zotero.ZotCard.DateTimes.week(nowDate);
							let week = w.cn;
							let weekEn = w.en;
							let zotCards = {
								name: 'ZotCard',
								values: [
									{ value: () => item.id, name: ZotElementPlus.isZoteroDev ? 'id' : _l10n.formatValueSync('zotcard-preferences-id') },
									{ value: () => Zotero.ZotCard.Clipboards.getClipboard(), name: ZotElementPlus.isZoteroDev ? 'clipboardText' : _l10n.formatValueSync('zotcard-preferences-clipboardText') },
									{ value: Zotero.ZotCard.DateTimes.formatDate(nowDate, Zotero.ZotCard.DateTimes.yyyyMMdd), name: ZotElementPlus.isZoteroDev ? 'today' : _l10n.formatValueSync('zotcard-preferences-today') },
									{ value: Zotero.ZotCard.DateTimes.formatDate(nowDate, Zotero.ZotCard.DateTimes.yyyyMM), name: ZotElementPlus.isZoteroDev ? 'month' : _l10n.formatValueSync('zotcard-preferences-month') },
									{ value: Zotero.ZotCard.DateTimes.dayOfYear(nowDate), name: ZotElementPlus.isZoteroDev ? 'dayOfYear' : _l10n.formatValueSync('zotcard-preferences-dayOfYear') },
									{ value: Zotero.ZotCard.Moments.weekOfYear(nowDate, startOfWeek), name: ZotElementPlus.isZoteroDev ? 'weekOfYear' : _l10n.formatValueSync('zotcard-preferences-weekOfYear') },
									{ value: week, name: '星期几' },
									{ value: weekEn, name: 'Week(English)' },
									{ value: () => Zotero.ZotCard.DateTimes.formatDate(new Date(), Zotero.ZotCard.DateTimes.yyyyMMddHHmmss), name: ZotElementPlus.isZoteroDev ? 'now' : _l10n.formatValueSync('zotcard-preferences-now') },
									// { value: '${text}', name: ZotElementPlus.isZoteroDev ? 'text' : _l10n.formatValueSync('zotcard-preferences-text') },
								]
							}
							fields.push(zotCards);


							
							item.getCollections().forEach(collectionID => {
								let c = Zotero.Collections.get(collectionID);
								itemFields.push({
									value: `<a href="${Zotero.ZotCard.Collections.getZoteroUrl(c.key)}">${c.name}</a>`,
									name: c.name,
								});
								itemFields.push({
									value: Zotero.ZotCard.Collections.getZoteroUrl(c.key),
									name: '🔗 ' + c.name,
								});
							});

							if (Object.hasOwnProperty.call(item.getRelations(), 'dc:relation')) {
								item.getRelations()['dc:relation'].forEach(async r => {
									//"http://zotero.org/users/6727790/items/5Z9RV9PM"
									let _item = await Zotero.URI.getURIItem(r);
									if (_item) {
										let title = _item.itemType === 'note' ? _item.getNoteTitle() : _item.getDisplayTitle();
										itemFields.push({
											value: `<a href="${Zotero.ZotCard.Items.getZoteroUrl(_item.key)}">${title}</a>`,
											name: title,
										});
										itemFields.push({
											value: Zotero.ZotCard.Items.getZoteroUrl(_item.key),
											name: '🔗 ' + title,
										});
									}
								})
							}
							if (note.parentItem) {
								itemFields.push({
									value: `<a href="${Zotero.ZotCard.Items.getZoteroUrl(note.parentItem.key)}">${note.parentItem.getDisplayTitle()}</a>`,
									name: note.parentItem.getDisplayTitle(),
								});
								itemFields.push({
									value: Zotero.ZotCard.Collections.getZoteroUrl(note.parentItem.key),
									name: '🔗 ' + note.parentItem.getDisplayTitle(),
								});

								if (note.parentItem.getField('year')) {
									itemFields.push({
										value: note.parentItem.getField('year'),
										name:  `${_l10n.formatValueSync('zotcard-preferences-year')}: ${note.parentItem.getField('year')}`,
									});
								}
								let json = note.parentItem.toJSON();
								for (const key in json) {
									if (Object.hasOwnProperty.call(json, key)) {
										const element = json[key];
										let name;
										if (Object.hasOwnProperty.call(Zotero.Schema.globalSchemaLocale.fields, key)) {
											name = Zotero.Schema.globalSchemaLocale.fields[key];
										} else {
											try {
												name = Zotero.ItemFields.getLocalizedString(key);
											} catch (error) {
												name = key;
											}
										}
										
										switch (key) {
											case 'itemType':
												itemFields.push({
													value: Zotero.ItemTypes.getLocalizedString(element),
													name:  `${name}: ${Zotero.ItemTypes.getLocalizedString(element)}`,
												});
												break;
											case 'tags':
												if (note.parentItem.getTags().length > 0) {
													let tags = note.parentItem.getTags().map(e => e.tag).join(',');
													itemFields.push({
														value: tags,
														name:  `${name}: ${tags}`,
													});
												}
												break;
											case 'abstractNote':
												let abstractNote = note.parentItem.getField('abstractNote');
												itemFields.push({
													value: abstractNote,
													name:  `${name}: ${abstractNote}`,
												});
												break;
											case 'creators':
												if (element.length > 0) {
													element.forEach(ee => {
														let n;
														if (ee.name) {
															n = ee.name;
														} else {
															var isCN1 = ee.lastName?.match('[\u4e00-\u9fa5]+');
															var isCN2 = ee.firstName?.match('[\u4e00-\u9fa5]+');
															n = ee.lastName + (isCN1 || isCN2 ? '' : ' ') + ee.firstName;
														}
														name = Zotero.CreatorTypes.getLocalizedString(ee.creatorType);
														itemFields.push({
															value: n,
															name:  `${name}: ${n}`,
														});
													});
												}
												break;
											case 'relations':
											case 'collections':
											case 'version':
												break;
											case 'accessDate':
											case 'dateAdded':
											case 'dateModified':
												let v = Zotero.ZotCard.DateTimes.sqlToDate(item.getField(key), 'yyyy-MM-dd HH:mm:ss');
												itemFields.push({
													value: v,
													name:  `${name}: ${v}`,
												});
												break;
											default:
												if (element) {
													switch (Object.prototype.toString.call(element)) {
														case '[object Number]':
														case '[object Boolean]':
															itemFields.push({
																value: element.toString(),
																name:  `${name}: ${element}`,
															});
															break;
														case '[object String]':
															itemFields.push({
																value: element.replace(/"|'/g, "\\\"").replace(/\n/g, "\\n"),
																name:  `${name}: ${element.replace(/"|'/g, "\\\"").replace(/\n/g, "\\n")}`,
															});
															break;
														case '[object Object]':
														case '[object Array]':
															itemFields.push({
																value: JSON.stringify(element),
																name:  `${name}: ${JSON.stringify(element)}`,
															});
															break;
														default:
															break;
													}
												}
												break;
										}
									}
								}
							}
							
							if (itemFields.length > 0) {
								fields.push({
									name: 'Zotero',
									values: [
										...itemFields
									]
								});
							}
						}
					}
				}

				function filterField(values) {
					return values.filter(e => e.name.toLowerCase().includes(searchField.value.toLowerCase()));
				}

				const handleTemplateInput = ZotElementPlus.debounce(async () => {
					note.setNote(html.value);
					note.saveTx();
				}, 1000);

				function l10n(key, params) {
					return params ? _l10n.formatValueSync(key, params) : _l10n.formatValueSync(key);
				}

				_init();

				return {
					ZotCardConsts,
					popover,
					chars,
					emojis,
					fields,
					searchField,
					html,

					handleTools,
					handleTemplateFocus,
					handleTemplateInput,
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
					l10n
				}
			}
		});
	}
}

window.onclose = function() {
  Zotero.ZotCard.Logger.log('onclose');
  
  if (notifierID > 0) {
    Zotero.Notifier.unregisterObserver(this.notifierID);
  }
}