import type { Cell, Grid, DifficultyConfig } from '../types/game.types';

/**
 * Creates an empty grid with all cells initialized to default state
 * @param config - Difficulty configuration containing width and height
 * @returns A 2D array of cells in default state (hidden, no mines, no adjacent mines)
 */
export function createEmptyGrid(config: DifficultyConfig): Grid {
  const { width, height } = config;
  const grid: Grid = [];

  for (let row = 0; row < height; row++) {
    const gridRow: Cell[] = [];
    for (let col = 0; col < width; col++) {
      gridRow.push({
        row,
        col,
        hasMine: false,
        adjacentMines: 0,
        status: 'hidden',
      });
    }
    grid.push(gridRow);
  }

  return grid;
}

/**
 * Safely retrieves a cell from the grid at the specified coordinates
 * @param grid - The game grid
 * @param row - Row index
 * @param col - Column index
 * @returns The cell at the specified coordinates, or null if out of bounds
 */
export function getCell(grid: Grid, row: number, col: number): Cell | null {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return null;
  }
  return grid[row][col];
}

/**
 * Gets all valid neighboring cells for a given cell position
 * Handles edge and corner cases by only returning valid neighbors
 * @param grid - The game grid
 * @param row - Row index of the target cell
 * @param col - Column index of the target cell
 * @returns Array of neighboring cells (max 8 for interior cells, fewer for edges/corners)
 */
export function getNeighbors(grid: Grid, row: number, col: number): Cell[] {
  const neighbors: Cell[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [dRow, dCol] of directions) {
    const cell = getCell(grid, row + dRow, col + dCol);
    if (cell) neighbors.push(cell);
  }

  return neighbors;
}
