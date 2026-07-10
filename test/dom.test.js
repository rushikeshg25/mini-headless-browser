import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/html.js';
import { textContent, matches, querySelectorAll } from '../src/dom.js';

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

test('matches handles tag, #id, .class and *', () => {
  const doc = parse('<p id="a" class="x y">hi</p>');
  const p = doc.children[0];
  assert.equal(matches(p, 'p'), true);
  assert.equal(matches(p, '#a'), true);
  assert.equal(matches(p, '.y'), true);
  assert.equal(matches(p, '*'), true);
  assert.equal(matches(p, 'div'), false);
  assert.equal(matches(p, '#b'), false);
});

test('querySelectorAll finds descendants by selector', () => {
  const doc = parse('<div><p class="x">1</p><span><p class="x">2</p></span></div>');
  assert.equal(querySelectorAll(doc, 'p').length, 2);
  assert.equal(querySelectorAll(doc, '.x').length, 2);
  assert.equal(querySelectorAll(doc, 'span').length, 1);
});
