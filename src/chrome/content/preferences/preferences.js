if (!Zotero.ZotCard) Zotero.ZotCard = {};

Zotero.ZotCard.Preferences = {
	_l10n: new Localization(["preferences.ftl", "zotcard.ftl"], true),

	init: function() {
		Zotero.ZotCard.Logger.ding();
	},

	backup: function() {
		let now = Zotero.ZotCard.DateTimes.formatDate(new Date(), Zotero.ZotCard.DateTimes.yyyyMMddHHmmss);
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		fp.init(window, this._l10n.formatValueSync('zotero-zotcard-preferences-backup'), Ci.nsIFilePicker.modeSave);
		fp.appendFilter('ZotCard Backup', '*.zotcard');
		fp.defaultString = now;
		fp.open(function (returnConstant) {
            if (returnConstant === 0 || returnConstant === 2) {
				let file = fp.file;
				file.QueryInterface(Ci.nsIFile);
				let backup = {
					last_updated: now,
					card_quantity: Zotero.ZotCard.Prefs.get('card_quantity'),
					word_count_style: Zotero.ZotCard.Prefs.get('word_count_style'),
					enable_word_count: Zotero.ZotCard.Prefs.get('enable_word_count'),
					startOfWeek: Zotero.ZotCard.Prefs.get('startOfWeek'),
					cardmgr_profiles: Zotero.ZotCard.Prefs.getJson('cardmgr.profiles'),
					cardmgr_savefilters: Zotero.ZotCard.Prefs.getJson('cardmgr.savefilters'),
					cardviewer_profiles: Zotero.ZotCard.Prefs.getJson('cardmgr.cardviewer_profiles'),
					recently_move_collections: Zotero.ZotCard.Prefs.getJson('movemgr.recently_move_collections'),
					movemgr_recently_move_collection_quantity: Zotero.ZotCard.Prefs.get('movemgr.recently_move_collection_quantity'),
					imagemgr_tinify_api_key: Zotero.ZotCard.Prefs.get('imagemgr.tinify_api_key'),
					meditmgr: Zotero.ZotCard.Prefs.getJson('meditmgr'),
					printcard: Zotero.ZotCard.Prefs.getJson('printcard'),
					noteBGColor: Zotero.ZotCard.Notes.getNoteBGColor()
				};

				Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
					backup[type] = Zotero.ZotCard.Cards.initPrefs(type);
				});

				for (let index = 0; index < backup.card_quantity; index++) {
					const type = Zotero.ZotCard.Cards.customCardType(index);
					backup[type] = Zotero.ZotCard.Cards.initPrefs(type);
				}

				Zotero.ZotCard.Logger.log(backup);
				
				Zotero.File.putContents(Zotero.File.pathToFile(file.path + '.zotcard'), JSON.stringify(backup));
				Zotero.ZotCard.Messages.success(window, this._l10n.formatValueSync('zotero-zotcard-preferences-backup-successful'));
			}
		}.bind(this))
	},

	restore: function() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		fp.init(window, this._l10n.formatValueSync('zotero-zotcard-preferences-restore'), Ci.nsIFilePicker.modeOpen);
		fp.appendFilter('ZotCard Backup', '*.zotcard');
		fp.open(function (returnConstant) {
			if (returnConstant === 0) {
				let file = fp.file;
				file.QueryInterface(Ci.nsIFile);
				let content = Zotero.File.getContents(file.path);
				if (content) {
					try {
						let backup = JSON.parse(content);
						if (backup.last_updated) {
							if (backup.card_quantity) {
								Zotero.ZotCard.Prefs.set('card_quantity', backup.card_quantity);
							} else {
								Zotero.ZotCard.Prefs.clear('card_quantity');
							}
							if (backup.word_count_style) {
								Zotero.ZotCard.Prefs.set('word_count_style', backup.word_count_style);
							} else {
								Zotero.ZotCard.Prefs.clear('word_count_style');
							}
							if (backup.enable_word_count) {
								Zotero.ZotCard.Prefs.set('enable_word_count', backup.enable_word_count);
							} else {
								Zotero.ZotCard.Prefs.clear('enable_word_count');
							}
							if (backup.startOfWeek) {
								Zotero.ZotCard.Prefs.set('startOfWeek', backup.startOfWeek);
							} else {
								Zotero.ZotCard.Prefs.clear('startOfWeek');
							}
							if (backup.cardmgr_profiles) {
								Zotero.ZotCard.Prefs.setJson('cardmgr.profiles', backup.cardmgr_profiles);
							} else {
								Zotero.ZotCard.Prefs.clear('cardmgr.profiles');
							}
							if (backup.cardmgr_savefilters) {
								Zotero.ZotCard.Prefs.setJson('cardmgr.savefilters', backup.cardmgr_savefilters);
							} else {
								Zotero.ZotCard.Prefs.clear('cardmgr.savefilters');
							}
							if (backup.cardviewer_profiles) {
								Zotero.ZotCard.Prefs.setJson('cardviewer.profiles', backup.cardviewer_profiles);
							} else {
								Zotero.ZotCard.Prefs.clear('cardviewer.profiles');
							}
							if (backup.meditmgr) {
								Zotero.ZotCard.Prefs.setJson('meditmgr', backup.meditmgr);
							} else {
								Zotero.ZotCard.Prefs.clear('meditmgr');
							}
							if (backup.movemgr_recently_move_collections) {
								Zotero.ZotCard.Prefs.setJson('movemgr.recently_move_collections', backup.movemgr_recently_move_collections);
							} else {
								Zotero.ZotCard.Prefs.clear('movemgr.recently_move_collections');
							}
							if (backup.movemgr_recently_move_collection_quantity) {
								Zotero.ZotCard.Prefs.set('movemgr.recently_move_collection_quantity', backup.movemgr_recently_move_collection_quantity);
							} else {
								Zotero.ZotCard.Prefs.clear('movemgr.recently_move_collection_quantity');
							}
							if (backup.imagemgr_tinify_api_key) {
								Zotero.ZotCard.Prefs.set('imagemgr.tinify_api_key', backup.imagemgr_tinify_api_key);
							} else {
								Zotero.ZotCard.Prefs.clear('imagemgr.tinify_api_key');
							}
							Zotero.ZotCard.Notes.noteBGColor(backup.noteBGColor);

							Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
								if (backup[type]) {
									Zotero.ZotCard.Prefs.set(`${type}`, backup[type].card);
									Zotero.ZotCard.Prefs.set(`${type}.label`, backup[type].label);
									Zotero.ZotCard.Prefs.set(`${type}.visible`, backup[type].visible);
								} else {
									Zotero.ZotCard.Prefs.clear(`${type}`);
									Zotero.ZotCard.Prefs.clear(`${type}.label`);
									Zotero.ZotCard.Prefs.clear(`${type}.visible`);
								}
							});

							for (let index = 0; index < backup.card_quantity; index++) {
								const type = Zotero.ZotCard.Cards.customCardType(index);
								if (backup[type]) {
									Zotero.ZotCard.Prefs.set(`${type}`, backup[type].card);
									Zotero.ZotCard.Prefs.set(`${type}.label`, backup[type].label);
									Zotero.ZotCard.Prefs.set(`${type}.visible`, backup[type].visible);
								} else {
									Zotero.ZotCard.Prefs.clear(`${type}`);
									Zotero.ZotCard.Prefs.clear(`${type}.label`);
									Zotero.ZotCard.Prefs.clear(`${type}.visible`);
								}
							}

							Zotero.ZotCard.Messages.success(window, this._l10n.formatValueSync('zotero-zotcard-preferences-restore-successful', {last_updated: backup.last_updated}));
						} else {
							Zotero.ZotCard.Messages.warning(window, this._l10n.formatValueSync('zotero-zotcard-preferences-restore-error-file'));
						}
					} catch (e) {
						Zotero.ZotCard.Messages.warning(window, e);
					}
				} else {
					Zotero.ZotCard.Messages.warning(window, this._l10n.formatValueSync('zotero-zotcard-preferences-restore-error-file'));
				}
			}
		}.bind(this))
	},

	reset: function() {
		if (Zotero.ZotCard.Messages.confirm(window, this._l10n.formatValueSync('zotero-zotcard-preferences-reset-confirm'))) {
			Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
				Zotero.ZotCard.Prefs.clear(type);
				Zotero.ZotCard.Prefs.clear(`${type}.label`);
				Zotero.ZotCard.Prefs.clear(`${type}.visible`);
			});

			let card_quantity = Zotero.ZotCard.Prefs.get('card_quantity', 0);
			for (let index = 0; index < card_quantity; index++) {
				const type = Zotero.ZotCard.Cards.customCardType(index);
				Zotero.ZotCard.Prefs.clear(`${type}`);
				Zotero.ZotCard.Prefs.clear(`${type}.label`);
				Zotero.ZotCard.Prefs.clear(`${type}.visible`);
			}
			Zotero.ZotCard.Prefs.clear('card_quantity');
			Zotero.ZotCard.Prefs.clear('word_count_style');
			Zotero.ZotCard.Prefs.clear('enable_word_count');
			Zotero.ZotCard.Prefs.clear('startOfWeek');
			Zotero.ZotCard.Prefs.clear('cardmgr.profiles');
			Zotero.ZotCard.Prefs.clear('cardmgr.savefilters');
			Zotero.ZotCard.Prefs.clear('cardviewer.profiles');
			Zotero.ZotCard.Prefs.clear('movemgr.recently_move_collections');
			Zotero.ZotCard.Prefs.clear('movemgr.recently_move_collection_quantity');
			Zotero.ZotCard.Prefs.clear('imagemgr.tinify_api_key');
			Zotero.ZotCard.Prefs.clear('meditmgr');
			Zotero.ZotCard.Prefs.clear('printcard');

			Zotero.ZotCard.Notes.noteBGColor(undefined);

			Zotero.ZotCard.Messages.success(window, this._l10n.formatValueSync('zotero-zotcard-preferences-reset-successful'));
		}
	}
}
