'use strict'

var changed = false

function onload() {
	document.querySelectorAll('.params').forEach(select => {
		_addParamOption(select, 'clipboardText', Zotero.ZotCard.Utils.getString('zotcard.preferences.clipboardText'))
		_addParamOption(select, 'today', Zotero.ZotCard.Utils.getString('zotcard.preferences.today'))
		_addParamOption(select, 'month', Zotero.ZotCard.Utils.getString('zotcard.preferences.month'))
		_addParamOption(select, 'dayOfYear', Zotero.ZotCard.Utils.getString('zotcard.preferences.dayOfYear'))
		_addParamOption(select, 'weekOfYear', Zotero.ZotCard.Utils.getString('zotcard.preferences.weekOfYear'))
		_addParamOption(select, 'week', '星期几')
		_addParamOption(select, 'week_en', 'Week(English)')
		_addParamOption(select, 'now', Zotero.ZotCard.Utils.getString('zotcard.preferences.now'))
		_addParamOption(select, 'text', Zotero.ZotCard.Utils.getString('zotcard.preferences.text'))
		_addParamOption(select, 'collectionName', Zotero.ZotCard.Utils.getString('zotcard.preferences.collectionName'))
		_addParamOption(select, 'itemLink', Zotero.ZotCard.Utils.getString('zotcard.preferences.itemLink'))
		_addParamOption(select, 'collectionLink', Zotero.ZotCard.Utils.getString('zotcard.preferences.collectionLink'))
		_addParamOption(select, 'year', Zotero.ZotCard.Utils.getString('zotcard.preferences.year'))
	})

	Zotero.ItemFields.getAll().forEach(element => {
		let name = element.name	
		let title = Zotero.ItemFields.getLocalizedString(name) || name
		document.querySelectorAll('.params').forEach(select => {
			_addParamOption(select, name, title)
		})
	})

	Zotero.CreatorTypes.getTypes().forEach(element => {
		let name = element.name	
		let title = Zotero.CreatorTypes.getLocalizedString(name) || name
		document.querySelectorAll('.params').forEach(select => {
			_addParamOption(select, name + 's', title)
		})
	})

	loadGeneral()

	for (const key in Zotero.ZotCard.Cards) {
		if (Object.hasOwnProperty.call(Zotero.ZotCard.Cards, key) && 
			Object.prototype.toString.call(Zotero.ZotCard.Cards[key]) === '[object Object]') {
			loadCardVisible(key)
		}
	}
}


function _addParamOption(select, name, title) {
	let option = document.createElement('option')
	option.value = name
	option.textContent = title
	select.append(option)
}

function onValueChanged() {
	changed = true
}

function onItem(e) {
	if (!changed || Zotero.ZotCard.Utils.confirm(Zotero.ZotCard.Utils.getString('zotcard.discardmodified'))) {
		let id = e.target.id
		document.querySelectorAll('.left .item').forEach(e => e.setAttribute('class', e.getAttribute('class').replace(/selected/g, '')))
		e.target.setAttribute('class', e.target.getAttribute('class') + ' selected')

		document.querySelectorAll('.right .content').forEach(e => e.hidden = true)
		
		const cls = e.target.getAttribute('class')
		if (cls && cls.split(' ').includes('card')) {
			let content = document.getElementById(`card-content`)
			content.setAttribute('card-type', id)
			content.hidden = false
			loadCard(content, id)
		} else {
			let content = document.getElementById(`${id}-content`)
			content.hidden = false
		}

		changed = false
	}
}

function loadGeneral() {
	let quantity = parseInt(Zotero.Prefs.get('zotcard.card_quantity'))
	document.getElementById('card_quantity').value = quantity
	document.getElementById('startOfWeek').value = parseInt(Zotero.Prefs.get('zotcard.startOfWeek'))
	document.getElementById('recently_move_collection_quantity').value = parseInt(Zotero.Prefs.get('zotcard.config.recently_move_collection_quantity'))
	document.querySelector('.notebackground').style.backgroundColor = Zotero.ZotCard.Utils.getNoteBGColor() || '#FFFFFF'
	document.querySelector('.notebackground').setAttribute('notebackground', Zotero.ZotCard.Utils.getNoteBGColor() || '')
	
	loadCustomCard(quantity)
}

function loadCard(target, item) {
	let pref = Zotero.ZotCard.Cards.initPrefs(item)
	target.querySelector('.template').value = pref.card
	target.querySelector('.title').value = pref.label
	target.querySelector('.visible').checked = pref.visible
	target.querySelector('.preview').innerHTML = ''
	target.querySelector('.preview').style.backgroundColor = Zotero.ZotCard.Utils.getNoteBGColor()

	loadCardVisible(item)
}

function loadCardVisible(item) {
	let pref = Zotero.ZotCard.Cards.initPrefs(item)
	let element = document.getElementById(item)
	if (pref.visible) {
		element.setAttribute('class', element.getAttribute('class').replace(/disabled/g, ''))
	} else {
		element.setAttribute('class', element.getAttribute('class') + ' disabled')
	}
}

