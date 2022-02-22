/* Copyright 2021 018.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zotero, ZoteroPane, ZOTERO_CONFIG */
Components.utils.import('resource://gre/modules/Services.jsm');

function onload () {
  let column = Zotero.Prefs.get('zotcard.config.column_edt')
  document.getElementById('column_edt').value = column || '4'
  let height = Zotero.Prefs.get('zotcard.config.height_edt')
  document.getElementById('height_edt').value = height || '300'
}

function ok () {
  var column = document.getElementById('column_edt').value
  Zotero.Prefs.set('zotcard.config.column_edt', column)
  var height = document.getElementById('height_edt').value
  Zotero.Prefs.set('zotcard.config.height_edt', height)

  var width = window.screen.availWidth / column
  var wm = Services.wm;
  var e = wm.getEnumerator('zotero:note')
  var w = 0
  var h = 0
  while (e.hasMoreElements()) {
    var win = e.getNext()
    win.outerWidth = width
    win.outerHeight = height
    if (w < window.screen.availWidth && h < window.screen.availHeight) {
      win.moveTo(w, h)
    }
    Zotero.debug(`${w} - ${h}, ${win.outerWidth} - ${window.screen.availWidth}`)
    win.focus()

    if ((w + win.outerWidth) < window.screen.availWidth) {
      w += win.outerWidth
    } else if ((h + win.outerHeight) < window.screen.availHeight) {
      w = 0
      h += win.outerHeight
    }
  }

  window.focus()
}
