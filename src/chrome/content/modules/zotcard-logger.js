if (!Zotero.ZotCard) Zotero.ZotCard = {};

Zotero.ZotCard.Logger = {
	id: null,
	version: null,

	init({ id, version }) {
    this.id = id;
    this.version = version;

    this.log('Zotero.ZotCard.Logger inited.');
  },

  // zotcard@zotero.org(3.0.0) zotcard.js:23: 

  isDebug() {
    return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled;
  },
  
  log(message) {
    if (this.isDebug()) {
      if (message === undefined) {
        this.debug('undefined');
      } else if (message === null) {
        this.debug('null');
      } else if (message === '') {
        this.debug('');
      } else if (message instanceof Object || typeof message === 'object') {
        this.debug(this._stringifyJSON(message));
      } else if (message instanceof Array || typeof message === 'array') {
        this.debug('[' + message.join(', ') + ']');
      } else {
        this.debug(message);
      }
    }
  },
  
  trace(name, value) {
    if (this.isDebug()) {
      if (!value) {
        this.debug(`${name} >>> null.`);
        return;
      }

      if (value instanceof Object) {
        this.debug(`${name} >>> ` + this._stringifyJSON(value));
      } else if (value instanceof Array) {
        this.debug(`${name} >>> [` + value.join(', ') + ']');
      } else {
        this.debug(`${name} >>> ${value}`);
      }
    }
  },
  

  error(err) {
    if (err instanceof Object) {
      Zotero.logError(`${this.id}(${this.version}) ${filename}:${line}@${method}: ` + JSON.stringify(err));
    } else if (err instanceof Array) {
      Zotero.logError(`${this.id}(${this.version}) ${filename}:${line}@${method}: ` + '[' + err.join(', ') + ']');
    } else {
      Zotero.logError(err);
    }
  },

  debug(message) {
    var {method, filename, line} = this.getStack();
    Zotero.debug(`🤪${this.id}(${this.version}) ${filename}:${line}@${method}: ${message}`);
  },

  ding() {
    var {method, filename, line} = this.getStack();
    Zotero.debug(`🤪${this.id}(${this.version}) ${filename}:${line}@${method} 📌`);
  },

  stack() {
    var array = new Error().stack.split('\n');
    var lines = '';
    var method, filename, line;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (!filename || filename == 'zotcard-logger.js') {
        filename = this._parseRegExpGroup(/.*\/(.*?js)\:.*$/, element);
        if (filename === 'zotcard-logger.js') {
          continue;
        }
      }
      
      if (!method) {
        method = this._parseRegExpGroup(/^(.*?)@.*$/, element);
        line = this._parseRegExpGroup(/(\d*)\:\d*$/, element);
      }
      lines += '  ' + element + '\n';
    }

    Zotero.debug(`🤪${this.id}(${this.version}) ${filename}:${line}@${method}: \n${lines}`);
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

      if (filename === 'zotcard-logger.js') {
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
      Zotero.debug(`🤪${this.id}(${this.version}): ${reg}, ${str}, ${ret}`);
    }
  }
}