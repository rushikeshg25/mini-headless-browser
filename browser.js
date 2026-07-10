#!/usr/bin/env node
// mhb — a tiny headless browser engine. CLI entry point.
// Runs the full pipeline: fetch -> parse -> style -> layout -> paint.

import { fetchPage } from './src/fetch.js';
import { parse } from './src/html.js';
import { querySelectorAll, textContent } from './src/dom.js';
import { parseCss } from './src/css.js';
import { styleTree } from './src/style.js';
import { layoutTree } from './src/layout.js';
import { paint } from './src/paint.js';

// A minimal user-agent stylesheet: hide non-rendered head content and give the
// page body a little breathing room.
const UA_STYLESHEET = `
  head { display: none; }
  style { display: none; }
  script { display: none; }
  title { display: none; }
  body { padding: 1px; }
`;

function usage() {
  console.log(`mhb — mini headless browser

Usage:
  mhb <url|file> [--tree] [--width N]

Arguments:
  <url|file>   A http(s) URL, file:// URL, or local path to an HTML file.

Options:
  --tree       Print the parsed DOM tree instead of the rendered page.
  --width N    Viewport width in characters (default 64).
`);
}

function printTree(node, depth = 0) {
  const pad = '  '.repeat(depth);
  if (node.type === 'text') {
    console.log(`${pad}"${node.text}"`);
    return;
  }
  const attrs = Object.entries(node.attrs ?? {})
    .map(([k, v]) => ` ${k}="${v}"`)
    .join('');
  const label = node.tag === 'document' ? '#document' : `<${node.tag}${attrs}>`;
  console.log(`${pad}${label}`);
  for (const child of node.children) printTree(child, depth + 1);
}

async function main() {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) {
    usage();
    process.exit(1);
  }
  const showTree = args.includes('--tree');
  const widthArg = args[args.indexOf('--width') + 1];
  const width = args.includes('--width') ? parseInt(widthArg, 10) : 64;

  const html = await fetchPage(target);
  const doc = parse(html);

  if (showTree) {
    printTree(doc);
    return;
  }

  const pageCss = querySelectorAll(doc, 'style').map(textContent).join('\n');
  const rules = parseCss(UA_STYLESHEET + '\n' + pageCss);
  const styled = styleTree(doc, rules);
  const layout = layoutTree(styled, width);
  console.log(paint(layout));
}

main().catch((err) => {
  console.error(`mhb: ${err.message}`);
  process.exit(1);
});
