import type { Grid as GridType } from '../types/game.types';
import { Cell } from './Cell';
import { useResponsiveCellSize } from '../hooks/useResponsiveCellSize';

interface GridProps {
  grid: GridType;
}

/**
 * Grid component that renders the Minesweeper board
 * Manages responsive layout - cells handle their own interactions via store
 */
export function Grid({ grid }: GridProps) {
  if (grid.length === 0 || grid[0].length === 0) {
    return <div>Loading...</div>;
  }

  const gridWidth = grid[0].length;
  const gridHeight = grid.length;

  // Calculate responsive cell size
  const cellSize = useResponsiveCellSize(gridWidth, gridHeight);

  return (
    <div className="flex justify-center items-center p-2 sm:p-4">
      <div
        className="inline-grid gap-0 border-2 border-gray-500 max-w-[98vw] max-h-[75vh] overflow-auto rounded-sm"
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridHeight}, ${cellSize}px)`,
        }}
      >
        {grid.flat().map(cell => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            size={cellSize}
          />
        ))}
      </div>
    </div>
  );
}
