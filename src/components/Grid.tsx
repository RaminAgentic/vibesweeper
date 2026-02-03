import type { Grid as GridType } from '../types/game.types';
import { Cell } from './Cell';

interface GridProps {
  grid: GridType;
}

/**
 * Grid component that renders the Minesweeper board
 * Manages layout - cells handle their own interactions via store
 */
export function Grid({ grid }: GridProps) {
  if (grid.length === 0 || grid[0].length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="inline-grid gap-0 border-2 border-gray-500"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.flat().map(cell => (
        <Cell
          key={`${cell.row}-${cell.col}`}
          cell={cell}
        />
      ))}
    </div>
  );
}
