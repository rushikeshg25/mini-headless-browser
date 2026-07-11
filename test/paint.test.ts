import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paint } from '../src/paint.ts';
import type { ElementBox } from '../src/types.ts';

test('draws a bordered box with text inside', () => {
  const box: ElementBox = {
    type: 'element',
    tag: 'div',
    x: 0,
    y: 0,
    width: 4,
    height: 3,
    margin: 0,
    padding: 0,
    children: [{ type: 'text', text: 'hi', x: 1, y: 1, width: 2, height: 1 }],
  };
  assert.equal(paint(box), ['+--+', '|hi|', '+--+'].join('\n'));
});

test('clips text to its box width', () => {
  const box: ElementBox = {
    type: 'element',
    tag: 'div',
    x: 0,
    y: 0,
    width: 5,
    height: 1,
    margin: 0,
    padding: 0,
    children: [{ type: 'text', text: 'toolong', x: 0, y: 0, width: 3, height: 1 }],
  };
  assert.equal(paint(box), 'too');
});
