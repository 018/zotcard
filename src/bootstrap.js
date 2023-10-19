var chromeHandle;

function install() {
	Zotero.debug("🤪zotcard@zotero.org installed.");
}

async function startup({ id, version, rootURI }) {
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zotcard-logger.js');
	Zotero.ZotCard.Logger.init({ id, version });
	Zotero.ZotCard.Logger.log("loadSubScript zotcard-logger.js");
	Zotero.ZotCard.Logger.log(rootURI);

	// Zotero.PreferencePanes.register({
	// 	pluginID: 'zotcard@zotero.org',
	// 	src: '/chrome/content/preferences.xhtml',
	// 	scripts: ['/chrome/content/preferences.js'],
	// });

	Zotero.PreferencePanes.register({
		pluginID: 'zotcard@zotero.org',
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
	
	Services.scriptloader.loadSubScript(rootURI + 'zotcard.js');
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
