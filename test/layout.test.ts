import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/html.ts';
import { parseCss } from '../src/css.ts';
import { styleTree } from '../src/style.ts';
import { layoutTree } from '../src/layout.ts';
import type { ElementBox } from '../src/types.ts';

function layout(html: string, css: string, width: number): ElementBox {
  const styled = styleTree(parse(html), parseCss(css));
  const box = layoutTree(styled, width);
  assert.ok(box);
  return box;
}

test('block children stack vertically', () => {
  const root = layout('<div><p>a</p><p>b</p></div>', '', 20);
  const div = root.children[0] as ElementBox;
  assert.equal(div.children[0].y, 0);
  assert.equal(div.children[1].y, 1);
  assert.equal(div.height, 2);
});

test('margins push following blocks down', () => {
  const root = layout(
    '<div style="margin:1px"><p>a</p></div><div style="margin:1px"><p>b</p></div>',
    '',
    10,
  );
  const [d1, d2] = root.children;
  assert.equal(d1.y, 1);
  assert.equal(d2.y, 4);
});

test('width and padding shrink the content box', () => {
  const root = layout('<div style="width:8px; padding:1px"><p>x</p></div>', '', 40);
  const div = root.children[0] as ElementBox;
  assert.equal(div.width, 8);
  // content x is inset by the padding
  assert.equal(div.children[0].x, div.x + 1);
});

test('display:none removes the box', () => {
  const root = layout('<p>a</p><p style="display:none">b</p>', '', 10);
  assert.equal(root.children.length, 1);
});
