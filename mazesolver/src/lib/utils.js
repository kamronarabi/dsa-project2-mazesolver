


//Convert 2D coordinates to 1D index
export function toIdx(x, y, width) {
  return y * width + x;
}


//Convert 1D index to 2D coordinates
export function toXY(idx, width) {
  return {
    x: idx % width,
    y: Math.floor(idx / width)
  };
}


//Check if coordinates are within grid bounds
export function inBounds(x, y, width, height) {
  return x >= 0 && x < width && y >= 0 && y < height;
}


//Get 4-connected neighbors
export function neighbors4(x, y, width, height) {
  const neighbors = [];
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 }, 
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
  ];

  for (const { dx, dy } of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (inBounds(nx, ny, width, height)) {
      neighbors.push({ x: nx, y: ny });
    }
  }

  return neighbors;
}

//Get 8-connected neighbors (including diagonals)
export function neighbors8(x, y, width, height) {
  const neighbors = [];
  const directions = [
    { dx: -1, dy: -1 }, 
    { dx: 0, dy: -1 }, 
    { dx: 1, dy: -1 }, 
    { dx: -1, dy: 0 }, 
    { dx: 1, dy: 0 },  
    { dx: -1, dy: 1 },  
    { dx: 0, dy: 1 },   
    { dx: 1, dy: 1 }    
  ];

  for (const { dx, dy } of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (inBounds(nx, ny, width, height)) {
      neighbors.push({ x: nx, y: ny });
    }
  }

  return neighbors;
}
