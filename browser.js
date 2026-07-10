#!/usr/bin/env node
// mhb — a tiny headless browser engine. CLI entry point.
// The full pipeline (fetch -> tokenize -> DOM -> CSS -> style -> layout -> paint)
// is wired up in a later commit. For now this just prints usage.

function usage() {
  console.log(`mhb — mini headless browser

Usage:
  mhb <url|file> [--tree]

Arguments:
  <url|file>   A http(s) URL, file:// URL, or local path to an HTML file.

Options:
  --tree       Print the parsed DOM tree instead of the rendered page.
`);
}

usage();
