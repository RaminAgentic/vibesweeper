import { useState, useCallback } from 'react';
import type { GameState, DifficultyConfig, Coordinate } from '../types/game.types';
import { createEmptyGrid } from '../utils/gridUtils';
import { placeMinesAndCalculate } from '../utils/mineUtils';
import { revealCellWithCascade, revealAllMines } from '../utils/revealUtils';

/**
 * Custom hook for managing game state
 * Centralizes all game logic and state management
 * @param initialDifficulty - Starting difficulty configuration
 * @returns Game state and functions to interact with the game
 */
export function useGameState(initialDifficulty: DifficultyConfig) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    grid: createEmptyGrid(initialDifficulty),
    gameStatus: 'not-started',
    difficulty: initialDifficulty,
    isFirstClick: true,
    revealedCount: 0,
    flagCount: 0,
    elapsedTime: 0,
    moveCount: 0,
  }));

  /**
   * Initialize or reset the game with a new difficulty
   */
  const initializeGame = useCallback((difficulty: DifficultyConfig) => {
    setGameState({
      grid: createEmptyGrid(difficulty),
      gameStatus: 'not-started',
      difficulty,
      isFirstClick: true,
      revealedCount: 0,
      flagCount: 0,
      elapsedTime: 0,
      moveCount: 0,
    });
  }, []);

  /**
   * Handle revealing a cell
   * On first click, places mines and starts the game
   * Implements cascade reveal for empty cells
   * Detects win/loss conditions
   */
  const handleReveal = useCallback((coordinate: Coordinate) => {
    setGameState(prev => {
      // Don't allow reveals if game is over
      if (prev.gameStatus === 'won' || prev.gameStatus === 'lost') {
        return prev;
      }

      let newGrid = prev.grid;
      let newStatus = prev.gameStatus;

      // First click: place mines and start game
      if (prev.isFirstClick) {
        newGrid = placeMinesAndCalculate(
          prev.grid,
          prev.difficulty.mines,
          coordinate
        );
        newStatus = 'in-progress';
      }

      // Reveal cell with cascade
      const result = revealCellWithCascade(newGrid, coordinate, newStatus);

      const totalSafeCells =
        prev.difficulty.width * prev.difficulty.height - prev.difficulty.mines;
      const newRevealedCount = prev.revealedCount + result.revealedCount;

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

      return {
        ...prev,
        grid: finalGrid,
        gameStatus: finalStatus,
        isFirstClick: false,
        revealedCount: newRevealedCount,
        moveCount: prev.moveCount + 1,
      };
    });
  }, []);

  return {
    gameState,
    initializeGame,
    revealCell: handleReveal,
  };
}
