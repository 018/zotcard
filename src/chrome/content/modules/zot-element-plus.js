const isDev = !window.Zotero;
if (!window.Vue || !window.ElementPlus) {
  console.log('Please load vue and element-plus first.');
} else {
  function createElementPlusApp(options) {
    const app = Vue.createApp(options);
    if (window.ElementPlus) {
      if (window.ElementPlusLocaleZhCn || window.ElementPlusLocaleZhTw || window.ElementPlusLocaleEn) {
        app.use(window.ElementPlus, {
          locale: isDev || Zotero.locale === 'zh-CN' ? (window.ElementPlusLocaleZhCn || window.ElementPlusLocaleEn) : (Zotero.locale === 'zh-TW' ? (window.ElementPlusLocaleZhTw || window.ElementPlusLocaleEn) : window.ElementPlusLocaleEn),
        });
      } else {
        app.use(window.ElementPlus);
      }
    }
    if (window.ElementPlusIconsVue) {
      for (const [key, component] of Object.entries(window.ElementPlusIconsVue)) {
        app.component(key, component)
      }
    }
    app.mount(document.getElementById('app'));
    return app;
  }
}