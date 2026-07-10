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

// Simple selector matching: a single tag, #id, .class, or * (no combinators).
export function matches(node, selector) {
  if (node.type !== 'element') return false;
  if (selector === '*') return true;
  if (selector[0] === '#') return id(node) === selector.slice(1);
  if (selector[0] === '.') return classList(node).includes(selector.slice(1));
  return node.tag === selector.toLowerCase();
}

// All descendant elements (excluding the root itself) matching the selector.
export function querySelectorAll(root, selector) {
  const out = [];
  const walk = (node) => {
    for (const child of node.children ?? []) {
      if (matches(child, selector)) out.push(child);
      walk(child);
    }
  };
  walk(root);
  return out;
}
