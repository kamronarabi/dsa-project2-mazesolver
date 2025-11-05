/**
 * Canvas management and pixel operations for maze visualization
 */

export function initCanvas(canvas, width, height) {
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  return {
    ctx,
    imageData,
    data,
    width,
    height,
    commit() {
      ctx.putImageData(imageData, 0, 0);
    },
    clear() {
      data.fill(255);
    },
  };
}

export function setPixel(data, width, x, y, color) {
  const idx = (y * width + x) * 4;
  data[idx] = color[0];
  data[idx + 1] = color[1];
  data[idx + 2] = color[2];
  data[idx + 3] = 255;
}

export function setPixelAlpha(data, width, x, y, color) {
  const idx = (y * width + x) * 4;
  data[idx] = color[0];
  data[idx + 1] = color[1];
  data[idx + 2] = color[2];
  data[idx + 3] = color[3];
}

export function drawPoints(data, width, points, color) {
  for (const { x, y } of points) {
    setPixel(data, width, x, y, color);
  }
}

export function drawPointsFromIndices(data, width, indices, color) {
  for (const idx of indices) {
    const x = idx % width;
    const y = Math.floor(idx / width);
    setPixel(data, width, x, y, color);
  }
}

export function drawGrid(
  data,
  canvasWidth,
  canvasHeight,
  grid,
  gridWidth,
  gridHeight,
  colorMap = {}
) {
  const defaultColors = {
    0: [255, 255, 255],
    1: [0, 0, 0],
  };

  const colors = { ...defaultColors, ...colorMap };

  const scaleX = canvasWidth / gridWidth;
  const scaleY = canvasHeight / gridHeight;

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const gridIdx = y * gridWidth + x;
      const value = grid[gridIdx];
      const color = colors[value] || [255, 255, 255];

      const startX = Math.floor(x * scaleX);
      const startY = Math.floor(y * scaleY);
      const endX = Math.floor((x + 1) * scaleX);
      const endY = Math.floor((y + 1) * scaleY);

      for (let cy = startY; cy < endY && cy < canvasHeight; cy++) {
        for (let cx = startX; cx < endX && cx < canvasWidth; cx++) {
          setPixel(data, canvasWidth, cx, cy, color);
        }
      }
    }
  }
}

export function drawLine(data, width, height, x1, y1, x2, y2, color) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  while (true) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      setPixel(data, width, x, y, color);
    }

    if (x === x2 && y === y2) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

export function drawRect(
  data,
  canvasWidth,
  canvasHeight,
  gridX,
  gridY,
  gridW,
  gridH,
  color,
  gridWidth,
  gridHeight
) {
  const scaleX = canvasWidth / gridWidth;
  const scaleY = canvasHeight / gridHeight;

  const x = Math.floor(gridX * scaleX);
  const y = Math.floor(gridY * scaleY);
  const w = Math.floor(gridW * scaleX);
  const h = Math.floor(gridH * scaleY);

  for (let i = x; i < x + w; i++) {
    if (i >= 0 && i < canvasWidth && y >= 0 && y < canvasHeight) {
      setPixel(data, canvasWidth, i, y, color);
    }
    if (
      i >= 0 &&
      i < canvasWidth &&
      y + h - 1 >= 0 &&
      y + h - 1 < canvasHeight
    ) {
      setPixel(data, canvasWidth, i, y + h - 1, color);
    }
  }

  for (let i = y; i < y + h; i++) {
    if (x >= 0 && x < canvasWidth && i >= 0 && i < canvasHeight) {
      setPixel(data, canvasWidth, x, i, color);
    }
    if (
      x + w - 1 >= 0 &&
      x + w - 1 < canvasWidth &&
      i >= 0 &&
      i < canvasHeight
    ) {
      setPixel(data, canvasWidth, x + w - 1, i, color);
    }
  }
}

export function drawRectFilled(
  data,
  canvasWidth,
  canvasHeight,
  gridX,
  gridY,
  gridW,
  gridH,
  color,
  gridWidth,
  gridHeight
) {
  const scaleX = canvasWidth / gridWidth;
  const scaleY = canvasHeight / gridHeight;

  const x = Math.floor(gridX * scaleX);
  const y = Math.floor(gridY * scaleY);
  const w = Math.floor(gridW * scaleX);
  const h = Math.floor(gridH * scaleY);

  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const px = x + dx;
      const py = y + dy;
      if (px >= 0 && px < canvasWidth && py >= 0 && py < canvasHeight) {
        setPixel(data, canvasWidth, px, py, color);
      }
    }
  }
}
