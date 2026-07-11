import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../src/html.ts';

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
  assert.deepEqual(tokens, [
    { type: 'open', tag: 'br', attrs: {}, selfClosing: true },
    { type: 'open', tag: 'img', attrs: { src: 'a.png' }, selfClosing: true },
  ]);
});

test('comments and doctype are skipped', () => {
  const tokens = tokenize('<!doctype html><!-- hi --><b>x</b>');
  assert.deepEqual(tokens, [
    { type: 'open', tag: 'b', attrs: {}, selfClosing: false },
    { type: 'text', text: 'x' },
    { type: 'close', tag: 'b' },
  ]);
});

test('collapses whitespace in text runs', () => {
  const tokens = tokenize('<p>a\n   b</p>');
  assert.deepEqual(tokens, [
    { type: 'open', tag: 'p', attrs: {}, selfClosing: false },
    { type: 'text', text: 'a b' },
    { type: 'close', tag: 'p' },
  ]);
});
