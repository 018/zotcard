const { createApp, ref, reactive, toRaw, computed, nextTick } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;

// 读取打开对话框时传入的参数：io.dataIn = [{type, id}]，取其中的父文献条目
var io = window.arguments && window.arguments.length > 0 ? window.arguments[0] : undefined;

window.onload = function () {
  ZotElementPlus.createElementPlusApp({
    setup() {
      const tree = reactive([]);
      const saving = ref(false);
      const groupPrefix = ref('');   // 组号，如 S32（留空则无组号）
      const groupSep = ref('/');     // 组号与卢曼码之间的分隔符
      const selected = ref(null);    // 当前预览的卡片节点
      const previewHtml = ref('');   // 预览内容 HTML
      const previewWidth = ref(380); // 右侧预览区宽度（可拖拽）
      const ctxMenu = reactive({ visible: false, x: 0, y: 0 }); // 右键菜单
      const treeRef = ref(null);     // el-tree 组件引用（用于展开/折叠）
      let scope = null;              // 当前编码范围 {type, id}：item（单文献）或 collection（聚合）

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

      // 数字按同级数量零填充，保证字典序排序正确（如 12 张卡 -> 01..12）
      function pad(n, count) {
        return String(n).padStart(String(count).length, '0');
      }

      // 生成某父节点下第 idx(从1起) 个子节点的编码；count 为同级节点总数
      function childCode(parent, idx, count) {
        if (!parent) return pad(idx, count);                   // 根级：数字（零填充）
        return lastType(parent) === 'num'
          ? parent + numToAlpha(idx)                           // 父末段为数字 -> 子用字母
          : parent + pad(idx, count);                          // 父末段为字母 -> 子用数字（零填充）
      }

      // 把标题前导拆成 { 组号 prefix, 分隔符 sep, 卢曼码 code, 干净标题 rest }。
      // 形态一：组号+分隔符+卢曼码，如 'S32/1a1## 概念卡' -> {S32, /, 1a1, '## 概念卡'}
      //   （组号为非空白且不含分隔符，避免把正文里的 1/2 之类误判）
      // 形态二：纯卢曼码（编码后可紧跟任意非字母数字，如 '1a1## 概念卡' -> {'', '', 1a1, ...}）
      //   末尾负向断言避免把 '3D'、'2024' 误判为编码。
      function splitTitle(title) {
        let t = title || '';
        let m = t.match(/^\s*([^\s/.\-:_]+)([/.\-:_])(\d+(?:[a-z]+\d*)*)(?![A-Za-z0-9])\s*/);
        if (m) return { prefix: m[1], sep: m[2], code: m[3], rest: t.slice(m[0].length).trim() };
        m = t.match(/^\s*(\d+(?:[a-z]+\d*)*)(?![A-Za-z0-9])\s*/);
        if (m) return { prefix: '', sep: '', code: m[1], rest: t.slice(m[0].length).trim() };
        return { prefix: '', sep: '', code: '', rest: t.trim() };
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
      // 只给“参与编码”(enabled) 的节点编号；未参与的节点及其子树不编码
      function assignCodes(nodes, parent) {
        let on = nodes.filter(n => n.enabled);
        on.forEach((node, i) => {
          node.code = childCode(parent, i + 1, on.length);
          if (node.children && node.children.length) assignCodes(node.children, node.code);
        });
        nodes.filter(n => !n.enabled).forEach(node => {
          node.code = '';
          clearSubtreeCodes(node.children);
        });
      }
      function clearSubtreeCodes(nodes) {
        (nodes || []).forEach(n => { n.code = ''; clearSubtreeCodes(n.children); });
      }
      function recompute() { assignCodes(tree, ''); }
      function setAllEnabled(val) { flatten().forEach(n => n.enabled = val); recompute(); }

      // 收集分类（含子分类）下的所有卡片笔记 id：独立笔记 + 各文献的子笔记
      function collectFromCollection(coll, ids) {
        coll.getChildItems().forEach(it => {
          if (it.isNote && it.isNote()) ids.push(it.id);
          else if (it.isRegularItem && it.isRegularItem()) ids.push(...it.getNotes());
        });
        (coll.getChildCollections ? coll.getChildCollections() : []).forEach(sub => collectFromCollection(sub, ids));
      }
      // 按范围加载卡片笔记 id
      function loadNoteIds(target) {
        let ids = [];
        if (!target) return ids;
        if (target.type === 'collection') {
          let coll = Zotero.Collections.get(target.id);
          if (coll) collectFromCollection(coll, ids);
        } else if (target.type === 'note') {
          ids = [target.id];
        } else {
          let it = Zotero.Items.get(target.id); // item：该文献的子笔记
          if (it) ids = it.getNotes();
        }
        return Array.from(new Set(ids)); // 去重（同一卡片可能在多个子分类）
      }

      // ===== 加载：卡片 -> 树 =====
      function buildTree() {
        let dataIn = io && io.dataIn;
        let target = Array.isArray(dataIn) ? dataIn[0] : dataIn;
        if (!target) return;
        scope = target;
        let noteIds = loadNoteIds(target);

        let detectedPrefix = '', detectedSep = '';
        let cards = noteIds.map(id => {
          let note = Zotero.Items.get(id);
          let info = splitTitle(note.getNoteTitle());
          if (info.code && info.prefix && !detectedPrefix) {
            detectedPrefix = info.prefix; detectedSep = info.sep;   // 回填已有组号
          }
          return {
            id: id,
            title: info.rest || '(无标题)',
            oldCode: info.code,
            enabled: !!info.code,   // 已有编码的默认参与，其余默认不参与
            code: '',
            children: []
          };
        });
        if (detectedPrefix) { groupPrefix.value = detectedPrefix; groupSep.value = detectedSep; }

        let hasCodes = cards.some(c => c.oldCode);
        if (hasCodes) {
          // 已有编码：按编码排序并据“去掉末段=父”重建层级
          cards.sort((a, b) => compareCode(a.oldCode, b.oldCode));
          let byCode = {};
          let roots = [];
          cards.forEach(c => { byCode[c.oldCode] = c; });
          cards.forEach(c => {
            // 向上逐级回溯，找到最近存在的祖先（应对中间层级缺失/不连续，如 1a1a 缺 1a1）
            let p = parentCode(c.oldCode);
            while (p && !byCode[p]) p = parentCode(p);
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

      // ===== 展开 / 折叠 =====
      function setExpandedAll(val) {
        let store = treeRef.value && treeRef.value.store;
        if (!store) return;
        Object.values(store.nodesMap).forEach(n => { n.expanded = val; });
      }
      function expandAll() { setExpandedAll(true); }
      function collapseAll() { setExpandedAll(false); }
      // 展开到第 level 级（只显示前 level 层）
      function expandToLevel(level) {
        let store = treeRef.value && treeRef.value.store;
        if (!store) return;
        Object.values(store.nodesMap).forEach(n => { n.expanded = n.level < level; });
      }
      // 展开/折叠指定节点的整个子树（含自身与所有子孙）
      function setSubtreeExpanded(id, val) {
        let store = treeRef.value && treeRef.value.store;
        if (!store) return;
        let node = store.nodesMap[id];
        if (!node) return;
        (function walk(n) { n.expanded = val; (n.childNodes || []).forEach(walk); })(node);
      }

      // ===== 预览 / 编辑 =====
      function loadPreview(id) {
        let note = Zotero.Items.get(id);
        if (!note) { previewHtml.value = ''; return; }
        let html = note.getNote() || '';
        // 让卡片里的附件图片能显示
        previewHtml.value = html.replace(/data-attachment-key="(.*?)"/g, 'data-attachment-key="$1" src="zotero://attachment/library/items/$1"');
      }
      function onNodeClick(data) { selected.value = data; loadPreview(data.id); }
      // 右键卡片：选中它并在光标处弹出菜单
      function onContextMenu(event, data) {
        event.preventDefault();
        selected.value = data;
        loadPreview(data.id);
        ctxMenu.x = event.clientX;
        ctxMenu.y = event.clientY;
        ctxMenu.visible = true;
      }
      function hideCtx() { ctxMenu.visible = false; }
      async function ctxAddSibling() { hideCtx(); await addSibling(); }
      async function ctxAddChild() { hideCtx(); await addChild(); }
      function ctxOpenEditor() { hideCtx(); openEditor(); }
      function ctxExpandSubtree() { hideCtx(); if (selected.value) setSubtreeExpanded(selected.value.id, true); }
      function ctxCollapseSubtree() { hideCtx(); if (selected.value) setSubtreeExpanded(selected.value.id, false); }
      function refreshSelected() {
        if (!selected.value) return;
        loadPreview(selected.value.id);
        // 同步刷新标题（可能刚在编辑器里改过）
        let note = Zotero.Items.get(selected.value.id);
        if (note) selected.value.title = splitTitle(note.getNoteTitle()).rest || '(无标题)';
      }
      function openEditor() {
        if (!selected.value) return;
        try {
          Zotero.getMainWindow().ZoteroPane.openNoteWindow(selected.value.id);
        } catch (e) {
          Zotero.ZotCard.Logger.log(e);
          ElMessage && ElMessage.error('打开编辑器失败：' + e);
        }
      }
      // 拖拽分隔条调整右侧预览宽度
      function startResize(e) {
        e.preventDefault();
        let startX = e.clientX;
        let startW = previewWidth.value;
        function onMove(ev) {
          let w = startW - (ev.clientX - startX);   // 分隔条左移 -> 预览变宽
          previewWidth.value = Math.max(220, Math.min(w, window.innerWidth - 260));
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }

      // ===== 新建卡片（同级 / 下级）=====
      function escapeHtml(s) {
        return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      function makeNode(id, title) {
        return { id: id, title: title, oldCode: '', enabled: true, code: '', children: [] };
      }
      // 在树中定位某 id 节点：返回 { siblings(所在数组), index, node }
      function findInTree(id, nodes) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === id) return { siblings: nodes, index: i, node: nodes[i] };
          if (nodes[i].children && nodes[i].children.length) {
            let r = findInTree(id, nodes[i].children);
            if (r) return r;
          }
        }
        return null;
      }
      // 根据参考卡片生成新笔记内容：克隆其标题元素（保留格式如 h1/##），去掉其中的编码
      function buildContentFrom(refId) {
        if (!refId) return '<div data-schema-version="9"><p>新卡片</p></div>';
        let refNote = Zotero.Items.get(refId);
        let html = refNote ? refNote.getNote() : '';
        let doc = new DOMParser().parseFromString(html, 'text/html');
        let titleEl = doc.body.querySelector('h1,h2,h3,h4,h5,h6,p');
        if (!titleEl) return '<div data-schema-version="9"><p>新卡片</p></div>';
        let clone = titleEl.cloneNode(true);
        // 去掉编码 span
        clone.querySelectorAll('span.zotcard-code').forEach(e => {
          let n = e.nextSibling; e.remove();
          if (n && n.nodeType === 3) n.textContent = n.textContent.replace(/^\s+/, '');
        });
        // 去掉首文本节点前导明文编码（含可选组号前缀）
        if (clone.firstChild && clone.firstChild.nodeType === 3) {
          clone.firstChild.textContent = clone.firstChild.textContent.replace(/^\s*(?:[^\s/.\-:_]+[/.\-:_])?\d+(?:[a-z]+\d*)*(?![A-Za-z0-9])\s*/, '');
        }
        return '<div data-schema-version="9">' + clone.outerHTML + '</div>';
      }
      // 创建一条卡片笔记（标题格式参照 refId 卡片），返回 { id, title }
      // - 分类聚合：建为独立笔记并加入该分类
      // - 单文献：建为该文献的子笔记
      async function createNote(refId) {
        let note = new Zotero.Item('note');
        if (scope && scope.type === 'collection') {
          let coll = Zotero.Collections.get(scope.id);
          note.libraryID = coll.libraryID;
          note.addToCollection(scope.id);
        } else {
          let parent = Zotero.Items.get(scope.id);
          note.parentKey = parent.key;
          note.libraryID = parent.libraryID;
        }
        note.setNote(buildContentFrom(refId));
        let id = await note.saveTx();
        let nid = typeof id === 'number' ? id : note.id;
        let title = splitTitle(Zotero.Items.get(nid).getNoteTitle()).rest || '新卡片';
        return { id: nid, title: title };
      }
      function afterAdd(node) {
        recompute();
        selected.value = node;
        loadPreview(node.id);
      }
      async function addSibling() {
        // 以选中卡片为参考；无选中则用默认标题，加到根级末尾
        let r = await createNote(selected.value ? selected.value.id : null);
        let node = makeNode(r.id, r.title);
        if (selected.value) {
          let f = findInTree(selected.value.id, tree);
          if (f) f.siblings.splice(f.index + 1, 0, node);
          else tree.push(node);
        } else {
          tree.push(node);
        }
        afterAdd(node);
      }
      async function addChild() {
        if (!selected.value) return;
        let r = await createNote(selected.value.id);
        let node = makeNode(r.id, r.title);
        let f = findInTree(selected.value.id, tree);
        if (!f) { tree.push(node); afterAdd(node); return; }
        if (!f.node.children) f.node.children = [];
        f.node.children.push(node);
        afterAdd(node);
      }

      // ===== 写入/清除编码到笔记标题（code 为空字符串则仅清除）=====
      // 返回 true 表示有改动并已保存；false 表示当前编码已正确、无需改动（不触碰修改时间）。
      async function applyCode(noteID, code) {
        let note = Zotero.Items.get(noteID);

        // 先比较当前编码与目标编码，一致则跳过，避免无谓写入/改动修改时间
        let cur = splitTitle(note.getNoteTitle());
        let curFull = cur.code ? ((cur.prefix ? cur.prefix + cur.sep : '') + cur.code) : '';
        if (curFull === (code || '')) return false;

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
        // 移除首文本节点的前导明文编码（支持可选的“组号+分隔符”前缀，以及编码后无空格，如 'S32/1a1##...'）
        if (titleEl.firstChild && titleEl.firstChild.nodeType === 3) {
          titleEl.firstChild.textContent = titleEl.firstChild.textContent.replace(/^\s*(?:[^\s/.\-:_]+[/.\-:_])?\d+(?:[a-z]+\d*)*(?![A-Za-z0-9])\s*/, '');
        }
        // 写入新编码（code 非空时）
        if (code) {
          let span = doc.createElement('span');
          span.className = 'zotcard-code';
          span.textContent = code;
          titleEl.insertBefore(doc.createTextNode(' '), titleEl.firstChild);
          titleEl.insertBefore(span, titleEl.firstChild);
        }

        note.setNote(doc.body.innerHTML);
        await note.saveTx();
        return true;
      }

      // 收集树中所有节点（深度优先）
      function flatten() {
        let flat = [];
        (function collect(nodes) {
          nodes.forEach(n => { flat.push(n); if (n.children) collect(n.children); });
        })(tree);
        return flat;
      }

      // 卢曼码加上组号前缀：'1a1' -> 'S32/1a1'（无组号或无编码时原样/为空）
      function fullCode(code) {
        if (!code) return '';
        return (groupPrefix.value ? groupPrefix.value + groupSep.value : '') + code;
      }

      async function handleSave() {
        saving.value = true;
        try {
          assignCodes(tree, '');
          let flat = flatten();
          let changed = 0;
          for (let n of flat) {
            if (await applyCode(n.id, fullCode(n.code))) changed++;
          }
          ElMessage && ElMessage.success(changed > 0 ? ('已更新 ' + changed + ' 张卡片的编码') : '无需改动（编码已是最新）');
          // 保存后保持面板打开，方便继续调整（不再自动关闭）
        } catch (e) {
          Zotero.ZotCard.Logger.log(e);
          ElMessage && ElMessage.error('写入失败：' + e);
        } finally {
          saving.value = false;
        }
      }

      async function handleClear() {
        try {
          await ElMessageBox.confirm('确定清除该文献下所有卡片的编码吗？', '清除编码', {
            type: 'warning', confirmButtonText: '清除', cancelButtonText: '取消'
          });
        } catch (e) {
          return; // 用户取消
        }
        saving.value = true;
        try {
          let flat = flatten();
          let changed = 0;
          for (let n of flat) {
            if (await applyCode(n.id, '')) changed++;
          }
          ElMessage && ElMessage.success(changed > 0 ? ('已清除 ' + changed + ' 张卡片的编码') : '没有需要清除的编码');
          buildTree(); // 重建为无编码的平铺
        } catch (e) {
          Zotero.ZotCard.Logger.log(e);
          ElMessage && ElMessage.error('清除失败：' + e);
        } finally {
          saving.value = false;
        }
      }

      function handleClose() { window.close(); }

      buildTree();
      // 点击菜单以外的任何地方都关闭右键菜单（捕获阶段，避免被 el-tree 拦截）
      document.addEventListener('click', (e) => {
        if (!ctxMenu.visible) return;
        let menuEl = document.querySelector('.ctx-menu');
        if (!menuEl || !menuEl.contains(e.target)) ctxMenu.visible = false;
      }, true);
      // 滚动 / 再次右键空白也关闭
      document.addEventListener('contextmenu', (e) => {
        let menuEl = document.querySelector('.ctx-menu');
        if (ctxMenu.visible && menuEl && menuEl.contains(e.target)) e.preventDefault();
      }, true);

      return { tree, treeRef, saving, groupPrefix, groupSep, selected, previewHtml, previewWidth, ctxMenu, allowDrop, onDrop, onNodeClick, onContextMenu, hideCtx, ctxAddSibling, ctxAddChild, ctxOpenEditor, ctxExpandSubtree, ctxCollapseSubtree, refreshSelected, openEditor, startResize, addSibling, addChild, expandAll, collapseAll, expandToLevel, recompute, setAllEnabled, handleSave, handleClear, handleClose };
    }
  });
};
