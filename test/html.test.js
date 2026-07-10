import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../src/html.js';

test('tokenizes a simple element with attributes', () => {
  const tokens = tokenize('<p class="x">hi</p>');
  assert.deepEqual(tokens, [
    { type: 'open', tag: 'p', attrs: { class: 'x' }, selfClosing: false },
    { type: 'text', text: 'hi' },
    { type: 'close', tag: 'p' },
  ]);
});

test('void and self-closing elements are marked self-closing', () => {
  const tokens = tokenize('<br><img src="a.png"/>');
  assert.equal(tokens[0].selfClosing, true);
  assert.equal(tokens[1].selfClosing, true);
  assert.equal(tokens[1].attrs.src, 'a.png');
});

test('comments and doctype are skipped', () => {
  const tokens = tokenize('<!doctype html><!-- hi --><b>x</b>');
  assert.deepEqual(tokens.map((t) => t.type), ['open', 'text', 'close']);
  assert.equal(tokens[0].tag, 'b');
});

test('collapses whitespace in text runs', () => {
  const tokens = tokenize('<p>a\n   b</p>');
  assert.equal(tokens[1].text, 'a b');
});
