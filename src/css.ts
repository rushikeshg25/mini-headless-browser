// A minimal CSS parser. Produces a list of rules:
//   { selectors: ['p', '.box'], declarations: { color: 'red', margin: '4px' } }
// Supports comma-separated simple selectors and `key: value;` declaration blocks.
// Comments (/* ... */) are stripped first. No @-rules, nesting, or combinators.

import type { Declarations, Rule } from './types.ts';

export function parseCss(text: string): Rule[] {
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(clean)) !== null) {
    const selectors = m[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const declarations = parseDeclarations(m[2]);
    if (selectors.length) rules.push({ selectors, declarations });
  }

  return rules;
}

function parseDeclarations(block: string): Declarations {
  const declarations: Declarations = {};
  for (const part of block.split(';')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const prop = part.slice(0, idx).trim().toLowerCase();
    const value = part.slice(idx + 1).trim();
    if (prop && value) declarations[prop] = value;
  }
  return declarations;
}
