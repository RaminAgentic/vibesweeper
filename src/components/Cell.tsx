import { useState, useRef, useEffect } from 'react';
import type { Cell as CellType } from '../types/game.types';
import { useGameStore } from '../store/gameStore';

interface CellProps {
  cell: CellType;
  size: number;
}

/**
 * Individual cell component with full input handling
 * Supports desktop (mouse) and mobile (touch) interactions
 * Left-click/tap to reveal, right-click/long-press to flag
 */
export function Cell({ cell, size }: CellProps) {
  const revealCell = useGameStore(state => state.revealCell);
  const toggleFlag = useGameStore(state => state.toggleFlag);
  const gameStatus = useGameStore(state => state.gameStatus);

  // Touch state for long-press detection
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const longPressTimer = useRef<number | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Device detection
  const [hasTouch] = useState(() =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Progressive feedback effect during long-press
  useEffect(() => {
    if (touchStartTime && !isLongPressing) {
      // Start progress tracking
      progressInterval.current = window.setInterval(() => {
        const elapsed = Date.now() - touchStartTime;
        const progress = Math.min((elapsed / 500) * 100, 100);
        setLongPressProgress(progress);

        // Stop when we reach 100%
        if (progress >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
          }
        }
      }, 16); // ~60fps

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      };
    } else if (!touchStartTime) {
      // Reset progress when touch ends
      setLongPressProgress(0);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
  }, [touchStartTime, isLongPressing]);

  /**
   * Desktop: Left-click to reveal
   */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    if (cell.status === 'flagged' || cell.status === 'revealed') return;

    revealCell({ row: cell.row, col: cell.col });
  };

  /**
   * Desktop: Right-click to flag/unflag
   */
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent browser context menu
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    if (cell.status === 'revealed') return;

    toggleFlag({ row: cell.row, col: cell.col });
  };

  /**
   * Mobile: Touch start - begins long-press detection
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent text selection, zoom, context menu

    setTouchStartTime(Date.now());

    // Start visual feedback after 300ms (before actual flag at 500ms)
    longPressTimer.current = window.setTimeout(() => {
      setIsLongPressing(true);
    }, 300);
  };

  /**
   * Mobile: Touch end - determines if tap or long-press
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (gameStatus === 'won' || gameStatus === 'lost') {
      setTouchStartTime(null);
      setIsLongPressing(false);
      return;
    }

    if (touchStartTime) {
      const duration = Date.now() - touchStartTime;

      if (duration >= 500) {
        // Long-press: flag/unflag
        if (cell.status !== 'revealed') {
          toggleFlag({ row: cell.row, col: cell.col });
        }
      } else {
        // Quick tap: reveal
        if (cell.status !== 'flagged' && cell.status !== 'revealed') {
          revealCell({ row: cell.row, col: cell.col });
        }
      }
    }

    setTouchStartTime(null);
    setIsLongPressing(false);
    setLongPressProgress(0);
  };

  /**
   * Mobile: Touch cancelled (finger moved off cell)
   */
  const handleTouchCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setTouchStartTime(null);
    setIsLongPressing(false);
    setLongPressProgress(0);
  };

  /**
   * Get cell content based on state
   */
  const getContent = () => {
    if (cell.status === 'hidden') return '';
    if (cell.status === 'flagged') return '🚩';
    if (cell.hasMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };

  /**
   * Color coding for numbers 1-8
   */
  const getNumberColor = (num: number): string => {
    const colors: Record<number, string> = {
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-red-600',
      4: 'text-purple-700',
      5: 'text-orange-700',
      6: 'text-teal-600',
      7: 'text-gray-900',
      8: 'text-gray-700',
    };
    return colors[num] || 'text-gray-900';
  };

  /**
   * Get dynamic styles based on cell state and interactions
   */
  const getStyles = () => {
    const base = 'border border-gray-400 flex items-center justify-center font-bold transition-all duration-150';

    // Prevent interactions when game is over
    const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

    // Long-press visual feedback (highest priority)
    // Show progressive feedback when long-press is in progress
    if (touchStartTime && longPressProgress > 0) {
      const intensity = Math.floor(longPressProgress / 20); // 0-5 levels
      return `${base} bg-yellow-${Math.min(300 + intensity * 100, 400)} scale-${100 + Math.floor(longPressProgress / 20)} ring-${Math.min(2 + Math.floor(longPressProgress / 50), 4)} ring-yellow-500 transition-all duration-75`;
    }

    // Hidden cell
    if (cell.status === 'hidden') {
      const interactive = !isGameOver
        ? 'hover:bg-gray-400 active:scale-95 cursor-pointer'
        : 'cursor-not-allowed';
      return `${base} bg-gray-300 ${interactive}`;
    }

    // Flagged cell (with incorrect flag indicator on loss)
    if (cell.status === 'flagged') {
      if (cell.isIncorrectFlag) {
        // Incorrect flag - show in red with X indicator
        return `${base} bg-red-300 line-through`;
      }
      const interactive = !isGameOver ? 'hover:bg-yellow-500 cursor-pointer' : '';
      return `${base} bg-yellow-400 ${interactive}`;
    }

    // Revealed cell with mine
    if (cell.status === 'revealed' && cell.hasMine) {
      const mineColor = cell.isTriggeredMine
        ? 'bg-red-600 ring-4 ring-red-800'
        : 'bg-red-400';
      return `${base} ${mineColor} text-white`;
    }

    // Revealed cell with number or empty
    const numberColor = cell.adjacentMines > 0
      ? getNumberColor(cell.adjacentMines)
      : '';

    return `${base} bg-gray-100 ${numberColor}`;
  };

  // Build event handlers based on device capabilities
  const eventHandlers = {
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    ...(hasTouch && {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    }),
  };

  // Calculate font size based on cell size (roughly 40% of cell size)
  const fontSize = Math.max(12, Math.floor(size * 0.4));

  // Calculate progressive border style for long-press
  const progressBorderStyle =
    touchStartTime && longPressProgress > 0
      ? {
          boxShadow: `inset 0 0 0 ${Math.floor((longPressProgress / 100) * 4)}px rgba(234, 179, 8, ${longPressProgress / 100})`,
        }
      : {};

  return (
    <button
      className={getStyles()}
      {...eventHandlers}
      type="button"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fontSize}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
        ...progressBorderStyle,
      }}
    >
      {getContent()}
    </button>
  );
}
