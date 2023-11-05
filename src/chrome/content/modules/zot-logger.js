if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Logger) Zotero.ZotCard.Logger = {};

Zotero.ZotCard.Logger = Object.assign(Zotero.ZotCard.Logger, {
	init() {
    this.log('Zotero.ZotCard.Logger inited.');
  },

  // zotcard@zotero.org(3.0.1) zotcard.js:23: 

  isDebug() {
    return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled;
  },
  
  log(message) {
    if (this.isDebug()) {
      if (Zotero.ZotCard.Objects.isUndefined(message)) {
        this.debug('undefined');
      } else if (Zotero.ZotCard.Objects.isNull(message)) {
        this.debug('null');
      } else if (Zotero.ZotCard.Objects.isEmptyString(message)) {
        this.debug('');
      } else if (Zotero.ZotCard.Objects.isObject(message)) {
        this.debug(this._stringifyJSON(message));
      } else if (Zotero.ZotCard.Objects.isArray(message)) {
        this.debug('[' + message.join(', ') + ']');
      } else {
        this.debug(message);
      }
    }
  },
  
  trace(name, value) {
    if (this.isDebug()) {
      if (Zotero.ZotCard.Objects.isUndefined(value)) {
        this.debug('undefined');
      } else if (Zotero.ZotCard.Objects.isNull(value)) {
        this.debug('null');
      } else if (Zotero.ZotCard.Objects.isEmptyString(value)) {
        this.debug('');
      } else if (Zotero.ZotCard.Objects.isObject(value)) {
        this.debug(`${name} >>> ` + this._stringifyJSON(value));
      } else if (Zotero.ZotCard.Objects.isArray(value)) {
        this.debug(`${name} >>> [` + value.join(', ') + ']');
      } else {
        this.debug(`${name} >>> ${value}`);
      }
    }
  },
  

  error(err) {
    if (Zotero.ZotCard.Objects.isObject(err)) {
      Zotero.logError(`${this._outPrefix()} ${filename}:${line}@${method}: ` + JSON.stringify(err));
    } else if (Zotero.ZotCard.Objects.isArray(err)) {
      Zotero.logError(`${this._outPrefix()} ${filename}:${line}@${method}: ` + '[' + err.join(', ') + ']');
    } else {
      Zotero.logError(err);
    }
  },

  debug(message) {
    var {method, filename, line} = this.getStack();
    Zotero.debug(`${this._outPrefix()} ${filename}:${line}@${method}: ${message}`);
  },

  ding() {
    var {method, filename, line} = this.getStack();
    Zotero.debug(`${this._outPrefix()} ${filename}:${line}@${method} ${Zotero.isMac ? '📌' : '!'}`);
  },

  stack() {
    var array = new Error().stack.split('\n');
    var lines = '';
    var method, filename, line;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (!filename || filename == 'zot-logger.js' || filename == 'zot-render-element-plus.js') {
        filename = this._parseRegExpGroup(/.*\/(.*?js)\:.*$/, element);
        if (filename === 'zot-logger.js' || filename == 'zot-render-element-plus.js') {
          continue;
        }
      }
      
      if (!method) {
        method = this._parseRegExpGroup(/^(.*?)@.*$/, element);
        line = this._parseRegExpGroup(/(\d*)\:\d*$/, element);
      }
      lines += '  ' + element + '\n';
    }

    Zotero.debug(`${this._outPrefix()} ${filename}:${line}@${method}: \n${lines}`);
  },

  _stringifyJSON(value) {
    return JSON.stringify(value, null, 2).split('\n').map((e, i)=>i > 0 ? '  ' + e : e).join('\n');
  },

  getStack() {
    var array = new Error().stack.split('\n');
    var method, filename, line;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.includes('chrome://zotero/content/runJS.js')) {
        filename = 'runJS.js';
        method = '@';
        line = this._parseRegExpGroup(/(\d*)\:\d*$/, element);
        return {method, filename, line};
      }
      filename = this._parseRegExpGroup(/.*\/(.*?js)\:.*$/, element);

      if (filename === 'zot-logger.js' || filename == 'zot-render-element-plus.js') {
        continue;
      }

      method = this._parseRegExpGroup(/^(.*?)@.*$/, element);
      line = this._parseRegExpGroup(/(\d*)\:\d*$/, element);
      return {method, filename, line};
    }
  },

  _parseRegExpGroup(reg, str) {
    var ret = reg.exec(str);
    if (ret && str.length > 1) {
      return ret[1];
    } else {
      Zotero.debug(`${this._outPrefix()}: ${reg}, ${str}, ${ret}`);
    }
  },

  _outPrefix() {
    let now = moment().format('YYYY-MM-DD hh:mm:ss.SSS');
    return `${Zotero.isMac ? '🤪' : '^-^'}${now} - ${Zotero.ZotCard.Selfs.id}(${Zotero.ZotCard.Selfs.version})`;
  },
});