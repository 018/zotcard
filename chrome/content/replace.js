/* Copyright 2021 018.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zotero, ZoteroPane, ZOTERO_CONFIG */
Components.utils.import('resource://gre/modules/Services.jsm');

function isDebug () {
  return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled
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

function padding(num, length) {
  return (Array(length).join('0') + num).slice(-length)
}

function replace() {
  try {
    var zitems = getSelectedItems(['note'])
    if (!zitems || zitems.length <= 0) {
      Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.only_note'))
      return
    }

    var scope = document.getElementById('replace_scope').value;
    var mode = document.getElementById('replace_mode').value;
    var text = document.getElementById('replace_edit_text').value;
    var replaceto = document.getElementById('replace_edit_replaceto').value;
    if (zitems.length > 26 && (replaceto.includes('${a}') || replaceto.includes('${A}'))) {
      Zotero.ZotCard.Utils.warning(Zotero.ZotCard.Utils.getString('zotcard.replace.moreletter'))
      return
    }
    let count = 0
    zitems.forEach((zitem, index) => {
      let note = zitem.getNote()
      let newNote
      let matched = note.match(text.replace(/\\/g, '\\\\').replace(/\//g, '\\/'))
      let ns = ''
      if (matched && matched.length > 1) {
        for (let index = 1; index < matched.length; index++) {
          const element = matched[index];
          ns += 'var n' + index + ' = ' + element.charCodeAt() + '; '
        }
      }
      let replaceto_ = Zotero.getMainWindow().eval('var i = \'' + padding(index + 1, String(zitems.length).length) + '\'; ' + 
        'var a = String.fromCharCode(\'a\'.charCodeAt() + ' + index + '); ' + 
        'var A = String.fromCharCode(\'A\'.charCodeAt() + ' + index + '); ' +
        'var N = function(n) { return String.fromCharCode(n) }; ' +
        ns +
        '`' + replaceto.replace(/\\/g, '\\\\').replace('`', '\`') + '`')

      Zotero.debug(`zotcard@replaceto_: ${replaceto_}`)
      let tarNote
      let resolveNote = Zotero.getMainWindow().Zotero.ZotCard.Utils.resolveNote(zitem)
      Zotero.debug(`zotcard@resolveNote: ${resolveNote}`)
      if (scope === 'all') {
        tarNote = note
      } else if (scope === 'title') {
        tarNote = resolveNote.title
      } else if (scope === 'content') {
        tarNote = resolveNote.content
      } 
      
      if (mode === 'html') {
        newNote = tarNote.replace(new RegExp(text, 'g'), replaceto_)
      } else if (mode === 'content') {
        newNote = replaceNoTag(tarNote, 0, text.replace(/</g, '&lt;').replace(/>/g, '&gt;'), replaceto_.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      }

      if (newNote !== tarNote) {
        count++

        if (scope === 'title') {
          if (resolveNote.titleindex > -1) {
            newNote = resolveNote.content.substring(0, resolveNote.titleindex) + newNote + resolveNote.content.substring(resolveNote.titleindex)
          } else {
            newNote = resolveNote.content
          }
        } else if (scope === 'content') {
          if (resolveNote.titleindex > -1) {
            newNote = resolveNote.content.substring(0, resolveNote.titleindex) + resolveNote.title + resolveNote.content.substring(resolveNote.titleindex)
          } else {
            newNote = newNote
          }
        } 
  
        zitem.setNote(newNote);
        var itemID = zitem.saveTx();
        if (isDebug()) Zotero.debug('item.id: ' + itemID);
      }
    })
    
    Zotero.ZotCard.Utils.success(Zotero.ZotCard.Utils.getString('zotcard.replace.success', count))
    return true
  } catch (error) {
    Zotero.ZotCard.Utils.warning(error)
  }
}