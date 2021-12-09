/* Copyright 2021 018.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zotero, ZoteroPane, ZOTERO_CONFIG */
Components.utils.import('resource://gre/modules/Services.jsm');

var _bundle = Cc['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://zoterozotcard/locale/zotcard.properties')

function isDebug () {
  return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled
}

function getString (name, ...params) {
  if (params !== undefined) {
    return _bundle.formatStringFromName(name, params, params.length)
  } else {
    return _bundle.GetStringFromName(name)
  }
}

function checkItemType (itemObj, itemTypeArray) {
  var matchBool = false

  for (var idx = 0; idx < itemTypeArray.length; idx++) {
    switch (itemTypeArray[idx]) {
      case 'attachment':
        matchBool = itemObj.isAttachment()
        break
      case 'note':
        matchBool = itemObj.isNote()
        break
      case 'regular':
        matchBool = itemObj.isRegularItem()
        break
      default:
        matchBool = Zotero.ItemTypes.getName(itemObj.itemTypeID) === itemTypeArray[idx]
    }

    if (matchBool) {
      break
    }
  }

  return matchBool
}

function siftItems (itemArray, itemTypeArray) {
  var matchedItems = []
  var unmatchedItems = []
  while (itemArray.length > 0) {
    if (checkItemType(itemArray[0], itemTypeArray)) {
      matchedItems.push(itemArray.shift())
    } else {
      unmatchedItems.push(itemArray.shift())
    }
  }

  return {
    matched: matchedItems,
    unmatched: unmatchedItems
  }
}

function getSelectedItems(itemType) {
  var zitems = Zotero.getActiveZoteroPane().getSelectedItems();
  if (!zitems.length) {
    if (isDebug()) Zotero.debug('zitems.length: ' + zitems.length);
    return false;
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType]
    }
    var siftedItems = siftItems(zitems, itemType)
    if (isDebug()) Zotero.debug('siftedItems.matched: ' + JSON.stringify(siftedItems.matched))
    return siftedItems.matched
  } else {
    return zitems
  }
}

function replaceNoTag(note, preIdx, text, replaceto) {
  let idx = note.indexOf(text, preIdx);
  let newNote = '';
  if (idx >= 0) {
    let start = note.lastIndexOf('<', idx);
    let end = note.lastIndexOf('>', idx);
    if ((start === -1 && end === -1) || (start < end)) {
      // replace
      newNote += note.substring(preIdx, idx) + replaceto + replaceNoTag(note, idx + text.length, text, replaceto);
    } else {
      newNote += note.substring(preIdx, idx) + text + replaceNoTag(note, idx + text.length, text, replaceto);
    }
  } else {
    newNote = note.substring(preIdx);
  }
  return newNote;
}

function replace() {
  var zitems = getSelectedItems(['note'])
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes['@mozilla.org/embedcomp/prompt-service;1'].getService(Components.interfaces.nsIPromptService)
    ps.alert(window, getString('zotcard.warning'), getString('zotcard.only_note'))
    return
  }

  var mode = document.getElementById('replace_mode').value;
  var text = document.getElementById('replace_edit_text').value;
  var replaceto = document.getElementById('replace_edit_replaceto').value;
  zitems.forEach(zitem => {
    let note = zitem.getNote();
    let newNote;
    if (mode === 'html') {
      newNote = note.replace(new RegExp(text, 'g'), replaceto);
    } else if (mode === 'content') {
      newNote = replaceNoTag(note, 0, text.replace(/</g, '&lt;').replace(/>/g, '&gt;'), replaceto.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    }
    zitem.setNote(newNote);
    var itemID = zitem.saveTx();
    if (isDebug()) Zotero.debug('item.id: ' + itemID);
  })
}