// A small HTML tokenizer. Turns an HTML string into a flat list of tokens:
//   { type: 'open',  tag, attrs, selfClosing }
//   { type: 'close', tag }
//   { type: 'text',  text }
// It is forgiving rather than spec-complete: enough to parse ordinary markup.

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

export function tokenize(html) {
  const tokens = [];
  let i = 0;
  const n = html.length;

  while (i < n) {
    if (html[i] === '<') {
      // Comment: <!-- ... -->
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4);
        i = end === -1 ? n : end + 3;
        continue;
      }
      // Declaration / doctype: <!doctype html>  — skip it.
      if (html[i + 1] === '!') {
        const end = html.indexOf('>', i);
        i = end === -1 ? n : end + 1;
        continue;
      }
      const end = html.indexOf('>', i);
      if (end === -1) {
        // No closing '>': treat the rest as text.
        tokens.push({ type: 'text', text: html.slice(i) });
        break;
      }
      const raw = html.slice(i + 1, end).trim();
      i = end + 1;
      if (raw.startsWith('/')) {
        tokens.push({ type: 'close', tag: raw.slice(1).trim().toLowerCase() });
      } else {
        tokens.push(parseTag(raw));
      }
    } else {
      const next = html.indexOf('<', i);
      const end = next === -1 ? n : next;
      const text = html.slice(i, end);
      if (text.trim() !== '') {
        tokens.push({ type: 'text', text: collapseWhitespace(text) });
      }
      i = end;
    }
  }

  return tokens;
}

function parseTag(raw) {
  const selfClosing = raw.endsWith('/');
  const body = selfClosing ? raw.slice(0, -1).trim() : raw;

  const match = body.match(/^([a-zA-Z][\w-]*)/);
  const tag = match ? match[1].toLowerCase() : '';
  const attrs = parseAttrs(body.slice(match ? match[0].length : 0));

  return {
    type: 'open',
    tag,
    attrs,
    selfClosing: selfClosing || VOID_ELEMENTS.has(tag),
  };
}

function parseAttrs(str) {
  const attrs = {};
  const re = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    const name = m[1].toLowerCase();
    let value = m[2] ?? '';
    if (value && (value[0] === '"' || value[0] === "'")) {
      value = value.slice(1, -1);
    }
    attrs[name] = value;
  }
  return attrs;
}

function collapseWhitespace(text) {
  return text.replace(/\s+/g, ' ');
}
