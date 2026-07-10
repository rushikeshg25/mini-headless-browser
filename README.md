# mini-headless-browser (`mhb`)

A tiny headless browser engine built from scratch in Node.js — no Chromium, no
dependencies. It runs a real browser's core pipeline and renders pages as ASCII
in your terminal.

```
fetch → tokenize HTML → build DOM → parse CSS → cascade styles → block layout → paint (ASCII)
```

## Usage

```sh
node browser.js <url|file> [--tree] [--width N]
```

```sh
node browser.js examples/sample.html          # render the page as ASCII
node browser.js examples/sample.html --tree    # dump the parsed DOM tree
node browser.js https://example.com            # fetch and render a live URL
```

## Not supported (on purpose)

No JavaScript execution, no inline/flex/grid layout, no pixels — block boxes only.
It's built to show how the pieces fit together, not to replace a real browser.

## Test

```sh
npm test
```
