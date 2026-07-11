import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { fetchPage } from '../src/fetch.ts';

const sample = fileURLToPath(new URL('../examples/sample.html', import.meta.url));

test('fetchPage reads a local file path', async () => {
  const html = await fetchPage(sample);
  assert.match(html, /Hello, headless world/);
});

test('fetchPage reads a file:// URL', async () => {
  const html = await fetchPage(new URL('../examples/sample.html', import.meta.url).href);
  assert.match(html, /No Chromium involved/);
});
