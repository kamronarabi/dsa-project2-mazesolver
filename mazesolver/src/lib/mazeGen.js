import { toIdx, neighbors4 } from './utils.js';

const WALL = 1;
const PASSAGE = 0;


//Generate a maze using randomized Prim's algorithm
export function generateMaze(width, height) {
  const grid = new Uint8Array(width * height);
  grid.fill(WALL);
  
  const startIdx = 0;
  grid[startIdx] = PASSAGE;
  
  const frontier = new Set();
  const { x: startX, y: startY } = { x: 0, y: 0 };
  
  const startNeighbors = neighbors4(startX, startY, width, height);
  for (const { x, y } of startNeighbors) {
    const idx = toIdx(x, y, width);
    if (grid[idx] === WALL) {
      frontier.add(idx);
    }
  }
  
  while (frontier.size > 0) {
    const frontierArray = Array.from(frontier);
    const randomWallIdx = frontierArray[Math.floor(Math.random() * frontierArray.length)];
    const { x: wallX, y: wallY } = { x: randomWallIdx % width, y: Math.floor(randomWallIdx / width) };
    
    frontier.delete(randomWallIdx);
    
    const neighbors = neighbors4(wallX, wallY, width, height);
    const passageNeighbors = neighbors.filter(({ x, y }) => {
      const idx = toIdx(x, y, width);
      return grid[idx] === PASSAGE;
    });
    
    if (passageNeighbors.length === 1) {
      grid[randomWallIdx] = PASSAGE;
      
      for (const { x, y } of neighbors) {
        const idx = toIdx(x, y, width);
        if (grid[idx] === WALL && !frontier.has(idx)) {
          const wallNeighbors = neighbors4(x, y, width, height);
          const hasPassageNeighbor = wallNeighbors.some(({ x: nx, y: ny }) => {
            return grid[toIdx(nx, ny, width)] === PASSAGE;
          });
          
          if (hasPassageNeighbor) {
            frontier.add(idx);
          }
        }
      }
    }
  }
  
  const startIdx_final = toIdx(0, 0, width);
  const goalIdx = toIdx(width - 1, height - 1, width);
  grid[startIdx_final] = PASSAGE;
  grid[goalIdx] = PASSAGE;
  
  return grid;
}