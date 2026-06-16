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

      // ===== 加载：子笔记 -> 树 =====
      function buildTree() {
        let dataIn = io && io.dataIn;
        let target = Array.isArray(dataIn) ? dataIn[0] : dataIn;
        if (!target) return;
        let item = Zotero.Items.get(target.id);
        if (!item) return;

        let detectedPrefix = '', detectedSep = '';
        let cards = item.getNotes().map(id => {
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

      // ===== 写入/清除编码到笔记标题（code 为空字符串则仅清除）=====
      async function applyCode(noteID, code) {
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
          for (let n of flat) {
            await applyCode(n.id, fullCode(n.code));
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
          for (let n of flat) {
            await applyCode(n.id, '');
          }
          ElMessage && ElMessage.success('已清除 ' + flat.length + ' 张卡片的编码');
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

      return { tree, saving, groupPrefix, groupSep, allowDrop, onDrop, recompute, setAllEnabled, handleSave, handleClear, handleClose };
    }
  });
};