function loadCustomCard(quantity) {
	document.querySelectorAll('.left .custom').forEach(e => e.parentElement.removeChild(e))
	for (let index = 0; index < quantity; index++) {
		let pref = Zotero.ZotCard.Cards.initPrefs(`card${index + 1}`)
		let custom = document.createElement('div')
		custom.setAttribute('id', `card${index + 1}`)
		custom.textContent = pref.label
		custom.onclick = onItem
		document.getElementById('card-wrap').before(custom)

		custom.setAttribute('class', pref.visible ? 'item custom card' : 'item custom card disabled')
	}
}

function onGeneralReload() {
	if (Zotero.ZotCard.Utils.confirm(Zotero.ZotCard.Utils.getString('zotcard.reload'))) {
		loadGeneral()
		changed = false
	}
}

function onGeneralSave() {
	let quantity = document.getElementById('card_quantity').value
	if (quantity < 0) {
		Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.correct_quantity'))
		return
	}
	let recentlyMoveCollectionQuantity = parseInt(document.getElementById('recently_move_collection_quantity').value)
	if (recentlyMoveCollectionQuantity < 0) {
		Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.correct_recently_move_collection_quantity'))
		return
	}

	let startOfWeek = document.getElementById('startOfWeek').value
	let notebackground = document.querySelector('.notebackground').getAttribute('notebackground')
	Zotero.Prefs.set('zotcard.card_quantity', quantity)
	Zotero.Prefs.set('zotcard.startOfWeek', startOfWeek)

	Zotero.Prefs.set('zotcard.config.recently_move_collection_quantity', recentlyMoveCollectionQuantity)
	let recently_move_collections = Zotero.Prefs.get('zotcard.config.recently_move_collections')
	if (recently_move_collections && recently_move_collections.length > 0) {
	  let recentlyMoveCollections = recently_move_collections.split(',')
	  if (recentlyMoveCollections.length > recentlyMoveCollectionQuantity) {
		recentlyMoveCollections.splice(0, recentlyMoveCollections.length - recentlyMoveCollectionQuantity)
	  }
	  Zotero.Prefs.set('zotcard.config.recently_move_collections', recentlyMoveCollections.join(','))
	}

	Zotero.ZotCard.Utils.noteBGColor(notebackground)
	loadCustomCard(quantity)

	changed = false
	Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.save'))
}

function onCardSave(event) {
	let content = _findParent(event.target, 'content')
	if (content) {
		let visible = content.querySelector('.visible').checked
		let cardType = content.getAttribute('card-type')
		let label = content.querySelector('.title').value
		Zotero.Prefs.set(`zotcard.${cardType}`, content.querySelector('.template').value)
		Zotero.Prefs.set(`zotcard.${cardType}.label`, label)
		Zotero.Prefs.set(`zotcard.${cardType}.visible`, visible)
		
		let item = document.getElementById(cardType)
		item.textContent = label
		let menuitem = Zotero.getMainWindow().document.getElementById(`zotero-tb-note-add-zotcard-${cardType}`)
		if (visible) {
			menuitem.hidden = false
			menuitem.setAttribute('label', Zotero.ZotCard.Utils.getString('zotcard.newstandalone', label))

			item.setAttribute('class', item.getAttribute('class').replace(/disabled/g, ''))
		} else {
			menuitem.hidden = true

			item.setAttribute('class', item.getAttribute('class') + ' disabled')
		}
		
		Zotero.debug(`zotcard@onCardSave: ${cardType}, ${content.querySelector('.visible').value}, ${content.querySelector('.visible').checked}`)
		changed = false
		
		Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.save'))
	}
}

async function onPreview(event) {
	let content = _findParent(event.target, 'content')

	if (content) {
		var items = Zotero.ZotCard.Utils.getSelectedItems('regular')
		if (!items || items.length <= 0) {
		  Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.please_select_item'))
		  return
		}
		if (items.length !== 1) {
		  Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.only_one'))
		  return
		}
		let item = items[0]
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection()

		let template = content.querySelector('.template')
		let noteContent = await Zotero.ZotCard.Cards.newCardWithTemplate(collection, item, template.value, undefined)
		let preview = content.querySelector('.preview')
		preview.innerHTML = noteContent
		preview.style.backgroundColor = Zotero.ZotCard.Utils.getNoteBGColor()
	}
}

function onReset(event) {
	if (Zotero.ZotCard.Utils.confirm(Zotero.ZotCard.Utils.getString('zotcard.reset'))) {
		let content = _findParent(event.target, 'content')
		if (content) {
			let cardType = content.getAttribute('card-type')
			let template = content.querySelector('.template')

			if (Object.hasOwnProperty.call(Zotero.ZotCard.Cards, cardType)) {
				template.value = Zotero.ZotCard.Cards[cardType].default
			} else {
				template.value = ''
			}
			content.querySelector('.preview').innerHTML = ''
		}
		changed = false
	}
}

