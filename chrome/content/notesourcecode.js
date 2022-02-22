/* Copyright 2021 018.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components */
/* global Zotero, ZoteroPane, ZOTERO_CONFIG */
Components.utils.import('resource://gre/modules/Services.jsm');

var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : { dataIn: [] }

io = Object.assign(io, { dataOut: false })
var id = io.dataIn
let note = Zotero.Items.get(id)

function onload () {
  if (note) {
    document.getElementById('textbox').value = note.getNote()
    window.sizeToContent()
  } else {
    Zotero.ZotCard.Utils.warning('错误的笔记id。')
    window.close()
  }
}

async function ok () {
  note.setNote(document.getElementById('textbox').value)
  await note.saveTx()

  io.dataOut = true
  window.close()
}
