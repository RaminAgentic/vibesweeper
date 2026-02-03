import type { Grid, GameStatus, Coordinate } from '../types/game.types';
import { getCell, getNeighbors } from './gridUtils';

/**
 * Result of a reveal operation
 */
export interface RevealResult {
  grid: Grid;
  gameStatus: GameStatus;
  revealedCount: number;
}

/**
 * Reveals a single cell without cascade
 * @param grid - The game grid
 * @param coordinate - Cell coordinates to reveal
 * @param currentGameStatus - Current game status
 * @returns Result with updated grid, game status, and count of revealed cells
 */
export function revealCell(
  grid: Grid,
  coordinate: Coordinate,
  currentGameStatus: GameStatus
): RevealResult {
  // Guards
  if (currentGameStatus !== 'in-progress') {
    return { grid, gameStatus: currentGameStatus, revealedCount: 0 };
  }

  const cell = getCell(grid, coordinate.row, coordinate.col);

  if (!cell || cell.status !== 'hidden') {
    return { grid, gameStatus: currentGameStatus, revealedCount: 0 };
  }

  // Create mutable copy
  const newGrid = grid.map(row => row.map(c => ({ ...c })));
  const targetCell = newGrid[coordinate.row][coordinate.col];

  // Reveal the cell
  targetCell.status = 'revealed';
  let revealedCount = 1;

  // Check for mine
  if (targetCell.hasMine) {
    targetCell.isTriggeredMine = true;
    return {
      grid: newGrid,
      gameStatus: 'lost',
      revealedCount
    };
  }

  // Cell revealed successfully
  return {
    grid: newGrid,
    gameStatus: 'in-progress',
    revealedCount
  };
}

/**
 * Reveals a cell with cascade logic for empty cells
 * Uses iterative BFS (breadth-first search) algorithm to avoid stack overflow
 * @param grid - The game grid
 * @param coordinate - Starting cell coordinates
 * @param currentGameStatus - Current game status
 * @returns Result with updated grid, game status, and count of all revealed cells
 */
export function revealCellWithCascade(
  grid: Grid,
  coordinate: Coordinate,
  currentGameStatus: GameStatus
): RevealResult {
  // Initial reveal
  const initialResult = revealCell(grid, coordinate, currentGameStatus);

  // If game ended or cell has adjacent mines, no cascade
  if (initialResult.gameStatus !== 'in-progress') {
    return initialResult;
  }

  const cell = getCell(initialResult.grid, coordinate.row, coordinate.col);
  if (!cell || cell.adjacentMines > 0) {
    return initialResult;
  }

  // Cascade reveal using iterative BFS
  const newGrid = initialResult.grid.map(row => row.map(c => ({ ...c })));
  let revealedCount = initialResult.revealedCount;

  const queue: Coordinate[] = [coordinate];
  const visited = new Set<string>();
  visited.add(`${coordinate.row},${coordinate.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentCell = getCell(newGrid, current.row, current.col);

    if (!currentCell) continue;

    // If this cell has adjacent mines, reveal it and stop cascading from it
    if (currentCell.adjacentMines > 0) {
      if (currentCell.status === 'hidden') {
        currentCell.status = 'revealed';
        revealedCount++;
      }
      continue;
    }

    // Empty cell - cascade to neighbors
    const neighbors = getNeighbors(newGrid, current.row, current.col);

    for (const neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;

      if (visited.has(key) || neighbor.status !== 'hidden' || neighbor.hasMine) {
        continue;
      }

      visited.add(key);
      neighbor.status = 'revealed';
      revealedCount++;

      // Add to queue for further cascading
      queue.push({ row: neighbor.row, col: neighbor.col });
    }
  }

  return {
    grid: newGrid,
    gameStatus: 'in-progress',
    revealedCount
  };
}

/**
 * Reveals all mines on the grid (used when game is lost)
 * @param grid - The game grid
 * @returns Updated grid with all mines revealed
 */
export function revealAllMines(grid: Grid): Grid {
  return grid.map(row =>
    row.map(cell => {
      if (cell.hasMine && cell.status !== 'revealed') {
        return { ...cell, status: 'revealed' as const };
      }
      return cell;
    })
  );
}
