# mini-headless-browser (`mhb`)

A tiny headless browser engine built from scratch in TypeScript — no Chromium, no
runtime dependencies. It runs a real browser's core pipeline and renders pages as
ASCII in your terminal. Source runs directly on Node 24+ via native type stripping.

```
fetch → tokenize HTML → build DOM → parse CSS → cascade styles → block layout → paint (ASCII)
```

## Usage

```sh
node browser.ts <url|file> [--tree] [--width N]
```

```sh
node browser.ts examples/sample.html          # render the page as ASCII
node browser.ts examples/sample.html --tree    # dump the parsed DOM tree
node browser.ts https://example.com            # fetch and render a live URL
```

## Not supported (on purpose)

No JavaScript execution, no inline/flex/grid layout, no pixels — block boxes only.
It's built to show how the pieces fit together, not to replace a real browser.

## Develop

```sh
npm install      # dev-only: typescript + @types/node
npm run typecheck # tsc --noEmit
npm test          # node --test (runs the .ts tests directly)
```
