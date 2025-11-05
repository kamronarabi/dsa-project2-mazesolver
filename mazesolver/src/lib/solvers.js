//Maze solving algorithms (DFS and BFS) with animation

import { toIdx, toXY, neighbors4 } from './utils.js';

// Constants
export const FREE = 0;
export const WALL = 1;
export const ANIM_EVERY_N = 600; 

//Compute BFS solution
export function computeBFS(grid, width, height, startIdx, goalIdx) {
  const t0 = performance.now();
  
  const visited = new Uint8Array(width * height);
  const parent = new Int32Array(width * height);
  parent.fill(-1);
  const visitedOrder = [];
  const queue = [startIdx];
  
  visited[startIdx] = 1;
  visitedOrder.push(startIdx);
  
  while (queue.length > 0) {
    const currentIdx = queue.shift();
    
    if (currentIdx === goalIdx) {
      break; // Found goal
    }
    
    const { x, y } = toXY(currentIdx, width);
    const neighbors = neighbors4(x, y, width, height);
    
    for (const { x: nx, y: ny } of neighbors) {
      const neighborIdx = toIdx(nx, ny, width);
      
      if (!visited[neighborIdx] && grid[neighborIdx] === FREE) {
        visited[neighborIdx] = 1;
        parent[neighborIdx] = currentIdx;
        visitedOrder.push(neighborIdx);
        queue.push(neighborIdx);
      }
    }
  }
  
  // Reconstruct path
  const finalPath = [];
  let currentIdx = goalIdx;
  
  while (currentIdx !== -1) {
    finalPath.unshift(currentIdx);
    currentIdx = parent[currentIdx];
  }
  
  const t1 = performance.now();
  const runtimeMs = t1 - t0;
  const visitedCount = visitedOrder.length;
  
  return {
    runtimeMs,
    visitedCount,
    visitedOrder: new Int32Array(visitedOrder),
    parent,
    finalPath
  };
}


//Compute DFS solution
export function computeDFS(grid, width, height, startIdx, goalIdx) {
  const t0 = performance.now();
  
  const visited = new Uint8Array(width * height);
  const parent = new Int32Array(width * height);
  parent.fill(-1);
  const visitedOrder = [];
  const stack = [startIdx];
  
  visited[startIdx] = 1;
  visitedOrder.push(startIdx);
  
  while (stack.length > 0) {
    const currentIdx = stack.pop();
    
    if (currentIdx === goalIdx) {
      break; // Found goal
    }
    
    const { x, y } = toXY(currentIdx, width);
    const neighbors = neighbors4(x, y, width, height);
    
    for (const { x: nx, y: ny } of neighbors) {
      const neighborIdx = toIdx(nx, ny, width);
      
      if (!visited[neighborIdx] && grid[neighborIdx] === FREE) {
        visited[neighborIdx] = 1;
        parent[neighborIdx] = currentIdx;
        visitedOrder.push(neighborIdx);
        stack.push(neighborIdx);
      }
    }
  }
  
  // Reconstruct path
  const finalPath = [];
  let currentIdx = goalIdx;
  
  while (currentIdx !== -1) {
    finalPath.unshift(currentIdx);
    currentIdx = parent[currentIdx];
  }
  
  const t1 = performance.now();
  const runtimeMs = t1 - t0;
  const visitedCount = visitedOrder.length;
  
  return {
    runtimeMs,
    visitedCount,
    visitedOrder: new Int32Array(visitedOrder),
    parent,
    finalPath
  };
}


//Animate the solving process on canvas
export async function animateSolve(ctx, width, height, visitedOrder, parent, startIdx, goalIdx, options = {}) {
  const {
    animEveryN = ANIM_EVERY_N,
    drawVisitedGray = true,
    setPixel,
    commit
  } = options;
  
  const visited = new Set();
  
  for (let i = 0; i < visitedOrder.length; i += animEveryN) {
    // Mark newly visited cells as gray
    if (drawVisitedGray) {
      for (let j = Math.max(0, i - animEveryN); j < Math.min(i + animEveryN, visitedOrder.length); j++) {
        const cellIdx = visitedOrder[j];
        if (!visited.has(cellIdx)) {
          visited.add(cellIdx);
          const { x, y } = toXY(cellIdx, width);
          setPixel(x, y, [176, 176, 176]); // Light gray
        }
      }
    }
    
    // Draw current path to the most recently visited cell
    const currentCellIdx = visitedOrder[Math.min(i + animEveryN - 1, visitedOrder.length - 1)];
    const currentPath = reconstructPath(parent, startIdx, currentCellIdx);
    drawPath(setPixel, commit, currentPath, width, [34, 139, 34]); // Green
    
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  
  // Draw final path
  const finalPath = reconstructPath(parent, startIdx, goalIdx);
  drawPath(setPixel, commit, finalPath, width, [34, 139, 34]); // Green
}

//Reconstruct path from parent array
function reconstructPath(parent, startIdx, goalIdx) {
  const path = [];
  let currentIdx = goalIdx;
  
  while (currentIdx !== -1) {
    path.unshift(currentIdx);
    currentIdx = parent[currentIdx];
  }
  
  return path;
}


//Draw path on canvas
function drawPath(setPixel, commit, path, width, color) {
  for (const cellIdx of path) {
    const x = cellIdx % width;
    const y = Math.floor(cellIdx / width);
    setPixel(x, y, color);
  }
  commit();
}
