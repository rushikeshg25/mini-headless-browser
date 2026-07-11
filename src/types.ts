// Shared types for the engine. This module exports types only — it produces no
// runtime code, so it must always be imported with `import type`.

export type Attrs = Record<string, string>;

// --- DOM ---

export interface DomElement {
  type: 'element';
  tag: string;
  attrs: Attrs;
  children: DomNode[];
  parent: DomNode | null;
}

export interface DomText {
  type: 'text';
  text: string;
  parent: DomNode | null;
}

export type DomNode = DomElement | DomText;

// --- HTML tokens ---

export interface OpenToken {
  type: 'open';
  tag: string;
  attrs: Attrs;
  selfClosing: boolean;
}

export interface CloseToken {
  type: 'close';
  tag: string;
}

export interface TextToken {
  type: 'text';
  text: string;
}

export type Token = OpenToken | CloseToken | TextToken;

// --- CSS ---

export type Declarations = Record<string, string>;

export interface Rule {
  selectors: string[];
  declarations: Declarations;
}

// --- Styled tree ---

export interface StyledElement {
  type: 'element';
  tag: string;
  attrs: Attrs;
  node: DomElement;
  specified: Declarations;
  children: StyledNode[];
}

export interface StyledText {
  type: 'text';
  text: string;
}

export type StyledNode = StyledElement | StyledText;

// --- Layout boxes ---

export interface ElementBox {
  type: 'element';
  tag: string;
  x: number;
  y: number;
  width: number;
  height: number;
  margin: number;
  padding: number;
  children: Box[];
}

export interface TextBox {
  type: 'text';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Box = ElementBox | TextBox;
