import type { GameState, DifficultyLevel, DifficultyConfig } from '../types/game.types';

/**
 * Storage key for persisted game state
 */
const STORAGE_KEY = 'minesweeper_game_state';

/**
 * Storage version for future migrations
 */
const STORAGE_VERSION = '1.0';

/**
 * Interface for persisted state structure
 */
export interface PersistedState {
  version: string;
  timestamp: number;
  gameState: GameState;
  selectedDifficulty: DifficultyLevel;
  customSettings: DifficultyConfig | null;
}

/**
 * Save game state to localStorage with error handling
 * @param gameState - Current game state to persist
 * @param selectedDifficulty - Current difficulty level
 * @param customSettings - Custom difficulty settings (if applicable)
 */
export function saveGameState(
  gameState: GameState,
  selectedDifficulty: DifficultyLevel,
  customSettings: DifficultyConfig | null
): void {
  try {
    const toSave: PersistedState = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      gameState,
      selectedDifficulty,
      customSettings,
    };

    const serialized = JSON.stringify(toSave);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Handle quota exceeded, private mode, etc.
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('[Persistence] LocalStorage quota exceeded. Game state not saved.');
      } else {
        console.warn('[Persistence] Failed to save game state:', error.message);
      }
    } else {
      console.warn('[Persistence] Failed to save game state:', error);
    }
  }
}

/**
 * Load game state from localStorage with validation
 * @returns Persisted state or null if not found/invalid
 */
export function loadGameState(): PersistedState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed: PersistedState = JSON.parse(stored);

    // Validate structure
    if (!isValidPersistedState(parsed)) {
      console.warn('[Persistence] Invalid persisted state structure. Clearing.');
      clearGameState();
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('[Persistence] Failed to load game state:', error);
    clearGameState();
    return null;
  }
}

/**
 * Clear persisted game state from localStorage
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[Persistence] Failed to clear game state:', error);
  }
}

/**
 * Validate persisted state structure
 * @param state - State object to validate
 * @returns True if valid, false otherwise
 */
function isValidPersistedState(state: unknown): state is PersistedState {
  if (!state || typeof state !== 'object') {
    return false;
  }

  const s = state as Partial<PersistedState>;

  // Check required fields
  if (
    typeof s.version !== 'string' ||
    typeof s.timestamp !== 'number' ||
    !s.gameState ||
    typeof s.selectedDifficulty !== 'string'
  ) {
    return false;
  }

  // Validate gameState structure
  const gs = s.gameState;
  if (
    !Array.isArray(gs.grid) ||
    typeof gs.gameStatus !== 'string' ||
    !gs.difficulty ||
    typeof gs.isFirstClick !== 'boolean' ||
    typeof gs.revealedCount !== 'number' ||
    typeof gs.flagCount !== 'number' ||
    typeof gs.elapsedTime !== 'number' ||
    typeof gs.moveCount !== 'number'
  ) {
    return false;
  }

  // Validate difficulty config
  const diff = gs.difficulty;
  if (
    typeof diff.width !== 'number' ||
    typeof diff.height !== 'number' ||
    typeof diff.mines !== 'number' ||
    typeof diff.level !== 'string'
  ) {
    return false;
  }

  // Check version compatibility
  if (s.version !== STORAGE_VERSION) {
    console.warn('[Persistence] Version mismatch. Expected', STORAGE_VERSION, 'got', s.version);
    return false;
  }

  return true;
}

/**
 * Check if localStorage is available
 * @returns True if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
