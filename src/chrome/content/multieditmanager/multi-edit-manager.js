const { createApp, ref, reactive, toRaw } = Vue
const { ElMessageBox } = ElementPlus

!ZotElementPlus.isZoteroDev && Components.utils.import('resource://gre/modules/Services.jsm');

window.onload = function () {
  const _l10n = ZotElementPlus.isZoteroDev ? undefined : new Localization(["multi-edit-manager.ftl", "zotcard.ftl"], true);

  ZotElementPlus.createElementPlusApp({
    setup() {
      let meditmgr = ZotElementPlus.isZoteroDev ? {columns: 5, rows: 3} : Zotero.ZotCard.Prefs.getJson('meditmgr', {columns: 5, rows: 3});

      const columns = ref(meditmgr.columns);
      const rows = ref(meditmgr.rows);
      const current_open = ref(_l10n.formatValueSync('zotcard-multi-edit-manager-current_open', {total: 0}));

      const _init = () => {
        setInterval(() => {
          let total = 0;
          var enumerator= Services.wm.getEnumerator('zotero:note');
          while (enumerator.hasMoreElements()) {
            enumerator.getNext();
            total++;
          }
          current_open.value = _l10n.formatValueSync('zotcard-multi-edit-manager-current_open', {total: total});
        }, 1000);

        setTimeout(() => {
          handleChange();
        }, 500);

        ZotElementPlus.isZoteroDev || Zotero.ZotCard.Logger.log('inited.');
      }

      function handleChange() {
        var width = window.screen.availWidth / columns.value;
        var height = window.screen.availHeight / rows.value;
        var enumerator= Services.wm.getEnumerator('zotero:note');
        var w = 0;
        var h = 0;
        while (enumerator.hasMoreElements()) {
          var win = enumerator.getNext();
          
          win.outerWidth = width;
          win.outerHeight = height;
          if (w < window.screen.availWidth && h < window.screen.availHeight) {
            win.moveTo(w, h);
          }
          win.focus();

          if ((w + win.outerWidth) < window.screen.availWidth) {
            w += win.outerWidth;
          } else if ((h + win.outerHeight) < window.screen.availHeight) {
            w = 0;
            h += win.outerHeight;
          }
        }

        window.focus();

        Zotero.ZotCard.Prefs.setJson('meditmgr', {columns: columns.value, rows: rows.value});
      }

      function handleTools(field) {
        switch (field) {
          case 'adjust':
            handleChange();
            break;
          case 'closeall':
            var enumerator= Services.wm.getEnumerator('zotero:note');
            while (enumerator.hasMoreElements()) {
              var win = enumerator.getNext();
              win.close();
            }
            window.close();
            break;
          case 'close':
            window.close();
            break;
          default:
            break;
        }
      }

      _init();

      return {
        columns,
        rows,
        current_open,
        handleChange,
        handleTools
      }
    }
  });
}

