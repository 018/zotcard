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

function onload () {
  io.dataIn.items.forEach((element, index) => {
    let label = document.createElement('label')
    label.setAttribute('value', `${element.label}数量：`)
    document.getElementById('groupbox').appendChild(label)
    let textbox = document.createElement('textbox')
    textbox.setAttribute('id', element.id)
    textbox.setAttribute('item-index', index)
    textbox.setAttribute('value', element.value || '')
    textbox.setAttribute('flex', '1')
    document.getElementById('groupbox').appendChild(textbox)
  })
  window.sizeToContent()
}

function ok () {
  var dataOut = []
  document.querySelectorAll('#groupbox textbox').forEach(textbox => {
    if (textbox.value.length > 0) {
      if (textbox.value.match(/\D/g)) {
        Zotero.ZotCard.Utils.warning('请正确输入数量。')
        textbox.focus()
      } else {
        let index = parseInt(textbox.getAttribute('item-index'))
        io.dataIn.items[index].value = parseInt(textbox.value)
        dataOut.push(io.dataIn.items[index])
      }
    }
  })
  if (dataOut) {
    io.dataOut = dataOut
    window.close()
  }
}
