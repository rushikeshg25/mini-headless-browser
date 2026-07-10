import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paint } from '../src/paint.js';

test('draws a bordered box with text inside', () => {
  const box = {
    type: 'element',
    tag: 'div',
    x: 0,
    y: 0,
    width: 4,
    height: 3,
    children: [{ type: 'text', text: 'hi', x: 1, y: 1, width: 2 }],
  };
  assert.equal(paint(box), ['+--+', '|hi|', '+--+'].join('\n'));
});

test('clips text to its box width', () => {
  const box = {
    type: 'element',
    tag: 'div',
    x: 0,
    y: 0,
    width: 5,
    height: 1,
    children: [{ type: 'text', text: 'toolong', x: 0, y: 0, width: 3 }],
  };
  assert.equal(paint(box), 'too');
});