function onReload(event) {
	if (Zotero.ZotCard.Utils.confirm(Zotero.ZotCard.Utils.getString('zotcard.reload'))) {
		let content = _findParent(event.target, 'content')
		if (content) {
			let cardType = content.getAttribute('card-type')
			loadCard(content, cardType)
		}
	}
}

function onNoteBackgroundChanged(event) {
	colorpicker.popup(event.target, (clr) => {
		document.querySelector('.notebackground').style.backgroundColor = clr
		document.querySelector('.notebackground').setAttribute('notebackground', clr)
	})
}

function onStyles(type, event, param) {
	let content = _findParent(event.target, 'content')
	if (content) {
		let textarea = content.querySelector('textarea')
		switch (type) {
			case 'B':
				insertPrefixSuffix(textarea, '<strong>', '</strong>')
				break;
			case 'I':
				insertPrefixSuffix(textarea, '<em>', '</em>')
				break;
			case 'U':
				insertPrefixSuffix(textarea, '<u>', '</u>')
				break;
			case 'S':
				insertPrefixSuffix(textarea, '<span style="text-decoration: line-through">', '</span>')
				break;
			case 'h1':
				insertPrefixSuffix(textarea, '<h1>', '</h1>')
				break;
			case 'h2':
				insertPrefixSuffix(textarea, '<h2>', '</h2>')
				break;
			case 'h3':
				insertPrefixSuffix(textarea, '<h3>', '</h3>')
				break;
			case 'p':
				insertPrefixSuffix(textarea, '<p>', '</p>')
				break;
			case 'pre':
				insertPrefixSuffix(textarea, '<pre>', '</pre>')
				break;
			case 'blockquote':
				insertPrefixSuffix(textarea, '<blockquote>', '</blockquote>')
				break;
			case 'left':
				insertPrefixSuffix(textarea, '<p style="text-align: left">', '</p>')
				break;
			case 'center':
				insertPrefixSuffix(textarea, '<p style="text-align: center">', '</p>')
				break;
			case 'right':
				insertPrefixSuffix(textarea, '<p style="text-align: right">', '</p>')
				break;
			case 'color':
				insertPrefixSuffix(textarea, '<span style="color: ' + param + '">', '</span>')
				break;
			case 'background-color':
				insertPrefixSuffix(textarea, '<span style="background-color: ' + param + '">', '</span>')
				break;
			default:
				break;
		}
		changed = true
	}
}

function onFontColor(event) {
	var div = event.target
	while (div.tagName !== 'SPAN') {
		div = div.parentElement
	}
	Zotero.debug(div)
	colorpicker.popup(div, (clr) => {
		Zotero.debug(clr)
		onStyles('color', event, clr)
	})
}

function onBackgroundColor(event) {
	var div = event.target
	while (div.tagName !== 'SPAN') {
		div = div.parentElement
	}
	colorpicker.popup(div, (clr) => {
		onStyles('background-color', event, clr)
	})
}

function onParams(event) {
	let value = event.target.value
	if (!value) {
		return
	}

	let content = _findParent(event.target, 'content')
	if (content) {
		let textarea = content.querySelector('textarea')
		let insertVal = '${' + value + '}'
		insertContent(textarea, insertVal)
	}
	event.target.value = ''
}

function onChars(event) {
	let value = event.target.value
	if (!value) {
		return
	}

	let content = _findParent(event.target, 'content')
	if (content) {
		let textarea = content.querySelector('textarea')
		let insertVal = value
		insertContent(textarea, insertVal)
	}
	event.target.value = ''
}

function insertContent(textarea, val) {
	let selectionStart = textarea.selectionStart
	let selectionEnd = textarea.selectionEnd
	let start = textarea.value.substring(0, selectionStart)
	let end = textarea.value.substring(selectionEnd)
	textarea.value = start + val + end
	textarea.selectionStart = selectionStart
	textarea.selectionEnd = selectionStart + val.length
	textarea.focus()
	changed = true
}

function insertPrefixSuffix(textarea, prefix, suffix) {
	let selectionStart = textarea.selectionStart
	let selectionEnd = textarea.selectionEnd
	let start = textarea.value.substring(0, selectionStart)
	let end = textarea.value.substring(selectionEnd)
	let selection = textarea.value.substring(selectionStart, selectionEnd)
	textarea.value = start + prefix + selection + suffix + end
	textarea.selectionStart = selectionStart + prefix.length
	textarea.selectionEnd = textarea.selectionStart + selection.length
	textarea.focus()
}

function onCardBBS() {
	Zotero.launchURL('https://github.com/018/zotcard/discussions/2')
}

function _findParent(target, clss) {
	let _target = target
	const cls = _target.getAttribute('class')
	if (cls && cls.split(' ').includes(clss)) {
		return _target
	} else if (target.parentElement) {
		return _findParent(target.parentElement, clss)
	}
}

window.addEventListener('load', onload)

Zotero.debug('zotcard@preferences ....')