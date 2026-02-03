import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GameState, DifficultyConfig, Coordinate, CellStatus } from '../types/game.types';
import { createEmptyGrid } from '../utils/gridUtils';
import { placeMinesAndCalculate } from '../utils/mineUtils';
import { revealCellWithCascade, revealAllMines } from '../utils/revealUtils';
import { DIFFICULTY_PRESETS } from '../types/game.types';

/**
 * Extended game store interface with actions
 * Combines GameState with action methods for state management
 */
interface GameStore extends GameState {
  // Actions
  initializeGame: (difficulty: DifficultyConfig) => void;
  revealCell: (coordinate: Coordinate) => void;
  toggleFlag: (coordinate: Coordinate) => void;
  resetGame: () => void;
}

/**
 * Zustand store for centralized game state management
 * Replaces the useGameState hook with a more scalable solution
 * Includes devtools middleware for debugging in development
 */
export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      grid: createEmptyGrid(DIFFICULTY_PRESETS.beginner),
      gameStatus: 'not-started',
      difficulty: DIFFICULTY_PRESETS.beginner,
      isFirstClick: true,
      revealedCount: 0,
      flagCount: 0,
      elapsedTime: 0,
      moveCount: 0,

      /**
       * Initialize or reset the game with a new difficulty
       * @param difficulty - The difficulty configuration to use
       */
      initializeGame: (difficulty) => {
        set({
          grid: createEmptyGrid(difficulty),
          gameStatus: 'not-started',
          difficulty,
          isFirstClick: true,
          revealedCount: 0,
          flagCount: 0,
          elapsedTime: 0,
          moveCount: 0,
        });
      },

      /**
       * Reveal a cell at the given coordinate
       * Handles first click mine placement, cascade reveals, and win/loss detection
       * @param coordinate - The row/col position of the cell to reveal
       */
      revealCell: (coordinate) => {
        const state = get();

        // Guard: No actions if game is over
        if (state.gameStatus === 'won' || state.gameStatus === 'lost') {
          return;
        }

        const cell = state.grid[coordinate.row][coordinate.col];

        // Guard: Cannot reveal flagged cells
        if (cell.status === 'flagged') {
          return;
        }

        // Guard: Cannot reveal already-revealed cells
        if (cell.status === 'revealed') {
          return;
        }

        let newGrid = state.grid;
        let newStatus = state.gameStatus;

        // First click: place mines and start game
        if (state.isFirstClick) {
          newGrid = placeMinesAndCalculate(
            state.grid,
            state.difficulty.mines,
            coordinate
          );
          newStatus = 'in-progress';
        }

        // Reveal cell with cascade logic
        const result = revealCellWithCascade(newGrid, coordinate, newStatus);

        const totalSafeCells =
          state.difficulty.width * state.difficulty.height - state.difficulty.mines;
        const newRevealedCount = state.revealedCount + result.revealedCount;

        // Check win condition
        let finalStatus = result.gameStatus;
        if (newRevealedCount === totalSafeCells && finalStatus === 'in-progress') {
          finalStatus = 'won';
        }

        // Reveal all mines on loss
        let finalGrid = result.grid;
        if (finalStatus === 'lost') {
          finalGrid = revealAllMines(result.grid);
        }

        set({
          grid: finalGrid,
          gameStatus: finalStatus,
          isFirstClick: false,
          revealedCount: newRevealedCount,
          moveCount: state.moveCount + 1,
        });
      },

      /**
       * Toggle flag state on a cell
       * Can only flag/unflag hidden or flagged cells
       * @param coordinate - The row/col position of the cell to flag/unflag
       */
      toggleFlag: (coordinate) => {
        const state = get();

        // Guard: No actions if game is over
        if (state.gameStatus === 'won' || state.gameStatus === 'lost') {
          return;
        }

        const cell = state.grid[coordinate.row][coordinate.col];

        // Guard: Cannot flag revealed cells
        if (cell.status === 'revealed') {
          return;
        }

        // Create new grid with toggled flag state
        const newGrid = state.grid.map(row =>
          row.map(c => {
            if (c.row === coordinate.row && c.col === coordinate.col) {
              return {
                ...c,
                status: c.status === 'flagged' ? ('hidden' as CellStatus) : ('flagged' as CellStatus)
              };
            }
            return c;
          })
        );

        const newFlagCount = cell.status === 'flagged'
          ? state.flagCount - 1
          : state.flagCount + 1;

        set({ grid: newGrid, flagCount: newFlagCount });
      },

      /**
       * Reset the game with the current difficulty
       */
      resetGame: () => {
        const state = get();
        get().initializeGame(state.difficulty);
      },
    }),
    { name: 'GameStore' }
  )
);
