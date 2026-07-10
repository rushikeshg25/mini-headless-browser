// Paint a box tree onto an ASCII character grid. Element boxes are drawn as
// rectangular borders; text boxes drop their characters into place. The result
// is a printable multi-line string — the "headless" render of the page.

export function paint(root) {
  const width = Math.max(1, root.x + root.width);
  const height = Math.max(1, root.y + root.height);
  const grid = Array.from({ length: height }, () => Array(width).fill(' '));

  const draw = (box) => {
    if (box.type === 'text') {
      putText(grid, box.x, box.y, box.text, box.width);
    } else {
      drawBorder(grid, box.x, box.y, box.width, box.height);
      for (const child of box.children) draw(child);
    }
  };
  draw(root);

  return grid.map((row) => row.join('').replace(/\s+$/, '')).join('\n');
}

function set(grid, x, y, ch) {
  if (y < 0 || y >= grid.length) return;
  if (x < 0 || x >= grid[y].length) return;
  grid[y][x] = ch;
}

function putText(grid, x, y, text, maxWidth) {
  const clipped = text.slice(0, maxWidth);
  for (let i = 0; i < clipped.length; i++) set(grid, x + i, y, clipped[i]);
}

function drawBorder(grid, x, y, w, h) {
  if (w < 2 || h < 2) return;
  const right = x + w - 1;
  const bottom = y + h - 1;
  for (let cx = x; cx <= right; cx++) {
    set(grid, cx, y, '-');
    set(grid, cx, bottom, '-');
  }
  for (let cy = y; cy <= bottom; cy++) {
    set(grid, x, cy, '|');
    set(grid, right, cy, '|');
  }
  set(grid, x, y, '+');
  set(grid, right, y, '+');
  set(grid, x, bottom, '+');
  set(grid, right, bottom, '+');
}
