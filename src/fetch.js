// Fetch the raw HTML for a resource. Accepts a http(s) URL, a file:// URL,
// or a plain local filesystem path. Kept intentionally minimal: a single GET,
// no cookies or redirect handling beyond what global fetch does for us.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function fetchPage(target) {
  if (/^https?:\/\//i.test(target)) {
    const res = await fetch(target);
    if (!res.ok) {
      throw new Error(`fetch failed: ${res.status} ${res.statusText} for ${target}`);
    }
    return await res.text();
  }

  const path = target.startsWith('file://') ? fileURLToPath(target) : target;
  return await readFile(path, 'utf8');
}
