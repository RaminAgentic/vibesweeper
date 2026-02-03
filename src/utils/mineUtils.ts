import type { Grid, Coordinate } from '../types/game.types';
import { getNeighbors } from './gridUtils';

/**
 * Distributes mines randomly across the grid while ensuring the first click and its neighbors are safe
 * Uses Fisher-Yates shuffle algorithm for random distribution
 * @param grid - The game grid
 * @param mineCount - Number of mines to place
 * @param firstClick - Coordinates of the first cell clicked (safe zone center)
 * @returns Updated grid with mines placed
 * @throws Error if there aren't enough valid positions for the requested mine count
 */
export function distributeMines(
  grid: Grid,
  mineCount: number,
  firstClick: Coordinate
): Grid {
  // Create deep copy to avoid mutation
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  const height = newGrid.length;
  const width = newGrid[0].length;

  // Get safe zone (first click + neighbors)
  const safeZone = new Set<string>();
  safeZone.add(`${firstClick.row},${firstClick.col}`);

  const neighbors = getNeighbors(newGrid, firstClick.row, firstClick.col);
  neighbors.forEach(cell => {
    safeZone.add(`${cell.row},${cell.col}`);
  });

  // Generate list of valid positions for mines
  const validPositions: Coordinate[] = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const key = `${row},${col}`;
      if (!safeZone.has(key)) {
        validPositions.push({ row, col });
      }
    }
  }

  // Validate we have enough valid positions
  if (validPositions.length < mineCount) {
    throw new Error('Not enough valid positions for mines');
  }

  // Randomly place mines using Fisher-Yates shuffle
  const shuffled = [...validPositions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Place mines in first `mineCount` positions
  for (let i = 0; i < mineCount; i++) {
    const { row, col } = shuffled[i];
    newGrid[row][col].hasMine = true;
  }

  return newGrid;
}

/**
 * Calculates and assigns adjacent mine counts for all cells in the grid
 * Mine cells themselves get adjacentMines = 0
 * @param grid - The game grid with mines already placed
 * @returns Updated grid with accurate adjacent mine counts
 */
export function calculateAdjacentMines(grid: Grid): Grid {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      const cell = newGrid[row][col];

      // Skip mine cells
      if (cell.hasMine) {
        cell.adjacentMines = 0;
        continue;
      }

      // Count adjacent mines
      const neighbors = getNeighbors(newGrid, row, col);
      cell.adjacentMines = neighbors.filter(n => n.hasMine).length;
    }
  }

  return newGrid;
}

/**
 * Combined function that places mines and calculates adjacent counts in one operation
 * This is the main function to call when setting up mines after first click
 * @param grid - The game grid
 * @param mineCount - Number of mines to place
 * @param firstClick - Coordinates of the first cell clicked
 * @returns Grid with mines placed and adjacent counts calculated
 */
export function placeMinesAndCalculate(
  grid: Grid,
  mineCount: number,
  firstClick: Coordinate
): Grid {
  const withMines = distributeMines(grid, mineCount, firstClick);
  return calculateAdjacentMines(withMines);
}
