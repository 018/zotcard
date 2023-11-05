if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Dialogs) Zotero.ZotCard.Dialogs = {};
Components.utils.import('resource://gre/modules/Services.jsm');

Zotero.ZotCard.Dialogs = Object.assign(Zotero.ZotCard.Dialogs, {

	// http://udn.realityripple.com/docs/Web/API/Window/open#Window_features

	openCardManager(items) {
		let io = {
			dataIn: items
		}
		let win = Zotero.getMainWindow().openDialog('chrome://zotcard/content/cardmanager/card-manager.html', 'card-manager', 'chrome,menubar=no,toolbar=no,dialog=no,centerscreen,height=' + Zotero.getMainWindow().screen.availHeight + ',width=' + Zotero.getMainWindow().screen.availWidth, io);
		win.focus();
	},

	openCardManagerTab(items) {
		let { id, container } = Zotero.getMainWindow().Zotero_Tabs.add({
			id: 'card-manager-' + Zotero.Utilities.randomString(),
			type: 'zotero-pane',
			title: Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-manager-title'),
			index: Zotero.getMainWindow().Zotero_Tabs._tabs.length,
			data: {
				dataIn: items
			},
			select: true,
			preventJumpback: true
		});
		
		let iframe = Zotero.getMainWindow().document.createXULElement('browser');
		iframe.setAttribute('class', 'reader');
		iframe.setAttribute('flex', '1');
		iframe.setAttribute('type', 'content');
		iframe.setAttribute('src', 'chrome://zotcard/content/cardmanager/card-manager.html');
		container.appendChild(iframe);

		iframe.docShell.windowDraggingAllowed = true;
	},

	openMultiEditManager(noteIDs) {
		noteIDs.forEach(id => {
			var enumerator = Services.wm.getEnumerator('zotero:note');
			let foud = false;
			while (enumerator.hasMoreElements()) {
			  var win = enumerator.getNext();
			  Zotero.ZotCard.Logger.log(win.noteEditor.item.id);
			  if (id === win.noteEditor.item.id) {
				foud = true;
			  }
			}
			if (!foud) {
				Zotero.getMainWindow().ZoteroPane.openNoteWindow(id);
			}
		});

		let win = Zotero.getMainWindow().openDialog('chrome://zotcard/content/multieditmanager/multi-edit-manager.html', 'multi-edit-manager', `chrome,menubar=no,toolbar=no,dialog=no,height=200,width=220,left=${Zotero.getMainWindow().screen.availWidth - 205},top=${Zotero.getMainWindow().screen.availWidth - 225}`);
		win.focus();
	},

	openPrintCard(noteIDs) {
		let io = {
			dataIn: noteIDs
		}
		let win = Zotero.getMainWindow().openDialog('chrome://zotcard/content/printcard/print-card.html', 'print-card', `chrome,menubar=no,toolbar=no,dialog=no,resizable,height=${Zotero.getMainWindow().screen.availWidth / 2},width=${Math.max(Zotero.getMainWindow().screen.availWidth / 2, 1000)},centerscreen`, io);
		win.focus();
	}
});