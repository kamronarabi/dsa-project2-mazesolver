import React, { useState, useRef, useEffect, useCallback } from 'react';
import Toolbar from './components/Toolbar.jsx';
import { generateMaze } from './lib/mazeGen.js';
import { computeBFS, computeDFS, animateSolve } from './lib/solvers.js';
import { initCanvas, drawGrid, drawRect, drawRectFilled } from './lib/canvas.js';
import { toIdx } from './lib/utils.js';

const WIDTH = 320;
const HEIGHT = 320;
const CANVAS_SIZE = 1280; 

function App() {
  const [stats, setStats] = useState({
    runtimeMs: 0,
    visited: 0,
    pathLength: 0
  });
  const [isSolving, setIsSolving] = useState(false);
  const [lastAlgo, setLastAlgo] = useState('');

  const canvasRef = useRef(null);
  const canvasStateRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasStateRef.current = initCanvas(canvasRef.current, CANVAS_SIZE, CANVAS_SIZE);
      canvasStateRef.current.clear();
      canvasStateRef.current.commit();
    }
  }, []);
  
  const handleGenerate = useCallback(() => {
    if (isSolving) return;
    
    try {

      setIsSolving(false);
      setLastAlgo('');
      
      const grid = generateMaze(WIDTH, HEIGHT);
      gridRef.current = grid;
      
      if (canvasStateRef.current) {
        const { data, commit } = canvasStateRef.current;
        
        data.fill(255);
        
        drawGrid(data, CANVAS_SIZE, CANVAS_SIZE, grid, WIDTH, HEIGHT);
        drawRect(data, CANVAS_SIZE, CANVAS_SIZE, 0, 0, 1, 1, [0, 0, 255], WIDTH, HEIGHT); // Blue for start
        drawRect(data, CANVAS_SIZE, CANVAS_SIZE, WIDTH - 1, HEIGHT - 1, 1, 1, [255, 0, 0], WIDTH, HEIGHT); // Red for goal
        
        commit();
      }
      
      setStats({
        runtimeMs: 0,
        visited: 0,
        pathLength: 0
      });
      
    } catch (error) {
      console.error('Error generating maze:', error);
    }
  }, [isSolving]);
  
  const handleSolveDFS = useCallback(async () => {
    if (isSolving || !gridRef.current) return;
    
    setIsSolving(true);
    setLastAlgo('DFS');
    
    try {
      const grid = gridRef.current;
      const startIdx = 0; 
      const goalIdx = toIdx(WIDTH - 1, HEIGHT - 1, WIDTH);
      const solution = computeDFS(grid, WIDTH, HEIGHT, startIdx, goalIdx);
      
      setStats({
        runtimeMs: Math.round(solution.runtimeMs * 100) / 100,
        visited: solution.visitedCount,
        pathLength: solution.finalPath.length
      });
      
      if (canvasStateRef.current) {
        const { data, commit } = canvasStateRef.current;
        
        drawGrid(data, CANVAS_SIZE, CANVAS_SIZE, grid, WIDTH, HEIGHT);
        drawRect(data, CANVAS_SIZE, CANVAS_SIZE, 0, 0, 1, 1, [0, 0, 255], WIDTH, HEIGHT); // Blue for start
        drawRect(data, CANVAS_SIZE, CANVAS_SIZE, WIDTH - 1, HEIGHT - 1, 1, 1, [255, 0, 0], WIDTH, HEIGHT); // Red for goal
        commit();
        
        await animateSolve(
          canvasStateRef.current.ctx,
          WIDTH,
          HEIGHT,
          solution.visitedOrder,
          solution.parent,
          startIdx,
          goalIdx,
          {
            animEveryN: 600,
            drawVisitedGray: true,
            setPixel: (x, y, color) => {
              drawRectFilled(data, CANVAS_SIZE, CANVAS_SIZE, x, y, 1, 1, color, WIDTH, HEIGHT);
            },
            commit: () => commit()
          }
        );
      }
      
    } catch (error) {
      console.error('Error solving maze with DFS:', error);
    } finally {
      setIsSolving(false);
    }
  }, [isSolving]);
  
  const handleSolveBFS = useCallback(async () => {
    if (isSolving || !gridRef.current) return;
    
    setIsSolving(true);
    setLastAlgo('BFS');
    
    try {
      const grid = gridRef.current;
      const startIdx = 0; 
      const goalIdx = toIdx(WIDTH - 1, HEIGHT - 1, WIDTH);   
      const solution = computeBFS(grid, WIDTH, HEIGHT, startIdx, goalIdx);
      
      setStats({
        runtimeMs: Math.round(solution.runtimeMs * 100) / 100,
        visited: solution.visitedCount,
        pathLength: solution.finalPath.length
      });
      
      if (canvasStateRef.current) {
        const { data, commit } = canvasStateRef.current;
        
        drawGrid(data, CANVAS_SIZE, CANVAS_SIZE, grid, WIDTH, HEIGHT);
        drawRect(data, CANVAS_SIZE, CANVAS_SIZE, 0, 0, 1, 1, [0, 0, 255], WIDTH, HEIGHT); // Blue for start
        drawRect(data, CANVAS_SIZE, CANVAS_SIZE, WIDTH - 1, HEIGHT - 1, 1, 1, [255, 0, 0], WIDTH, HEIGHT); // Red for goal
        commit();
        
        await animateSolve(
          canvasStateRef.current.ctx,
          WIDTH,
          HEIGHT,
          solution.visitedOrder,
          solution.parent,
          startIdx,
          goalIdx,
          {
            animEveryN: 600,
            drawVisitedGray: true,
            setPixel: (x, y, color) => {
              drawRectFilled(data, CANVAS_SIZE, CANVAS_SIZE, x, y, 1, 1, color, WIDTH, HEIGHT);
            },
            commit: () => commit()
          }
        );
      }
      
    } catch (error) {
      console.error('Error solving maze with BFS:', error);
    } finally {
      setIsSolving(false);
    }
  }, [isSolving]);
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Maze Solver</h1>
        <p>Generate and solve 320×320 mazes with DFS and BFS algorithms</p>
      </header>
      
      <Toolbar 
        onGenerate={handleGenerate}
        onSolveDFS={handleSolveDFS}
        onSolveBFS={handleSolveBFS}
        isSolving={isSolving}
      />
      
      <div className="status-bar">
        Runtime: {stats.runtimeMs} ms | Visited: {stats.visited} | Path Length: {stats.pathLength}
        {lastAlgo && <span className="algorithm-name"> ({lastAlgo})</span>}
      </div>
      
      <div className="canvas-container">
        <canvas 
          ref={canvasRef}
          className="maze-canvas"
        />
      </div>
    </div>
  );
}

export default App;