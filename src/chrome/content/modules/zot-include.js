(function() {
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/moment.min.js');

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-objects.js');
    Zotero.ZotCard.Objects.init();
	
    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-selfs.js');
    Zotero.ZotCard.Selfs.init({ id, version, rootURI });
	
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zot-logger.js');
	Zotero.ZotCard.Logger.log("loadSubScript zot-logger.js");
	Zotero.ZotCard.Logger.init();

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-zeteros.js');
    Zotero.ZotCard.Zoteros.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-zeteros.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-l10ns.js');
    Zotero.ZotCard.L10ns.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-l10ns.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-messages.js');
    Zotero.ZotCard.Messages.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-messages.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-datetimes.js');
    Zotero.ZotCard.DateTimes.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-datetimes.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-prefs.js');
    Zotero.ZotCard.Prefs.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-prefs.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-notes.js');
    Zotero.ZotCard.Notes.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-notes.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-doms.js');
    Zotero.ZotCard.Doms.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-doms.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-events.js');
    Zotero.ZotCard.Events.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-events.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-items.js');
    Zotero.ZotCard.Items.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-items.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-searches.js');
    Zotero.ZotCard.Items.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-searches.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-collections.js');
    Zotero.ZotCard.Collections.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-collections.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-groups.js');
    Zotero.ZotCard.Groups.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-groups.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-readers.js');
    Zotero.ZotCard.Readers.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-readers.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-clipboards.js');
    Zotero.ZotCard.Clipboards.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-clipboards.js");
    
    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-utils.js');
    Zotero.ZotCard.Utils.init();
    Zotero.ZotCard.Logger.log("loadSubScript zot-utils.js");
})();