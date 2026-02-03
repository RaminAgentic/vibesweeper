import type { Cell as CellType } from '../types/game.types';

interface CellProps {
  cell: CellType;
  onClick: () => void;
}

/**
 * Individual cell component
 * Displays cell state and handles click interactions
 */
export function Cell({ cell, onClick }: CellProps) {
  const getContent = () => {
    if (cell.status === 'hidden') return '';
    if (cell.status === 'flagged') return '🚩';
    if (cell.hasMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };

  const getNumberColor = (num: number): string => {
    const colors: Record<number, string> = {
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-red-600',
      4: 'text-purple-700',
      5: 'text-yellow-700',
      6: 'text-cyan-600',
      7: 'text-gray-900',
      8: 'text-pink-600',
    };
    return colors[num] || 'text-gray-900';
  };

  const getStyles = () => {
    const base = 'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold select-none';

    if (cell.status === 'hidden') {
      return `${base} bg-gray-300 cursor-pointer hover:bg-gray-200 active:bg-gray-100`;
    }

    if (cell.hasMine && cell.isTriggeredMine) {
      return `${base} bg-red-600 text-white`;
    }

    if (cell.hasMine) {
      return `${base} bg-red-400`;
    }

    const numberColor = cell.adjacentMines > 0 ? getNumberColor(cell.adjacentMines) : '';
    return `${base} bg-gray-100 ${numberColor}`;
  };

  return (
    <button
      className={getStyles()}
      onClick={onClick}
      disabled={cell.status === 'revealed'}
      type="button"
    >
      {getContent()}
    </button>
  );
}
