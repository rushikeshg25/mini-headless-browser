// A minimal block-layout engine. Turns a styled tree into a box tree where every
// box has absolute { x, y, width, height } in character cells.
//
// The model is deliberately simple: every element is a block box that fills its
// container's width (unless `width` is set) and stacks its children top-to-bottom.
// Text nodes occupy a single line. Supported properties: display (block|none),
// width, height, and uniform margin/padding (a single length like "2px").

function px(value) {
  if (value == null) return 0;
  const m = String(value).match(/-?\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

export function layoutTree(styled, containerWidth) {
  return layoutBlock(styled, 0, 0, containerWidth);
}

// Lays out `styled` whose margin box starts at (x, y). Returns a box, or null
// when the element is display:none.
function layoutBlock(styled, x, y, containerWidth) {
  const s = styled.specified ?? {};
  if (s.display === 'none') return null;

  const margin = px(s.margin);
  const padding = px(s.padding);

  const boxX = x + margin;
  const boxY = y + margin;
  const width = s.width != null ? px(s.width) : Math.max(0, containerWidth - 2 * margin);

  const contentX = boxX + padding;
  const contentWidth = Math.max(0, width - 2 * padding);

  const children = [];
  let cursorY = boxY + padding;

  for (const child of styled.children ?? []) {
    if (child.type === 'text') {
      children.push({
        type: 'text',
        text: child.text,
        x: contentX,
        y: cursorY,
        width: contentWidth,
        height: 1,
      });
      cursorY += 1;
    } else {
      const box = layoutBlock(child, contentX, cursorY, contentWidth);
      if (box) {
        children.push(box);
        cursorY += box.height + 2 * box.margin;
      }
    }
  }

  const contentHeight = cursorY - (boxY + padding);
  const height = s.height != null ? px(s.height) : contentHeight + padding;

  return {
    type: 'element',
    tag: styled.tag,
    x: boxX,
    y: boxY,
    width,
    height,
    margin,
    padding,
    children,
  };
}
