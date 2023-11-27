const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessageBox, ElLoading } = ElementPlus;

// dataIn: [{type: 'library', id: 1}, {type: 'collection', id: 1}, {type: 'search', id: 1}, {type: 'item', id: 1}, {type: 'note', id: 1}]
// cards: [{...}]

window.onload = async function () {
  ZotElementPlus.createElementPlusApp({
    setup() {
      const images = reactive([{
        key: '',
        url: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        path: '',
        isSelected: true
      }, {
        key: '',
        path: '',
        isSelected: true
      }, {
        key: '',
        path: '',
        isSelected: true
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 1,
        message: '正在压缩...'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: -1,
        message: '压缩失败'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 2,
        message: '压缩成功，压缩率40%，节省30KB。'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 0,
        message: ''
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 2,
        message: '压缩成功，压缩率40%，节省30KB。'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 0,
        message: ''
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 2,
        message: '压缩成功，压缩率40%，节省30KB。'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 0,
        message: ''
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 2,
        message: '压缩成功，压缩率40%，节省30KB。'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 0,
        message: ''
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 2,
        message: '压缩成功，压缩率40%，节省30KB。'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 0,
        message: ''
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 2,
        message: '压缩成功，压缩率40%，节省30KB。'
      }, {
        key: '',
        path: '',
        isSelected: true,
        status: 0,
        message: ''
      }]);
      const percentage = ref(40);

      return {
        images,
        percentage
      }
    }
  });
}