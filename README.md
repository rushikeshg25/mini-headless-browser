# mini-headless-browser (`mhb`)

A **tiny headless browser engine built from scratch in Node.js** — no Chromium, no
Playwright, zero dependencies. It runs the same core pipeline a real browser runs
internally and renders the result headlessly to your terminal as ASCII.

## What's a headless browser?

A headless browser is a real browser engine (HTML parser, DOM, CSS engine, layout)
that runs without a visible window — you drive it with code instead of a mouse. Real
ones (Chromium/WebKit/Gecko) also ship a JavaScript engine and pixel renderer. This
project builds the *guts* so you can see how they fit together.

## The pipeline

```
fetch → tokenize HTML → build DOM → parse CSS → resolve styles (cascade) → box layout → paint (ASCII)
```

## Non-goals

This is an educational engine, deliberately kept small:

- No JavaScript execution.
- No inline text flow, floats, flexbox, or grid — block boxes only.
- No pixel rendering — ASCII output only.

## Usage

```
node browser.js <url|file> [--tree]
```

(Full CLI wiring lands in the final commit.)
