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
 * Simulate cascade reveal to calculate opening size
 * @param grid - Grid with mines and adjacent counts calculated
 * @param startCoord - Starting coordinate for cascade
 * @returns Number of cells that would be revealed
 */
function calculateOpeningSize(grid: Grid, startCoord: Coordinate): number {
  const visited = new Set<string>();
  const queue: Coordinate[] = [startCoord];
  let count = 0;

  while (queue.length > 0) {
    const coord = queue.shift()!;
    const key = `${coord.row},${coord.col}`;

    if (visited.has(key)) continue;
    visited.add(key);
    count++;

    const cell = grid[coord.row][coord.col];

    // Only continue cascade if cell has 0 adjacent mines
    if (cell.adjacentMines === 0 && !cell.hasMine) {
      const neighbors = getNeighbors(grid, coord.row, coord.col);
      neighbors.forEach(neighbor => {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey) && !neighbor.hasMine) {
          queue.push({ row: neighbor.row, col: neighbor.col });
        }
      });
    }
  }

  return count;
}

/**
 * Enhanced mine distribution with heuristics to ensure better openings
 * Attempts multiple placements to find one with good opening size
 * @param grid - The game grid
 * @param mineCount - Number of mines to place
 * @param firstClick - Coordinates of the first cell clicked
 * @param minOpeningSize - Minimum desired opening size (default: 9 for 3x3)
 * @param maxRetries - Maximum retry attempts (default: 10)
 * @returns Grid with mines placed
 */
export function distributeMinesEnhanced(
  grid: Grid,
  mineCount: number,
  firstClick: Coordinate,
  minOpeningSize: number = 9,
  maxRetries: number = 10
): Grid {
  const startTime = Date.now();
  const TIMEOUT_MS = 200; // Safety timeout

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Safety check for timeout
    if (Date.now() - startTime > TIMEOUT_MS) {
      console.warn('[MineUtils] Mine generation timeout, using basic algorithm');
      return distributeMines(grid, mineCount, firstClick);
    }

    // Generate candidate placement
    const candidateGrid = distributeMines(grid, mineCount, firstClick);
    const gridWithCounts = calculateAdjacentMines(candidateGrid);

    // Calculate opening size
    const openingSize = calculateOpeningSize(gridWithCounts, firstClick);

    // Accept if opening is large enough
    if (openingSize >= minOpeningSize) {
      return candidateGrid;
    }
  }

  // Fallback: return last attempt even if not ideal
  console.warn('[MineUtils] Could not find optimal mine placement, using fallback');
  return distributeMines(grid, mineCount, firstClick);
}

/**
 * Combined function that places mines and calculates adjacent counts in one operation
 * Uses enhanced algorithm with heuristics to ensure better openings
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
  // Determine minimum opening size based on grid size
  const gridSize = grid.length * grid[0].length;
  const minOpeningSize = gridSize < 100 ? 9 : 12; // 3x3 for small grids, 4x3 for larger

  const withMines = distributeMinesEnhanced(grid, mineCount, firstClick, minOpeningSize);
  return calculateAdjacentMines(withMines);
}
