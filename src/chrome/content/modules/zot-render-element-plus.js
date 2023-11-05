(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ZotElementPlus = factory());
})(this, (function () {
  'use strict';
  const ZotElementPlus = {
    isZoteroDev: !window.Zotero,

    createElementPlusApp(options) {
      const app = Vue.createApp(options);
      if (window.ElementPlus) {
        if (window.ElementPlusLocaleZhCn || window.ElementPlusLocaleZhTw || window.ElementPlusLocaleEn) {
          app.use(window.ElementPlus, {
            locale: this.isZoteroDev || Zotero.locale === 'zh-CN' ? (window.ElementPlusLocaleZhCn || window.ElementPlusLocaleEn) : (Zotero.locale === 'zh-TW' ? (window.ElementPlusLocaleZhTw || window.ElementPlusLocaleEn) : window.ElementPlusLocaleEn),
            size: 'small',
            zIndex: 3000
          });
        } else {
          app.use(window.ElementPlus, { size: 'small', zIndex: 3000 });
        }
      }
      if (window.ElementPlusIconsVue) {
        for (const [key, component] of Object.entries(window.ElementPlusIconsVue)) {
          app.component(key, component);
        }
      }

      app.component('zot-text', {
        props: ['text'],
        setup(props) {
          if (props.text && props.text.toString().length) {
            return () => Vue.h('span', props.text);
          } else {
            return () => Vue.h('span', {style: {color: '#BDC4CC'}}, '-');
          }
        }
      });

      app.mount(document.getElementById('app'));
      return app;
    },

    debounce(fn, delay = 500) {
      var timer = null;
      return function () {
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(this, args);
        }.bind(this), delay);
      };
    },

    async sleep(timeout) {
      await ((timeout) => new Promise((resolve) => setTimeout(resolve, timeout)))(timeout);
    },

    Consts: {
      date_picker_shortcuts: [
        {
          text: '今天',
          value: () => {
            const date = new Date();
            return [date, date]
          }
        },
        {
          text: '昨天',
          value: () => {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            return [date, date];
          },
        },
        {
          text: '7天内',
          value: () => {
            const date = new Date();
            date.setDate(date.getDate() - 7);
            return [date, new Date()];
          },
        },
        {
          text: '本周',
          value: () => {
            const date = new Date();
            let startOfWeek = Zotero.ZotCard.Prefs.get('startOfWeek', Zotero.ZotCard.Consts.startOfWeek.sunday);
            date.setDate(date.getDate() - ((date.getDay() || 7) - startOfWeek));
            return [date, new Date()];
          },
        },
        {
          text: '本月',
          value: () => {
            const date = new Date();
            date.setDate(1);
            return [date, new Date()];
          },
        },
        {
          text: '本季度',
          value: () => {
            const date = new Date();
            let year = date.getYear() + 1900;
            let mouth = date.getMonth() + 1;
            let startMouth = 1;
            if (mouth <= 3) {
              startMouth = 1;
            } else if (mouth <= 6) {
              startMouth = 4;
            } else if (mouth <= 9) {
              startMouth = 7;
            } else if (mouth <= 12) {
              startMouth = 10;
            }
            return [new Date(year, startMouth - 1, 1), new Date()];
          },
        },
        {
          text: '这一年',
          value: () => {
            const date = new Date();
            date.setMonth(0);
            date.setDate(1);
            return [date, new Date()];
          },
        }
      ]
    },

    Console: {
      log(data) {
        if (ZotElementPlus.isZoteroDev) {
          console.log(data);
        } else {
          Zotero.ZotCard.Logger.log(data);
        }
      }
    }
  }

  return ZotElementPlus
}));