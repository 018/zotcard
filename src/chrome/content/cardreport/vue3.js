const { createApp, ref, reactive, toRaw, computed, nextTick, onMounted } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

window.onload = async function () {
  ZotElementPlus.createElementPlusApp({
    setup() {
      console.log('setuping');
      const text = ref('123');
      const el = ref();

      onMounted(() => {
        console.log('onMounted');
        document.getElementById('id').innerHTML = 'id...';

        // Vue.getCurrentInstance().refs['sectionRef'].innerHTML = 'onMounted';
        // 
        el.value.innerHTML = 'onMounted1';



       let iframe = document.querySelector('#editor-view');
        iframe.addEventListener('DOMContentLoaded', (event) => {
          // For iframes without chrome priviledges, for unknown reasons,
          // dataTransfer.getData() returns empty value for `drop` event
          // when dragging something from the outside of Zotero.
          // Update: Since fx102 non-standard data types don't work when dragging into an§ iframe,
          // while the original problem probably no longer exists
          iframe.contentWindow.addEventListener('drop', (event) => {
            iframe.contentWindow.wrappedJSObject.droppedData = Components.utils.cloneInto({
              'text/plain': event.dataTransfer.getData('text/plain'),
              'text/html': event.dataTransfer.getData('text/html'),
              'zotero/annotation': event.dataTransfer.getData('zotero/annotation'),
              'zotero/item': event.dataTransfer.getData('zotero/item')
            }, iframe.contentWindow);
          }, true);
        });

			let editorInstance = new Zotero.EditorInstance();
			editorInstance.init({
				// state,
				item: Zotero.Items.get(1017),
				// reloaded,
				iframeWindow: document.querySelector('#editor-view').contentWindow,
				// popup: this._id('editor-menu'),
				// onNavigate: this._navigateHandler,
				// viewMode: this.viewMode,
				// readOnly: this._mode != 'edit',
				// disableUI: this._mode == 'merge',
				// onReturn: this._returnHandler,
				// placeholder: this.placeholder
			});
        


        //   var ref = Zotero.Items.get(1017);
        //   Zotero.ZotCard.Logger.log(ref);
          
        // var libraryID = ref.libraryID;
        // type = Zotero.Libraries.get(libraryID).libraryType;
        // let noteEditor = document.getElementById('zotero-note-editor');
        // noteEditor.mode = 'edit';
        // noteEditor.item = ref;
        // noteEditor.viewMode = 'window';
        // document.title = ref.getNoteTitle();
        
        // // Set font size from pref
        // Zotero.setFontSize(noteEditor);
        
        // noteEditor.focus();

      });

      function onClick() {
        text.value = '321';
      }

      console.log('setuped');
      return {
        text,
        el,
        onClick,
      }
    }
  });
}
