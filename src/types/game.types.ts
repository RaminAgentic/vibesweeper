/**
 * Cell status enum - represents the current state of a cell
 */
export type CellStatus = 'hidden' | 'revealed' | 'flagged';

/**
 * Game status enum - represents the current state of the game
 */
export type GameStatus = 'not-started' | 'in-progress' | 'won' | 'lost';

/**
 * Individual cell interface - represents a single cell in the grid
 */
export interface Cell {
  row: number;
  col: number;
  hasMine: boolean;
  adjacentMines: number;
  status: CellStatus;
  isTriggeredMine?: boolean; // For showing which mine caused loss
  isIncorrectFlag?: boolean; // For showing wrong flags on loss
}

/**
 * Grid is 2D array of cells
 */
export type Grid = Cell[][];

/**
 * Difficulty level options
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert' | 'custom';

/**
 * Difficulty configuration interface
 */
export interface DifficultyConfig {
  level: DifficultyLevel;
  width: number;
  height: number;
  mines: number;
}

/**
 * Preset difficulty configurations matching standard Minesweeper specifications
 */
export const DIFFICULTY_PRESETS: Record<Exclude<DifficultyLevel, 'custom'>, DifficultyConfig> = {
  beginner: { level: 'beginner', width: 9, height: 9, mines: 10 },
  intermediate: { level: 'intermediate', width: 16, height: 16, mines: 40 },
  expert: { level: 'expert', width: 30, height: 16, mines: 99 },
};

/**
 * Complete game state interface
 */
export interface GameState {
  grid: Grid;
  gameStatus: GameStatus;
  difficulty: DifficultyConfig;
  isFirstClick: boolean;
  revealedCount: number;
  flagCount: number;
  elapsedTime: number; // seconds
  moveCount: number;
}

/**
 * Coordinate type for clarity when passing row/col positions
 */
export interface Coordinate {
  row: number;
  col: number;
}
