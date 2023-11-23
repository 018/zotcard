if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Objects) Zotero.ZotCard.Objects = {};

Zotero.ZotCard.Objects = Object.assign(Zotero.ZotCard.Objects, {
	init() {
    Array.prototype.groupBy = function(array, name) {
      const groups = {};
      array.forEach((e) =>{
        const group = e[name];
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.values(groups);
    };
	},

  isNull(value) {
    return value === null || Object.prototype.toString.call(value) === '[object Null]';
  },

  isUndefined(value) {
    return value === undefined || Object.prototype.toString.call(value) === '[object Undefined]';
  },

  isNullOrUndefined(value) {
    return this.isNull(value) || this.isUndefined(value);
  },

  isEmptyString(value) {
    return value === '';
  },

  isNoEmptyString(value) {
    return !this.isNullOrUndefined(value) && !this.isEmptyString(value);
  },

  isEmptyNumber(value) {
    return this.isNullOrUndefined(value) || (this.isNumber(value) && value.length === 0);
  },

  isNoEmptyNumber(value) {
    return this.isNumber(value) && this.isNoEmptyString(value) && value !== 0;
  },

  isString(value) {
    return value instanceof String || typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]';
  },

  isObject(value) {
    return value instanceof Object || typeof value === 'object' || Object.prototype.toString.call(value) === '[object Object]';
  },

  isArray(value) {
    return value instanceof Array || typeof value === 'array' || Object.prototype.toString.call(value) === '[object Array]';
  },

  isEmptyArray(value) {
    return this.isNullOrUndefined(value) || (this.isArray(value) && value.length === 0);
  },

  isNoEmptyArray(value) {
    return this.isArray(value) && value.length > 0;
  },

  isNumber(value) {
    return value instanceof Number || typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
  },

  isBoolean(value) {
    return typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Boolean]';
  },

  numberStartWiths(src, tar) {
    if(!this.isArray(src) || !this.isArray(tar)) {
      return false;
    }

    if (src.length < tar.length) {
      return false;
    }

    for (let index = 0; index < tar.length; index++) {
      const t = tar[index];
      const s = src[index];
      if (t !== s) {
        return false;
      }
    }

    return true;
  }
});