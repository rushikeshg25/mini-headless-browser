import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCss } from '../src/css.ts';

test('parses a single rule with declarations', () => {
  const rules = parseCss('p { color: red; margin: 4px; }');
  assert.deepEqual(rules, [
    { selectors: ['p'], declarations: { color: 'red', margin: '4px' } },
  ]);
});

test('splits comma-separated selectors', () => {
  const rules = parseCss('h1, .title { padding: 2px; }');
  assert.deepEqual(rules[0].selectors, ['h1', '.title']);
});

test('strips comments', () => {
  const rules = parseCss('/* hi */ a { color: blue; } /* x */');
  assert.equal(rules.length, 1);
  assert.equal(rules[0].declarations.color, 'blue');
});

test('ignores empty / malformed declarations', () => {
  const rules = parseCss('p { color: red; ; bogus }');
  assert.deepEqual(rules[0].declarations, { color: 'red' });
});
