import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/html.js';
import { parseCss } from '../src/css.js';
import { styleTree } from '../src/style.js';

test('applies matching rule declarations to an element', () => {
  const doc = parse('<p class="x">hi</p>');
  const rules = parseCss('p { color: red; } .x { margin: 2px; }');
  const styled = styleTree(doc, rules).children[0];
  assert.equal(styled.specified.color, 'red');
  assert.equal(styled.specified.margin, '2px');
});

test('higher specificity wins', () => {
  const doc = parse('<p id="a" class="x">hi</p>');
  const rules = parseCss('p { color: red; } .x { color: green; } #a { color: blue; }');
  const styled = styleTree(doc, rules).children[0];
  assert.equal(styled.specified.color, 'blue');
});

test('inline style overrides stylesheet', () => {
  const doc = parse('<p style="color: purple">hi</p>');
  const rules = parseCss('p { color: red; }');
  const styled = styleTree(doc, rules).children[0];
  assert.equal(styled.specified.color, 'purple');
});
