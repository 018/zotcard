const { createApp, ref, reactive, toRaw } = Vue
const { ElMessageBox } = ElementPlus

var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : (ZotElementPlus.isZoteroDev ? {} : undefined);

if (!io) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter is incorrect.');
} else {

  io = Object.assign(io, { dataOut: [] })

  window.onload = function () {
    const _l10n = ZotElementPlus.isZoteroDev ? undefined : new Localization(["batchnewcard.ftl", "zotcard.ftl"], true);

    function _pushPref(items, type) {
      let pref = ZotElementPlus.isZoteroDev ? {visible: true, card: '1', label: 'dev'} : Zotero.ZotCard.Cards.initPrefs(type);
      if (pref.visible && pref.card.length > 0) {
        items.push({
          type: type,
          label: pref.label,
          value: 0
        });
      }
    };
    ZotElementPlus.createElementPlusApp({
      setup() {
        const cards = reactive([]);
        const all = ref();

        const _init = () => {
          ZotElementPlus.isZoteroDev || Zotero.ZotCard.Consts.defCardTypes.forEach(type => {
            _pushPref(cards, type)
          });
          let quantity = ZotElementPlus.isZoteroDev ? 2 : Zotero.ZotCard.Prefs.get('card_quantity', Zotero.ZotCard.Consts.card_quantity)
          for (let index = 0; index < quantity; index++) {
            _pushPref(cards, Zotero.ZotCard.Cards.customCardType(index))
          }
          ZotElementPlus.isZoteroDev || Zotero.ZotCard.Logger.log('inited.');
        }

        function handleAllChange(val) {
          cards.forEach(element => {
            element.value = val;
          });
        }

        function handleValueChange(val) {
          all.value = undefined;
        }

        function submit() {
          io.dataOut = [];
          cards.forEach(element => {
            if (element.value > 0) {
              io.dataOut.push(element);
            }
          });
          if (io.dataOut.length === 0) {
            ElMessageBox.alert(_l10n.formatValueSync('zotcard-batchnewcard-please_enter'), Zotero.getString('general.error'), {
              confirmButtonText: 'OK'
            });
            return;
          }

          window.close();
        }

        function cancel() {
          window.close();
        }

        _init();

        return {
          all,
          cards,
          handleAllChange,
          handleValueChange,
          submit,
          cancel
        }
      }
    });
  }
}

