const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;
var { OS } = ChromeUtils.importESModule("chrome://zotero/content/osfile.mjs");

// dataIn: [{type: 'library', id: 1}, {type: 'collection', id: 1}, {type: 'search', id: 1}, {type: 'item', id: 1}, {type: 'note', id: 1}]
// cards: [{...}]

var notifierID = 0;
var _dataIn;
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined;
if (!io) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter io is incorrect.');
} else if (Zotero.ZotCard.Objects.isEmptyArray(io.dataIn)) {
  window.close();
  Zotero.ZotCard.Messages.error(undefined, 'The parameter dataIn or cards is incorrect.');
} else {
  _dataIn = io.dataIn;
  Zotero.ZotCard.Logger.trace('_dataIn', _dataIn?.length);

  const parentIDs = Zotero.ZotCard.Cards.parseParentIDs(_dataIn || []);
  Zotero.ZotCard.Logger.trace('parentIDs', parentIDs);

  window.onload = async function () {
    const _l10n = new Localization(["card-image-compression.ftl", "zotcard.ftl"], true);

    Zotero.ZotCard.Logger.ding();
    ZotElementPlus.createElementPlusApp({
      setup() {
        Zotero.ZotCard.Logger.ding();
        const ZotCardConsts = reactive(Zotero.ZotCard.Consts);
        const images = reactive([]);
        const renders = reactive({
          percentage: 100,
          doing: false
        })

        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        });

        const _init = async () => {
          setTimeout(async () => {
            Zotero.ZotCard.Logger.ding();
            await _reload();
            ZotElementPlus.Console.log('inited.');
          }, 50);
        }

        const _reload = async () => {
          loading.visible = true;
          let allCards = [];
          if (Zotero.ZotCard.Objects.isNoEmptyArray(parentIDs)) {
            await Zotero.ZotCard.Cards.load(window, undefined, allCards, parentIDs, {
              excludeTitle: '',
              excludeCollectionOrItemKeys: []
            }, false);
          } else {
          }

          for (let index = 0; index < allCards.length; index++) {
            const card = allCards[index];
            let matchs = card.note.html.match(/data-attachment-key="(.*?)"/g);
            if (matchs) {
              let item = Zotero.Items.get(card.id);
              for (let index = 0; index < matchs.length; index++) {
                const m = matchs[index];
                let key = m.match(/data-attachment-key="(.*?)"/)[1];
                let image = Zotero.Items.getByLibraryAndKey(item.libraryID, key);
                let path = image.getFilePath();
                let info = await OS.File.stat(path);
                images.push({
                  key: key,
                  url: `zotero://attachment/library/items/${key}`,
                  path: path,
                  isSelected: true,
                  size: info.size,
                  status: 0,
                  message: Zotero.ZotCard.Utils.displayStore(info.size).text,
                })
              }
            }
          }

          Zotero.ZotCard.Logger.log(images);
          
          if (images.length === 0) {
            window.close();
            Zotero.ZotCard.Messages.error(undefined, _l10n.formatValueSync('zotcard-card-image-compression-no-file'));
          }

          loading.close();
          Zotero.ZotCard.Logger.ding();
        }

        async function handleCompression() {
          let tinifyApiKey = Zotero.ZotCard.Prefs.get('imagemgr.tinify_api_key');
          if (!tinifyApiKey) {
            Zotero.ZotCard.Messages.warning(window, _l10n.formatValueSync('zotcard-card-image-compression-please_configure_tinify_api_key'));
            return;
          }

          renders.percentage = 0;
          renders.doing = true;
          loading.visible = true;
          for (let index = 0; index < images.length; index++) {
            const img = images[index];
            if (img.isSelected) {
              img.message = _l10n.formatValueSync('zotcard-card-image-compression-doing');
              img.status = 1;

              var file = Zotero.File.pathToFile(img.path);
              if (!file.exists()) {
                img.message = _l10n.formatValueSync('zotcard-card-image-compression-file-no-exists');
                img.status = -1;
              } else {
                let authorization = 'Basic ' + Zotero.Utilities.Internal.Base64.encode('api:' + tinifyApiKey)
                try {
                  let blob = await Zotero.ZotCard.Utils.getImageBlob(img.path);
                  let request = await Zotero.HTTP.request('POST', 'https://api.tinify.com/shrink', {
                    body: blob,
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': authorization
                    },
                    timeout: 60 * 1000 * 5,
                  });
  
                  Zotero.ZotCard.Logger.log(request.responseText);
                  if (request.status === 200 || request.status === 201) {
                    let res = JSON.parse(request.responseText);
                    if (res.error) {
                      img.message = `${res.error} - ${res.message}`;
                      img.status = -1;
                    } else {
                      let image = await Zotero.HTTP.request('GET', res.output.url, {
                        responseType: 'blob',
                        followRedirects: false,
                        timeout: 60 * 1000 * 5,
                      })
  
                      if (image.status === 200 || image.status === 201) {
                        Zotero.File.putContentsAsync(file, image.response);
                        img.message = _l10n.formatValueSync('zotcard-card-image-compression-successful', {
                          input: Zotero.ZotCard.Utils.displayStore(res.input.size).text,
                          output: Zotero.ZotCard.Utils.displayStore(res.output.size).text,
                          scale: Zotero.ZotCard.Utils.scale(1 - res.output.ratio, 2)});
                        img.status = 2;
                      } else if (image.status === 0) {
                        img.message = 'Net Error';
                        img.status = -1;
                      } else {
                        img.message = `${image.status} - ${image.statusText}`;
                        img.status = -1;
                      }
                    }
                  } else if (request.status === 0) {
                    img.message = 'Net Error';
                    img.status = -1;
                  } else {
                    img.message = `${request.status} - ${request.statusText}`;
                    img.status = -1;
                  }
                } catch (e) {
                  Zotero.debug(e)
                  img.message = e;
                  img.status = -1;
                }
              }
            }
            
            renders.percentage = parseInt(((index + 1) * 100 / images.length));
            
            await nextTick();
          }
          loading.close();
          renders.doing = false;
          Zotero.ZotCard.Logger.ding();
        }

        function handleSelected(img) {
          img.isSelected = !img.isSelected;
        }

        function handleSetting() {
          Zotero.openInViewer('chrome://zotcard/content/preferences/zotcard-preferences.html');
        }

        _init();

        return {
          ZotCardConsts,
          images,
          renders,
          handleCompression,
          handleSetting,
          handleSelected
        }
      }
    });
  }
}