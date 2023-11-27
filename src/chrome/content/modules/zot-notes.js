if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Notes) Zotero.ZotCard.Notes = {};

Zotero.ZotCard.Notes = Object.assign(Zotero.ZotCard.Notes, {
	init() {
		Zotero.ZotCard.Logger.log('Zotero.ZotCard.Notes inited.');

    // extend Zotero.Search.prototype.search

    // /**
    //  * Run the search and return an array of item ids for results
    //  *
    //  * @param {Boolean} [asTempTable=false]
    //  * @return {Promise}
    //  */
    // Zotero.Search.prototype.searchex = Zotero.Promise.coroutine(function* (limit, offset, asTempTable) {
    //   var tmpTable;
      
    //   // Mark conditions as loaded
    //   // TODO: Necessary?
    //   if (!this._identified) {
    //     this._requireData('conditions');
    //   }
    //   try {
    //     if (!this._sql){
    //       yield this._buildQuery();
    //     }
        
    //     // Default to 'all' mode
    //     var joinMode = 'all';
        
    //     // Set some variables for conditions to avoid further lookups
    //     for (let condition of Object.values(this._conditions)) {
    //       switch (condition.condition) {
    //         case 'joinMode':
    //           if (condition.operator == 'any') {
    //             joinMode = 'any';
    //           }
    //           break;
            
    //         case 'fulltextContent':
    //           var fulltextContent = true;
    //           break;
            
    //         case 'includeParentsAndChildren':
    //           if (condition.operator == 'true') {
    //             var includeParentsAndChildren = true;
    //           }
    //           break;
            
    //         case 'includeParents':
    //           if (condition.operator == 'true') {
    //             var includeParents = true;
    //           }
    //           break;
            
    //         case 'includeChildren':
    //           if (condition.operator == 'true') {
    //             var includeChildren = true;
    //           }
    //           break;
            
    //         case 'blockStart':
    //           var hasQuicksearch = true;
    //           break;
    //       }
    //     }
        
    //     // Run a subsearch to define the superset of possible results
    //     if (this._scope) {
    //       // If subsearch has post-search filter, run and insert ids into temp table
    //       if (this._scope.hasPostSearchFilter()) {
    //         var ids = yield this._scope.search();
    //         if (!ids) {
    //           return [];
    //         }
    //         tmpTable = yield Zotero.Search.idsToTempTable(ids);
    //       }
    //       // Otherwise, just copy to temp table directly
    //       else {
    //         tmpTable = "tmpSearchResults_" + Zotero.randomString(8);
    //         var sql = "CREATE TEMPORARY TABLE " + tmpTable + " AS "
    //           + (yield this._scope.getSQL());
    //         yield Zotero.DB.queryAsync(sql, yield this._scope.getSQLParams(), { noCache: true });
    //         var sql = "CREATE INDEX " + tmpTable + "_itemID ON " + tmpTable + "(itemID)";
    //         yield Zotero.DB.queryAsync(sql, false, { noCache: true });
    //       }
          
    //       // Search ids in temp table
    //       var sql = "SELECT GROUP_CONCAT(itemID) FROM items WHERE itemID IN (" + this._sql + ") "
    //         + "AND ("
    //         + "itemID IN (SELECT itemID FROM " + tmpTable + ")";
          
    //       if (this._scopeIncludeChildren) {
    //         sql += " OR itemID IN (SELECT itemID FROM itemAttachments"
    //         + " WHERE parentItemID IN (SELECT itemID FROM " + tmpTable + ")) OR "
    //         + "itemID IN (SELECT itemID FROM itemNotes"
    //         + " WHERE parentItemID IN (SELECT itemID FROM " + tmpTable + "))";
    //       }
    //       sql += ")";
          
    //       var res = yield Zotero.DB.valueQueryAsync(sql, this._sqlParams, { noCache: true });
    //       var ids = res ? res.split(",").map(id => parseInt(id)) : [];
    //       /*
    //       // DEBUG: Should this be here?
    //       //
    //       if (!ids) {
    //         Zotero.DB.query("DROP TABLE " + tmpTable);
    //         Zotero.DB.commitTransaction();
    //         return false;
    //       }
    //       */
    //     }
    //     // Or just run main search
    //     else {
    //       var ids = yield Zotero.DB.columnQueryAsync(this._sql, this._sqlParams, { noCache: true });
    //     }
        
    //     //Zotero.debug('IDs from main search or subsearch: ');
    //     //Zotero.debug(ids);
    //     //Zotero.debug('Join mode: ' + joinMode);
        
    //     // Filter results with full-text search
    //     //
    //     // If join mode ALL, return the (intersection of main and full-text word search)
    //     // filtered by full-text content.
    //     //
    //     // If join mode ANY or there's a quicksearch (which we assume fulltextContent is part of)
    //     // and the main search is filtered by other conditions, return the union of the main search
    //     // and (separate full-text word searches filtered by fulltext content).
    //     //
    //     // If join mode ANY or there's a quicksearch and the main search isn't filtered, return just
    //     // the union of (separate full-text word searches filtered by full-text content).
    //     var fullTextResults;
    //     var joinModeAny = joinMode == 'any' || hasQuicksearch;
    //     for (let condition of Object.values(this._conditions)) {
    //       if (condition.condition != 'fulltextContent') continue;
          
    //       if (!fullTextResults) {
    //         // For join mode ANY, if we already filtered the main set, add those as results.
    //         // Otherwise, start with an empty set.
    //         fullTextResults = joinModeAny && this._hasPrimaryConditions
    //           ? ids
    //           : [];
    //       }
          
    //       let scopeIDs;
    //       // Regexp mode -- don't use full-text word index
    //       let numSplits;
    //       if (condition.mode && condition.mode.startsWith('regexp')) {
    //         // In ANY mode, include items that haven't already been found, as long as they're in
    //         // the right library
    //         if (joinModeAny) {
    //           let tmpTable = yield Zotero.Search.idsToTempTable(fullTextResults);
    //           let sql = "SELECT GROUP_CONCAT(itemID) FROM items WHERE "
    //             + "itemID NOT IN (SELECT itemID FROM " + tmpTable + ")";
    //           if (this.libraryID) {
    //             sql += " AND libraryID=?";
    //           }
    //           let res = yield Zotero.DB.valueQueryAsync(sql, this.libraryID, { noCache: true });
    //           scopeIDs = res ? res.split(",").map(id => parseInt(id)) : [];
    //           yield Zotero.DB.queryAsync("DROP TABLE " + tmpTable, false, { noCache: true });
    //         }
    //         // In ALL mode, include remaining items from the main search
    //         else {
    //           scopeIDs = ids;
    //         }
    //       }
    //       // If not regexp mode, run a new search against the full-text word index for words in
    //       // this phrase
    //       else {
    //         //Zotero.debug('Running subsearch against full-text word index');
    //         let s = new Zotero.Search();
    //         if (this.libraryID) {
    //           s.libraryID = this.libraryID;
    //         }
    //         let splits = Zotero.Fulltext.semanticSplitter(condition.value);
    //         for (let split of splits){
    //           s.addCondition('fulltextWord', condition.operator, split);
    //         }
    //         numSplits = splits.length;
    //         let wordMatches = yield s.search();
            
    //         //Zotero.debug("Word index matches");
    //         //Zotero.debug(wordMatches);
            
    //         // In ANY mode, include hits from word index that aren't already in the results
    //         if (joinModeAny) {
    //           let resultsSet = new Set(fullTextResults);
    //           scopeIDs = wordMatches.filter(id => !resultsSet.has(id));
    //         }
    //         // In ALL mode, include the intersection of hits from word index and remaining
    //         // main search matches
    //         else {
    //           let wordIDs = new Set(wordMatches);
    //           scopeIDs = ids.filter(id => wordIDs.has(id));
    //         }
    //       }
          
    //       // If only one word, just use the results from the word index
    //       let filteredIDs = [];
    //       if (numSplits === 1) {
    //         filteredIDs = scopeIDs;
    //       }
    //       // Search the full-text content
    //       else if (scopeIDs.length) {
    //         let found = new Set(
    //           yield Zotero.Fulltext.findTextInItems(
    //             scopeIDs,
    //             condition.value,
    //             condition.mode
    //           ).map(x => x.id)
    //         );
    //         // Either include or exclude the results, depending on the operator
    //         filteredIDs = scopeIDs.filter((id) => {
    //           return found.has(id)
    //             ? condition.operator == 'contains'
    //             : condition.operator == 'doesNotContain';
    //         });
    //       }
          
    //       //Zotero.debug("Filtered IDs:")
    //       //Zotero.debug(filteredIDs);
          
    //       // If join mode ANY, add any new items from the full-text content search to the results,
    //       // and remove from the scope so that we don't search through items we already matched
    //       if (joinModeAny) {
    //         //Zotero.debug("Adding filtered IDs to results and removing from scope");
    //         fullTextResults = fullTextResults.concat(filteredIDs);
            
    //         let idSet = new Set(ids);
    //         for (let id of filteredIDs) {
    //           idSet.delete(id);
    //         }
    //         ids = Array.from(idSet);
    //       }
    //       else {
    //         //Zotero.debug("Replacing results with filtered IDs");
    //         ids = filteredIDs;
    //         fullTextResults = filteredIDs;
    //       }
    //     }
    //     if (fullTextResults) {
    //       ids = Array.from(new Set(fullTextResults));
    //     }
        
    //     if (this.hasPostSearchFilter() &&
    //         (includeParentsAndChildren || includeParents || includeChildren)) {
    //       var tmpTable = yield Zotero.Search.idsToTempTable(ids);
          
    //       if (includeParentsAndChildren || includeParents) {
    //         //Zotero.debug("Adding parent items to result set");
    //         var sql = "SELECT parentItemID FROM itemAttachments "
    //           + "WHERE itemID IN (SELECT itemID FROM " + tmpTable + ") "
    //             + " AND parentItemID IS NOT NULL "
    //           + "UNION SELECT parentItemID FROM itemNotes "
    //             + "WHERE itemID IN (SELECT itemID FROM " + tmpTable + ")"
    //             + " AND parentItemID IS NOT NULL";
    //       }
          
    //       if (includeParentsAndChildren || includeChildren) {
    //         //Zotero.debug("Adding child items to result set");
    //         var childrenSQL = "SELECT itemID FROM itemAttachments WHERE "
    //           + "parentItemID IN (SELECT itemID FROM " + tmpTable + ") UNION "
    //           + "SELECT itemID FROM itemNotes WHERE parentItemID IN "
    //           + "(SELECT itemID FROM " + tmpTable + ")";
              
    //         if (includeParentsAndChildren || includeParents) {
    //           sql += " UNION " + childrenSQL;
    //         }
    //         else {
    //           sql = childrenSQL;
    //         }
    //       }
          
    //       sql = "SELECT GROUP_CONCAT(itemID) FROM items WHERE itemID IN (" + sql + ")";

    //       // extend by 018
    //       if (limit) {
    //         sql += " LIMIT " + limit;
    //       }
    //       if (offset) {
    //         sql += " OFFSET " + offset;
    //       }

    //       var res = yield Zotero.DB.valueQueryAsync(sql, false, { noCache: true });
    //       var parentChildIDs = res ? res.split(",").map(id => parseInt(id)) : [];
          
    //       // Add parents and children to main ids
    //       for (let id of parentChildIDs) {
    //         if (!ids.includes(id)) {
    //           ids.push(id);
    //         }
    //       }
    //     }
    //   }
    //   finally {
    //     if (tmpTable && !asTempTable) {
    //       yield Zotero.DB.queryAsync("DROP TABLE IF EXISTS " + tmpTable, false, { noCache: true });
    //     }
    //   }
      
    //   //Zotero.debug('Final result set');
    //   //Zotero.debug(ids);
      
    //   if (!ids || !ids.length) {
    //     return [];
    //   }
      
    //   if (asTempTable) {
    //     return Zotero.Search.idsToTempTable(ids);
    //   }
    //   return ids;
    // });
	},

  getNoteBGColor() {
    let val = Zotero.Prefs.get('note.css');
    if (val) {
      let match = val.match(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/);
      if (match) {
        return match[1];
      }
    }
    return ''
  },

  // .primary-editor { background-color: #0F0 } .primary-editor p { line-height: 20; }
  noteBGColor(color) {
    let val = Zotero.Prefs.get('note.css');
    val = val.replace(/body +{ background-color: (#[0-9A-Fa-f]{6}); }/g, '');
    if (val) {
      if (color) {
        if (val.match(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/)) {
          val = val.replace(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/g, `.primary-editor { background-color: ${color}; }`);
        } else {
          val += ` .primary-editor { background-color: ${color}; }`;
        }
      } else {
        val = val.replace(/\.primary-editor +{ background-color: (#[0-9A-Fa-f]{6}); }/g, '');
      }
    } else {
      if (color) {
        val = `.primary-editor { background-color: ${color}; }`;
      }
    }
    Zotero.Prefs.set('note.css', val);
  },

  htmlToText(html) {
    // var nsIFC = Components.classes['@mozilla.org/widget/htmlformatconverter;1'].createInstance(Components.interfaces.nsIFormatConverter);
    // var from = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
    // from.data = html;
    // var to = { value: null };
    // try {
    //   nsIFC.convert('text/html', from, from.toString().length, 'text/unicode', to, {});
    //   to = to.value.QueryInterface(Components.interfaces.nsISupportsString);
    //   return to.toString();
    // } catch (e) {
    //   return html;
    // }


    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent;
  },

  statistics(html) {
    let words = 0;
    let en_words = 0;
    let cn_words = 0;
    let num_words = 0;
    let lines = 0;
    let length = 0;
    let sizes = 0;

    if (html && html.length > 0) {
      sizes = html.length;
      let content = this.htmlToText(html);
      length = content.length;
      if (length) {
        let mcnword1 = content.match(/[\u4E00-\u9FA5]/g);
        let mcnword2 = content.match(/[\u9FA6-\u9FEF]/g);
        let men_word = content.match(/[a-z|A-Z]+/g);
        let mnum_word = content.match(/[0-9]+/g);
        let mlines = content.match(/\n/g);
        en_words = men_word ? men_word.length : 0;
        cn_words = (mcnword1 ? mcnword1.length : 0) + (mcnword2 ? mcnword2.length : 0);
        num_words = mnum_word ? mnum_word.length : 0;
        words = en_words + cn_words + num_words;
        lines = mlines ? (mlines.length + 1) : (content.length > 0 ? 1 : 0);
      }
    }
    return {words, en_words, cn_words, num_words, length, lines, sizes};
  },

  statisticsToText(statistics) {
    let word = '';
    let word_params = {
      words: statistics.words.toString(),
      cn_words: statistics.cn_words.toString(),
      cn_scale: statistics.length > 0 ? (Zotero.ZotCard.Utils.scale(statistics.cn_words / statistics.length, 1) + '%') : '-',
      en_words: statistics.en_words.toString(),
      en_scale: statistics.words > 0 ? (Zotero.ZotCard.Utils.scale(statistics.en_words / statistics.length, 1) + '%') : '-',
      num_words: statistics.num_words.toString(),
      num_scale: statistics.words > 0 ? (Zotero.ZotCard.Utils.scale(statistics.num_words / statistics.length, 1) + '%') : '-',
      other_words: statistics.words - statistics.cn_words - statistics.en_words - statistics.num_words,
      other_scale: statistics.words > 0 ? (Zotero.ZotCard.Utils.scale((statistics.words - statistics.cn_words - statistics.en_words - statistics.num_words) / statistics.length, 1) + '%') : '-',
    };
    if (statistics.words > 0) {
      if (word_params.words > 0) {
        if (word.length > 0) {
          word += '　';
        }
        word += `${word_params.words}`;
      }
      if (word_params.cn_words > 0) {
        if (word.length > 0) {
          word += '　';
        }
        word += `㊥:${word_params.cn_words}(${word_params.cn_scale})`;
      }
      if (word_params.en_words > 0) {
        if (word.length > 0) {
          word += '　';
        }
        word += `🅰:${word_params.en_words}(${word_params.en_scale})`;
      }
      if (word_params.num_words > 0) {
        if (word.length > 0) {
          word += '　';
        }
        word += `➊:${word_params.num_words}(${word_params.num_scale})`;
      }
      if (word_params.other_words > 0) {
        if (word.length > 0) {
          word += '　';
        }
        word += `⊜:${word_params.other_words}(${word_params.other_scale})`;
      }
    } else {
      word = '0';
    }
    let displayStore = Zotero.ZotCard.Utils.displayStore(statistics.sizes);
    return {
      text: word,
      title: Zotero.ZotCard.L10ns.getString('zotcard-words-title', word_params),
      space: `${displayStore.text} (${Zotero.ZotCard.L10ns.getString('zotcard-sizes-contentscale', word_params)}${statistics.sizes > 0 ? Zotero.ZotCard.Utils.scale(statistics.words / statistics.sizes, 1) : 0}%)`
    };
  },

  translationToMarkdown(html) {
    let item = new Zotero.Item('note');
    item.libraryID = 1;
    item.setNote(html);
    let text = '';
    var translation = new Zotero.Translate.Export;
    translation.noWait = true;
    translation.setItems([item]);
    translation.setTranslator(Zotero.Translators.TRANSLATOR_ID_NOTE_MARKDOWN);
    translation.setHandler("done", (obj, worked) => {
      if (worked) {
        text = obj.string.replace(/\r\n/g, '\n');
      }
    });
    translation.translate();
    return text;
  },

  // translationToText(html) {
  //   let content = html.trim();
  //   content = content.replace(/(<\/(h\d|p|div)+>)/g, '$1\n');
  //   content = content.replace(/<br\s*\/?>/g, '\n');
  //   content = Zotero.Utilities.unescapeHTML(content);
  //   return content;
  // },

  // 抓取除去内容的标题HTML
  grabNoteTitleHtml(text) {
    text = text.replace(/(<\/(h\d|p|div)+>)/g, '$1\n');
    text = text.replace(/<br\s*\/?>/g, ' ');
    let matchs = text.match(/(<(h\d|p|div)+>.*?<\/(h\d|p|div)+>)\n/);
    if (matchs) {
      return matchs[1];
    }
    return text;
  },
  
  // 抓取除去标题的内容HTML
  grabNoteContentHtml(html) {
    let title = Zotero.Utilities.Item.noteToTitle(html);
    if (title) {
      let reg = '.*?' + title.match(/[\u4e00-\u9fa5|0-9|a-z|A-Z]/g).join('.*?') + '.*?\\n';
      let text = html.replace(/(<\/(h\d|p|div)+>)/g, '$1\n');
      
      return text.replace(new RegExp(reg), '');
    } else {
      return html;
    }
  },

  search: function (libraryID, collectionKey, savedSearchKey, excludeCollectionKeys) {
    Zotero.ZotCard.Logger.log({libraryID, collectionKey, savedSearchKey, excludeCollectionKeys});
    
    var search = new Zotero.Search();
    search.libraryID = libraryID;
    // search.addCondition('note', 'contains', '');
    search.addCondition('itemType', 'is', 'note');
    search.addCondition('deleted', 'false', null);
    if (Zotero.ZotCard.Objects.isNoEmptyArray(excludeCollectionKeys)) {
      excludeCollectionKeys.forEach(key => {
        search.addCondition('collection', 'isNot', key);
      });
    }
    
    if (collectionKey) {
      search.addCondition('collection', 'is', collectionKey);
      search.addCondition('includeParentsAndChildren', 'true', null);
      search.addCondition('recursive', 'true', null);
    } else if (savedSearchKey) {
      search.addCondition('savedSearch', 'is', savedSearchKey);
    } else {
      search.addCondition('includeParentsAndChildren', 'true', null);
      search.addCondition('recursive', 'true', null);
    }
    return search.search();
  },

  links(noteID) {
    let links = [];
    let note = Zotero.Items.get(noteID);
    if (note.parentItem) {
      links.push(...Zotero.ZotCard.Items.links(note.parentItemID));
    } else {
        let collectionID = note.getCollections()[0];
        links.push(...Zotero.ZotCard.Collections.links(collectionID));
    }
    links.push({type: 'note', dataObject: note});
    return links;
  },
});