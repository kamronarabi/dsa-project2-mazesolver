/**
 * Toolbar component with Generate and Solve buttons
 */

import React from "react";

export default function Toolbar({
  onGenerate,
  onSolveDFS,
  onSolveBFS,
  isSolving,
}) {
  return (
    <div className="toolbar">
      <button
        onClick={onGenerate}
        disabled={isSolving}
        className="toolbar-button generate-button"
        title="Generate a new random maze"
      >
        Generate
      </button>

      <button
        onClick={onSolveDFS}
        disabled={isSolving}
        className="toolbar-button solve-button dfs-button"
        title="Solve maze using Depth-First Search"
      >
        Solve DFS
      </button>

      <button
        onClick={onSolveBFS}
        disabled={isSolving}
        className="toolbar-button solve-button bfs-button"
        title="Solve maze using Breadth-First Search"
      >
        Solve BFS
      </button>
    </div>
  );
}
