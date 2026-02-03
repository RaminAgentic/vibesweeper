import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GameState, DifficultyConfig, DifficultyLevel, Coordinate, CellStatus } from '../types/game.types';
import { createEmptyGrid } from '../utils/gridUtils';
import { placeMinesAndCalculate } from '../utils/mineUtils';
import { revealCellWithCascade, revealAllMines } from '../utils/revealUtils';
import { DIFFICULTY_PRESETS } from '../types/game.types';
import { saveGameState, loadGameState, clearGameState } from '../utils/persistence';
import { debounce } from '../utils/debounce';

/**
 * Extended game store interface with actions
 * Combines GameState with action methods for state management
 */
interface GameStore extends GameState {
  // Timer state (not persisted in GameState)
  timerInterval: number | null;

  // Difficulty selection state
  selectedDifficulty: DifficultyLevel;
  customSettings: DifficultyConfig | null;

  // Actions
  initializeGame: (difficulty?: DifficultyConfig) => void;
  revealCell: (coordinate: Coordinate) => void;
  toggleFlag: (coordinate: Coordinate) => void;
  resetGame: () => void;
  setDifficulty: (level: DifficultyLevel) => void;
  setCustomSettings: (config: Omit<DifficultyConfig, 'level'>) => void;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  hydrate: () => void;
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
      timerInterval: null,
      selectedDifficulty: 'beginner',
      customSettings: null,

      /**
       * Initialize or reset the game with a new difficulty
       * @param difficulty - Optional difficulty configuration. If not provided, uses current selectedDifficulty
       */
      initializeGame: (difficulty) => {
        // Stop timer if running
        get().stopTimer();

        // Clear persisted state when starting new game
        clearGameState();

        const state = get();
        let config: DifficultyConfig;

        if (difficulty) {
          config = difficulty;
        } else {
          // Use selectedDifficulty to determine config
          if (state.selectedDifficulty === 'custom' && state.customSettings) {
            config = state.customSettings;
          } else if (state.selectedDifficulty !== 'custom') {
            config = DIFFICULTY_PRESETS[state.selectedDifficulty];
          } else {
            // Fallback to beginner if custom selected but no settings
            config = DIFFICULTY_PRESETS.beginner;
          }
        }

        set({
          grid: createEmptyGrid(config),
          gameStatus: 'not-started',
          difficulty: config,
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

          // Start the timer
          setTimeout(() => get().startTimer(), 0);
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

        // Reveal all mines on loss, marking triggered mine
        let finalGrid = result.grid;
        if (finalStatus === 'lost') {
          finalGrid = revealAllMines(result.grid, coordinate);
        }

        // Stop timer if game ended
        if (finalStatus === 'won' || finalStatus === 'lost') {
          get().stopTimer();
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

      /**
       * Start the game timer
       * Called automatically when game status changes to 'in-progress'
       * Guards against duplicate intervals
       */
      startTimer: () => {
        const state = get();

        // Guard: prevent duplicate intervals
        if (state.timerInterval !== null) {
          console.warn('[Timer] Attempted to start duplicate interval');
          return;
        }

        const intervalId = setInterval(() => {
          const currentState = get();

          // Only increment if game is in progress
          if (currentState.gameStatus === 'in-progress') {
            get().tickTimer();
          } else {
            // Auto-stop if game status changed
            get().stopTimer();
          }
        }, 1000);

        set({ timerInterval: intervalId });
      },

      /**
       * Stop the game timer and clear interval
       */
      stopTimer: () => {
        const state = get();

        if (state.timerInterval !== null) {
          clearInterval(state.timerInterval);
          set({ timerInterval: null });
        }
      },

      /**
       * Increment elapsed time by 1 second
       * Called by timer interval
       */
      tickTimer: () => {
        const state = get();
        set({ elapsedTime: state.elapsedTime + 1 });
      },

      /**
       * Set the difficulty level and reinitialize the game
       * @param level - The difficulty level to set
       */
      setDifficulty: (level) => {
        const state = get();
        let config: DifficultyConfig;

        if (level === 'custom') {
          if (state.customSettings) {
            config = state.customSettings;
          } else {
            // Default custom settings if none exist
            config = { level: 'custom', width: 12, height: 12, mines: 20 };
            set({ customSettings: config });
          }
        } else {
          config = DIFFICULTY_PRESETS[level];
        }

        set({ selectedDifficulty: level });
        get().initializeGame(config);
      },

      /**
       * Save custom difficulty settings
       * @param config - Custom configuration (width, height, mines)
       */
      setCustomSettings: (config) => {
        const customConfig: DifficultyConfig = {
          level: 'custom',
          width: config.width,
          height: config.height,
          mines: config.mines,
        };

        set({
          customSettings: customConfig,
          selectedDifficulty: 'custom',
        });

        get().initializeGame(customConfig);
      },

      /**
       * Hydrate state from localStorage
       * Called on app mount to restore saved game
       */
      hydrate: () => {
        const saved = loadGameState();

        if (!saved) {
          return;
        }

        // Only restore if game was in progress
        if (saved.gameState.gameStatus === 'in-progress') {
          set({
            grid: saved.gameState.grid,
            gameStatus: saved.gameState.gameStatus,
            difficulty: saved.gameState.difficulty,
            isFirstClick: saved.gameState.isFirstClick,
            revealedCount: saved.gameState.revealedCount,
            flagCount: saved.gameState.flagCount,
            elapsedTime: saved.gameState.elapsedTime,
            moveCount: saved.gameState.moveCount,
            selectedDifficulty: saved.selectedDifficulty,
            customSettings: saved.customSettings,
          });

          // Resume timer if game was in progress
          setTimeout(() => get().startTimer(), 0);
        }
      },
    }),
    { name: 'GameStore' }
  )
);

/**
 * Debounced save function (300ms delay)
 * Prevents excessive localStorage writes
 */
const debouncedSave = debounce((
  gameState: GameState,
  selectedDifficulty: DifficultyLevel,
  customSettings: DifficultyConfig | null
) => {
  // Only save if game is in progress
  if (gameState.gameStatus === 'in-progress') {
    saveGameState(gameState, selectedDifficulty, customSettings);
  } else if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
    // Clear saved state when game ends
    clearGameState();
  }
}, 300);

/**
 * Subscribe to store changes and auto-save
 */
useGameStore.subscribe((state) => {
  const { grid, gameStatus, difficulty, isFirstClick, revealedCount, flagCount, elapsedTime, moveCount, selectedDifficulty, customSettings } = state;

  const gameState: GameState = {
    grid,
    gameStatus,
    difficulty,
    isFirstClick,
    revealedCount,
    flagCount,
    elapsedTime,
    moveCount,
  };

  debouncedSave(gameState, selectedDifficulty, customSettings);
});
