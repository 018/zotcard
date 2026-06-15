const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessage } = ElementPlus;

// 读取打开对话框时传入的参数：io.dataIn = [{type, id}]，取其中的父文献条目
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined;

window.onload = function () {
  ZotElementPlus.createElementPlusApp({
    setup() {
      const tree = reactive([]);
      const saving = ref(false);

      // ===== 卢曼编码工具函数 =====

      // 把编码切成段：'1a1' -> ['1','a','1']
      function segs(code) { return (code || '').match(/\d+|[a-z]+/gi) || []; }

      // 父编码：'1a1' -> '1a'；'1' -> ''
      function parentCode(code) { let s = segs(code); s.pop(); return s.join(''); }

      // 末段是数字还是字母
      function lastType(code) {
        let s = segs(code);
        if (!s.length) return '';
        return /\d/.test(s[s.length - 1]) ? 'num' : 'alpha';
      }

      // 序号 -> 字母：1->a, 26->z, 27->aa
      function numToAlpha(n) {
        let s = '';
        while (n > 0) { n--; s = String.fromCharCode(97 + (n % 26)) + s; n = Math.floor(n / 26); }
        return s;
      }

      // 生成某父节点下第 idx(从1起) 个子节点的编码
      function childCode(parent, idx) {
        if (!parent) return String(idx);                       // 根级：1,2,3...
        return lastType(parent) === 'num'
          ? parent + numToAlpha(idx)                           // 父末段为数字 -> 子用字母
          : parent + String(idx);                              // 父末段为字母 -> 子用数字
      }

      // 从标题前导解析既有编码：'1a1 概念卡' -> '1a1'
      function parseCode(title) {
        let m = (title || '').match(/^\s*(\d+(?:[a-z]+\d*)*)\s/i);
        return m ? m[1].toLowerCase() : '';
      }

      // 去掉标题前导编码，得到干净标题
      function stripCode(title) {
        return (title || '').replace(/^\s*\d+(?:[a-z]+\d*)*\s+/i, '').trim();
      }

      // 比较两个卢曼编码（按段；数字按数值，字母按字典序）
      function compareCode(a, b) {
        let sa = segs(a), sb = segs(b);
        for (let i = 0; i < Math.max(sa.length, sb.length); i++) {
          if (sa[i] === undefined) return -1;
          if (sb[i] === undefined) return 1;
          let na = /^\d+$/.test(sa[i]), nb = /^\d+$/.test(sb[i]);
          if (na && nb) { let d = parseInt(sa[i]) - parseInt(sb[i]); if (d) return d; }
          else { if (sa[i] < sb[i]) return -1; if (sa[i] > sb[i]) return 1; }
        }
        return 0;
      }

      // 递归给整棵树赋编码（用于预览与保存）
      function assignCodes(nodes, parent) {
        nodes.forEach((node, i) => {
          node.code = childCode(parent, i + 1);
          if (node.children && node.children.length) assignCodes(node.children, node.code);
        });
      }

      // ===== 加载：子笔记 -> 树 =====
      function buildTree() {
        let dataIn = io && io.dataIn;
        let target = Array.isArray(dataIn) ? dataIn[0] : dataIn;
        if (!target) return;
        let item = Zotero.Items.get(target.id);
        if (!item) return;

        let cards = item.getNotes().map(id => {
          let note = Zotero.Items.get(id);
          let rawTitle = note.getNoteTitle();
          return {
            id: id,
            title: stripCode(rawTitle) || '(无标题)',
            oldCode: parseCode(rawTitle),
            code: '',
            children: []
          };
        });

        let hasCodes = cards.some(c => c.oldCode);
        if (hasCodes) {
          // 已有编码：按编码排序并据“去掉末段=父”重建层级
          cards.sort((a, b) => compareCode(a.oldCode, b.oldCode));
          let byCode = {};
          let roots = [];
          cards.forEach(c => { byCode[c.oldCode] = c; });
          cards.forEach(c => {
            let p = parentCode(c.oldCode);
            if (p && byCode[p]) byCode[p].children.push(c);
            else roots.push(c);
          });
          tree.splice(0, tree.length, ...roots);
        } else {
          // 无编码：按标题排序（与主界面一致），平铺为根级
          cards.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
          tree.splice(0, tree.length, ...cards);
        }
        assignCodes(tree, '');
      }

      // ===== 拖拽 =====
      function allowDrop() { return true; } // 允许 前/后/内部
      function onDrop() { assignCodes(tree, ''); } // 拖拽后重算预览编码

      // ===== 写入编码到笔记标题 =====
      async function writeCode(noteID, code) {
        let note = Zotero.Items.get(noteID);
        let html = note.getNote();
        let doc = new DOMParser().parseFromString(html, 'text/html');

        // 定位标题元素：body 内首个 h1-6/p（跳过纯包裹 div）
        let titleEl = doc.body.querySelector('h1,h2,h3,h4,h5,h6,p') || doc.body.firstElementChild || doc.body;

        // 移除旧的编码 span
        titleEl.querySelectorAll('span.zotcard-code').forEach(e => {
          let n = e.nextSibling;
          e.remove();
          if (n && n.nodeType === 3) n.textContent = n.textContent.replace(/^\s+/, '');
        });
        // 移除首文本节点的前导明文编码
        if (titleEl.firstChild && titleEl.firstChild.nodeType === 3) {
          titleEl.firstChild.textContent = titleEl.firstChild.textContent.replace(/^\s*\d+(?:[a-z]+\d*)*\s+/i, '');
        }
        // 在标题最前插入新编码
        let span = doc.createElement('span');
        span.className = 'zotcard-code';
        span.textContent = code;
        titleEl.insertBefore(doc.createTextNode(' '), titleEl.firstChild);
        titleEl.insertBefore(span, titleEl.firstChild);

        note.setNote(doc.body.innerHTML);
        await note.saveTx();
      }

      async function handleSave() {
        saving.value = true;
        try {
          assignCodes(tree, '');
          let flat = [];
          (function collect(nodes) {
            nodes.forEach(n => { flat.push(n); if (n.children) collect(n.children); });
          })(tree);
          for (let n of flat) {
            await writeCode(n.id, n.code);
          }
          ElMessage && ElMessage.success('已写入 ' + flat.length + ' 张卡片的编码');
          setTimeout(() => window.close(), 800);
        } catch (e) {
          Zotero.ZotCard.Logger.log(e);
          ElMessage && ElMessage.error('写入失败：' + e);
        } finally {
          saving.value = false;
        }
      }

      function handleClose() { window.close(); }

      buildTree();

      return { tree, saving, allowDrop, onDrop, handleSave, handleClose };
    }
  });
};
