import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/html.js';
import { textContent } from '../src/dom.js';

test('parse builds a nested tree with correct structure', () => {
  const doc = parse('<div class="box"><p>hi</p><p>bye</p></div>');
  const div = doc.children[0];
  assert.equal(div.tag, 'div');
  assert.equal(div.attrs.class, 'box');
  assert.equal(div.children.length, 2);
  assert.equal(div.children[0].tag, 'p');
  assert.equal(textContent(div.children[0]), 'hi');
  assert.equal(textContent(div.children[1]), 'bye');
});

test('parent back-references are wired up', () => {
  const doc = parse('<div><span>x</span></div>');
  const div = doc.children[0];
  const span = div.children[0];
  assert.equal(span.parent, div);
  assert.equal(div.parent, doc);
});

test('void elements do not swallow following siblings', () => {
  const doc = parse('<div><br><p>after</p></div>');
  const div = doc.children[0];
  assert.equal(div.children.length, 2);
  assert.equal(div.children[0].tag, 'br');
  assert.equal(div.children[1].tag, 'p');
});
