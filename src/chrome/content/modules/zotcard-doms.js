if (!Zotero.ZotCard) Zotero.ZotCard = {};
if (!Zotero.ZotCard.Doms) Zotero.ZotCard.Doms = {};

Zotero.ZotCard.Doms = Object.assign(Zotero.ZotCard.Doms, {
  createXULElement(document, tag, {id, attrs, props, parent, childs, command, onclick}) {
		let element = document.createXULElement(tag);
    if (id) {
      element.id = id;
    }
    if (attrs) {
      for (const key in attrs) {
        if (Object.hasOwnProperty.call(attrs, key)) {
          const value = attrs[key];
          element.setAttribute(key, value);
        }
      }
    }
    if (props) {
      for (const key in props) {
        if (Object.hasOwnProperty.call(props, key)) {
          const value = props[key];
          element[key] = value;
        }
      }
    }
    if (command) {
      element.addEventListener('command', command);
    }
    if (onclick) {
      element.onclick = onclick;
    }
    if (childs && childs.length > 0) {
      element.appendChild(childs);
    }
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  }
});