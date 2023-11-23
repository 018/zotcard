const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

var io = {dataIn:{type:1}};
const parentIDs = [];
parentIDs.push(['library-1']);

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
      const ZotCardConsts = reactive({
        defCardTypes: ['abstract', 'quotes', 'concept', 'character', 'not_commonsense', 'skill', 'structure', 'general'],
        card_quantity: 3,
        startOfWeek: 0,
        recently_move_collection_quantity: 5,
        enable_word_count: true,
        note_background_color: '',
      
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
      const renders = reactive({
        drawer: false,
        innerHeight: window.innerHeight,
        currentIndex: 0,
        total: 0,
        loads: 0,
        isOrderbyDesc: (f) => {
          return filters.orderby === f && filters.desc;
        },
        formatTime: (time) => {
          let s = parseInt(time % 60);
          let m = parseInt(time % (60 * 60) / 60);
          let h = parseInt(time % (60 * 60 * 60) / (60 * 60));
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
      });
			const popover = reactive({
				chars: false,
				emojis: false,
				fields: false
			});
			const searchField = ref('');
			const html = ref('');
			const chars = reactive([]);
			const emojis = reactive([]);
			const fields = reactive([]);

      const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)',
      });

      const _init = async () => {
        loading.close();
      }

			const handleTemplateFocus = () => {
				popover.chars = false;
				popover.fields = false;
				popover.emojis = false;
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
					if(chars.length === 0){
						chars.push({
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
							name: ZotElementPlus.isZoteroDev ? '换行' : _l10n.formatValueSync('zotcard-preferences-line'), value: '<br/>'
						}, {
							name: ZotElementPlus.isZoteroDev ? '分割线' :  _l10n.formatValueSync('zotcard-preferences-parting'), value: '<hr/>'
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
						fields.push({
							name: 'ZotCard',
							values: [
								{value: '${clipboardText}', name: ZotElementPlus.isZoteroDev ? 'clipboardText' : _l10n.formatValueSync('zotcard-preferences-clipboardText')},
								{value: '${today}', name: ZotElementPlus.isZoteroDev ? 'today' : _l10n.formatValueSync('zotcard-preferences-today')},
								{value: '${month}', name: ZotElementPlus.isZoteroDev ? 'month' : _l10n.formatValueSync('zotcard-preferences-month')},
								{value: '${dayOfYear}', name: ZotElementPlus.isZoteroDev ? 'dayOfYear' : _l10n.formatValueSync('zotcard-preferences-dayOfYear')},
								{value: '${weekOfYear}', name: ZotElementPlus.isZoteroDev ? 'weekOfYear' : _l10n.formatValueSync('zotcard-preferences-weekOfYear')},
								{value: '${week}', name: '星期几'},
								{value: '${week_en}', name: 'Week(English)'},
								{value: '${now}', name: ZotElementPlus.isZoteroDev ? 'now' : _l10n.formatValueSync('zotcard-preferences-now')},
								{value: '${text}', name: ZotElementPlus.isZoteroDev ? 'text' : _l10n.formatValueSync('zotcard-preferences-text')},
								{value: '${collectionName}', name: ZotElementPlus.isZoteroDev ? 'collectionName' : _l10n.formatValueSync('zotcard-preferences-collectionName')},
								{value: '${itemLink}', name: ZotElementPlus.isZoteroDev ? 'itemLink' : _l10n.formatValueSync('zotcard-preferences-itemLink')},
								{value: '${collectionLink}', name: ZotElementPlus.isZoteroDev ? 'collectionLink' : _l10n.formatValueSync('zotcard-preferences-collectionLink')},
								{value: '${year}', name: ZotElementPlus.isZoteroDev ? 'year' : _l10n.formatValueSync('zotcard-preferences-year')},
								{value: '${tags && tags.length > 0 ? tags.join(\',\') : \'\'}', name: ZotElementPlus.isZoteroDev ? 'tags' : _l10n.formatValueSync('zotcard-preferences-tags')}]
						});
						const itemFields =  ZotElementPlus.isZoteroDev ? [{value: '123', name: '我是:我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是'}] : Zotero.ItemFields.getAll().map(element => {
							let value = '${' + element.name + '}';
							let name = (Zotero.ItemFields.getLocalizedString(element.name) + `(${element.name})`) || element.name;
							return {value, name};
						});
						const creatorTypes = ZotElementPlus.isZoteroDev ? [] : Zotero.CreatorTypes.getTypes().map(element => {
							let value = '${' + element.name + 's}';
							let name = (Zotero.CreatorTypes.getLocalizedString(element.name) + `(${element.name}s)`) || element.name;
							return {value, name};
						});
						fields.push({
							name: 'Zotero',
							values: [
								...itemFields,
								...creatorTypes
							]
						});
					}
				}
			}

			function filterField(values) {
				return values.filter(e => e.name.toLowerCase().includes(searchField.value.toLowerCase()));
			}

			const handleTemplateInput = ZotElementPlus.debounce(async () => {
        Zotero.ZotCard.Logger.log('handleTemplateInput');
        
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