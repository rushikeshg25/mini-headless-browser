// The DOM node model plus a few helpers. Two node kinds:
//   element: { type:'element', tag, attrs, children }
//   text:    { type:'text', text }
// Nodes also carry a `parent` back-reference once attached.

export function element(tag, attrs = {}, children = []) {
  const node = { type: 'element', tag, attrs, children, parent: null };
  for (const child of children) child.parent = node;
  return node;
}

export function text(value) {
  return { type: 'text', text: value, parent: null };
}

export function appendChild(parent, child) {
  child.parent = parent;
  parent.children.push(child);
  return child;
}

// Concatenated text of a node and all its descendants.
export function textContent(node) {
  if (node.type === 'text') return node.text;
  return node.children.map(textContent).join('');
}

// Convenience accessors for common attributes.
export function classList(node) {
  const cls = node.attrs?.class;
  return cls ? cls.trim().split(/\s+/) : [];
}

export function id(node) {
  return node.attrs?.id ?? null;
}
