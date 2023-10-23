var chromeHandle;

function install() {
	Zotero.debug("🤪zotcard@zotero.org installed.");
}

async function startup({ id, version, rootURI }) {
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/moment.min.js');
	
    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-selfs.js');
    Zotero.ZotCard.Selfs.init({ id, version, rootURI });
	
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zot-logger.js');
	Zotero.ZotCard.Logger.log("loadSubScript zot-logger.js");
	Zotero.ZotCard.Logger.init();
	Zotero.ZotCard.Logger.log(rootURI);

	Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-include.js', { id, version, rootURI });
	Zotero.ZotCard.Logger.log("loadSubScript zot-include.js");
	Services.scriptloader.loadSubScript(rootURI + '/chrome/content/cardsearcher.js');
	Zotero.ZotCard.Logger.log("loadSubScript zot-cardsearcher.js");
	
	Zotero.PreferencePanes.register({
		pluginID: id,
		label: 'ZotCard',
		image: 'chrome://zotcard/content/images/zotcard.png',
		src: rootURI + 'chrome/content/preferences/preferences.xhtml',
		scripts: [rootURI + 'chrome/content/preferences/preferences.js'],
		helpURL: 'https://github.com/018/zotcard',
	});

	var aomStartup = Cc["@mozilla.org/addons/addon-manager-startup;1"].getService(Ci.amIAddonManagerStartup);
    var manifestURI = Services.io.newURI(rootURI + "manifest.json");
    chromeHandle = aomStartup.registerChrome(manifestURI, [
        ["content", "zotcard", rootURI + "chrome/content/"]
    ]);

	Zotero.ZotCard.Utils.afterRun(() => {
		const data = {
			"app_name": id,
			"app_version": version,
			"machineid": Zotero.ZotCard.Utils.getCurrentUsername(),
			"machinename": Zotero.version,
			"os": Zotero.platform + `${Services.appinfo.is64Bit ? '(64bits)' : ''}`,
			"os_version": '0'
		};
		Zotero.ZotCard.Logger.log('submit to 018soft.com', data);
		Zotero.HTTP.request(
			"POST",
			'http://api.018soft.com/authorization/anon/client/submit',
			{
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
				timeout: 30000
			}
		);
	}, 50);

	Services.scriptloader.loadSubScript(rootURI + 'zotcard-consts.js');
	Zotero.ZotCard.Logger.log("loadSubScript zotcard-consts.js");
	Zotero.ZotCard.Consts.init({ id, version, rootURI });

    Services.scriptloader.loadSubScript(rootURI + 'zotcard-cards.js');
    Zotero.ZotCard.Logger.log("loadSubScript zotcard-cards.js");

	Services.scriptloader.loadSubScript(rootURI + 'zotcard.js');
	Zotero.ZotCard.Logger.log("loadSubScript zotcard.js");
	Zotero.ZotCard.init({ id, version, rootURI });
	Zotero.ZotCard.addToAllWindows();
	await Zotero.ZotCard.main();
	
}

function onMainWindowLoad({ window }) {
	Zotero.ZotCard.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	Zotero.ZotCard.removeFromWindow(window);
}

function shutdown() {
	Zotero.ZotCard.Logger.log("Shutdown.");
	chromeHandle.destruct();
	chromeHandle = null;

	Zotero.ZotCard.removeFromAllWindows();
	Zotero.ZotCard.shutdown();
	Zotero.ZotCard = undefined;
}

function uninstall() {
	Zotero.debug("🤪zotcard@zotero.org Uninstalled.");
}
