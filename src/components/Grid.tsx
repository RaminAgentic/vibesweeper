import type { Grid as GridType } from '../types/game.types';
import { Cell } from './Cell';

interface GridProps {
  grid: GridType;
  onCellClick: (row: number, col: number) => void;
}

/**
 * Grid component that renders the Minesweeper board
 * Manages layout and passes click events to cells
 */
export function Grid({ grid, onCellClick }: GridProps) {
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
          onClick={() => onCellClick(cell.row, cell.col)}
        />
      ))}
    </div>
  );
}
