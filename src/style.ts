// Style resolution (the "cascade"). Walks the DOM and attaches a `specified`
// map of CSS property -> value to each element, by matching rules and resolving
// conflicts by specificity. Inline `style="..."` wins over stylesheet rules.
//
// A styled node mirrors the DOM node:
//   { type, tag, attrs, node, specified, children }   (elements)
//   { type:'text', text }                             (text)

import { matches } from './dom.ts';
import type {
  Declarations,
  DomElement,
  DomNode,
  Rule,
  StyledElement,
  StyledNode,
} from './types.ts';

// Specificity of a single simple selector: id > class > tag.
function specificity(selector: string): number {
  if (selector[0] === '#') return 100;
  if (selector[0] === '.') return 10;
  if (selector === '*') return 0;
  return 1;
}

function specifiedValues(node: DomElement, rules: Rule[]): Declarations {
  const matched: { spec: number; declarations: Declarations }[] = [];
  for (const rule of rules) {
    for (const selector of rule.selectors) {
      if (matches(node, selector)) {
        matched.push({ spec: specificity(selector), declarations: rule.declarations });
        break; // one match per rule is enough
      }
    }
  }
  // Lower specificity first so higher-specificity values overwrite them.
  matched.sort((a, b) => a.spec - b.spec);

  const specified: Declarations = {};
  for (const { declarations } of matched) Object.assign(specified, declarations);

  // Inline styles win over everything.
  const inline = node.attrs.style;
  if (inline) Object.assign(specified, parseInline(inline));

  return specified;
}

function parseInline(str: string): Declarations {
  const out: Declarations = {};
  for (const part of str.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const value = part.slice(idx + 1).trim();
    if (prop && value) out[prop] = value;
  }
  return out;
}

export function styleTree(node: DomElement, rules: Rule[]): StyledElement;
export function styleTree(node: DomNode, rules: Rule[]): StyledNode;
export function styleTree(node: DomNode, rules: Rule[]): StyledNode {
  if (node.type === 'text') {
    return { type: 'text', text: node.text };
  }
  return {
    type: 'element',
    tag: node.tag,
    attrs: node.attrs,
    node,
    specified: specifiedValues(node, rules),
    children: node.children.map((child) => styleTree(child, rules)),
  };
}
