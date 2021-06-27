/* Copyright 2021 018.
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zotero, ZoteroPane, ZOTERO_CONFIG */
Components.utils.import('resource://gre/modules/Services.jsm');

_bundle = Cc['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://zoterozotcard/locale/zotcard.properties')

getString = function (name, ...params) {
  if (params !== undefined) {
    return _bundle.formatStringFromName(name, params, params.length)
  } else {
    return _bundle.GetStringFromName(name)
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


siftItems = function (itemArray, itemTypeArray) {
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

checkItemType = function (itemObj, itemTypeArray) {
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