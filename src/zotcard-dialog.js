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

	findCardManager() {
		var wm = Services.wm;
		var e = wm.getEnumerator(null);
		let winCardManager;
		while (e.hasMoreElements()) {
		  win = e.getNext();
		  if (win.name === 'card-manager') {
			winCardManager = win;
			break;
		  }
		}
		return winCardManager;
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
			preventJumpback: true,
			onClose: () => {
				Zotero.getMainWindow().Zotero_Tabs.select('zotero-pane');
			}
		});
		
		let iframe = Zotero.getMainWindow().document.createXULElement('browser');
		iframe.setAttribute('class', 'card-manager');
		iframe.setAttribute('flex', '1');
		iframe.setAttribute('type', 'content');
		iframe.setAttribute('src', 'chrome://zotcard/content/cardmanager/card-manager.html');
		container.appendChild(iframe);

		iframe.docShell.windowDraggingAllowed = true;
	},

	findCardManagerTabs() {
		let tabCardManagers = [];
		for (let index = 0; index < Zotero.getMainWindow().Zotero_Tabs._tabs.length; index++) {
			const element = Zotero.getMainWindow().Zotero_Tabs._tabs[index];
			if (element.id.startsWith('card-manager-')) {
				tabCardManagers.push(element);
			}
		}
		return tabCardManagers;
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
		Zotero.openInViewer('chrome://zotcard/content/printcard/print-card.html?ids=' + noteIDs.join(','));
	},

	openCardViewer(items) {
		let io = {
			dataIn: items
		}
		let windowCardViewer = Zotero.getMainWindow().openDialog('chrome://zotcard/content/cardviewer/card-viewer.html', 'card-viewer', 'chrome,menubar=no,toolbar=no,dialog=no,centerscreen,height=' + Zotero.getMainWindow().screen.availHeight + ',width=' + Zotero.getMainWindow().screen.availWidth, io);
		windowCardViewer.focus();

		this._handleCardViewerWindowEvent(windowCardViewer);
	},

	_handleCardViewerWindowEvent(windowCardViewer) {
		let id = 'zotero-tb-card-viewer';
		if (!Zotero.getMainWindow().document.getElementById(id)) {
            let tbCardManager = Zotero.getMainWindow().document.getElementById('zotero-tb-card-manager');
        
            let zotcardViewer = Zotero.ZotCard.Doms.createMainWindowXULElement('toolbarbutton', {
              id: id,
              attrs: {
                'class': 'zotero-tb-button',
                'tooltiptext': Zotero.ZotCard.L10ns.getString('zotero-zotcard-card-viewer-title'),
                'tabindex': '0'
              },
              command: () => {
                Zotero.ZotCard.Logger.ding();
                
                let win = Zotero.ZotCard.Dialogs.findCardViewer();
                if (win) {
                  win.focus();
                } else {
                  Zotero.getMainWindow().document.getElementById(id).remove();
                }
              },
            });
            zotcardViewer.style.listStyleImage = `url(chrome://zotcard/content/images/card-viewer.png)`;
			tbCardManager.after(zotcardViewer);
		} else {
			Zotero.ZotCard.Logger.ding();
		}

		windowCardViewer.onclose = function() {
			Zotero.ZotCard.Logger.log('onclose');
			
			let viewer = Zotero.getMainWindow().document.getElementById(id);
			if (viewer) {
				viewer.remove();
			}
		}
	},

	openCardViewerWithCards(cards) {
		let io = {
			cards: cards
		}
		let windowCardViewer = Zotero.getMainWindow().openDialog('chrome://zotcard/content/cardviewer/card-viewer.html', 'card-viewer', 'chrome,menubar=no,toolbar=no,dialog=no,centerscreen,height=' + Zotero.getMainWindow().screen.availHeight + ',width=' + Zotero.getMainWindow().screen.availWidth, io);
		windowCardViewer.focus();

		this._handleCardViewerWindowEvent(windowCardViewer);
	},

	findCardViewer() {
		var wm = Services.wm;
		var e = wm.getEnumerator(null);
		let winCardViewer;
		while (e.hasMoreElements()) {
		  win = e.getNext();
		  if (win.name === 'card-viewer') {
			winCardViewer = win;
			break;
		  }
		}
		return winCardViewer;
	},
});