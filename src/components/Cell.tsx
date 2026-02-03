import { useState, useRef, useEffect } from 'react';
import type { Cell as CellType } from '../types/game.types';
import { useGameStore } from '../store/gameStore';

interface CellProps {
  cell: CellType;
}

/**
 * Individual cell component with full input handling
 * Supports desktop (mouse) and mobile (touch) interactions
 * Left-click/tap to reveal, right-click/long-press to flag
 */
export function Cell({ cell }: CellProps) {
  const revealCell = useGameStore(state => state.revealCell);
  const toggleFlag = useGameStore(state => state.toggleFlag);
  const gameStatus = useGameStore(state => state.gameStatus);

  // Touch state for long-press detection
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<number | null>(null);

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
    };
  }, []);

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
  };

  /**
   * Mobile: Touch cancelled (finger moved off cell)
   */
  const handleTouchCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTouchStartTime(null);
    setIsLongPressing(false);
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
    const base = 'w-10 h-10 sm:w-12 sm:h-12 border border-gray-400 flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-150';

    // Prevent interactions when game is over
    const isGameOver = gameStatus === 'won' || gameStatus === 'lost';

    // Long-press visual feedback (highest priority)
    if (isLongPressing) {
      return `${base} bg-yellow-300 scale-105 ring-2 ring-yellow-500 animate-pulse`;
    }

    // Hidden cell
    if (cell.status === 'hidden') {
      const interactive = !isGameOver
        ? 'hover:bg-gray-400 active:scale-95 cursor-pointer'
        : 'cursor-not-allowed';
      return `${base} bg-gray-300 ${interactive}`;
    }

    // Flagged cell
    if (cell.status === 'flagged') {
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

  return (
    <button
      className={getStyles()}
      {...eventHandlers}
      type="button"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
      }}
    >
      {getContent()}
    </button>
  );
}
