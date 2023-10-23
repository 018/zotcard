if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.L10ns) Zotero.ZotCard.L10ns = {};

Zotero.ZotCard.L10ns = Object.assign(Zotero.ZotCard.L10ns, {
  _l10n: new Localization(["zotcard.ftl"], true),
  
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Readers inited.');
	},
  
  getString(name, params) {
    if (params) {
      return this._l10n.formatValueSync(name, params);
    }

    return this._l10n.formatValueSync(name);
  },
  
  getStringFtl(ftl, name, params) {
    let l10n = new Localization([ftl], true);
    if (params) {
      return this.l10n.formatValueSync(name, params);
    }

    return this.l10n.formatValueSync(name);
  }
});