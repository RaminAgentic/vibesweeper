import { useEffect, useRef } from 'react';
import { formatTime } from '../utils/formatUtils';

interface EndGameModalProps {
  isOpen: boolean;
  result: 'won' | 'lost';
  stats: {
    time: number;
    moves: number;
    difficulty: string;
  };
  onRestart: () => void;
  onChangeDifficulty: () => void;
}

interface StatRowProps {
  label: string;
  value: string | number;
}

/**
 * Individual stat row in the modal
 */
function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 font-semibold uppercase text-sm tracking-wide">
        {label}
      </span>
      <span className="text-gray-900 font-extrabold text-xl">
        {value}
      </span>
    </div>
  );
}

/**
 * End-game modal that appears on win or loss
 * Shows game result, statistics, and restart options
 * Implements accessibility features (focus trap, keyboard navigation)
 */
export function EndGameModal({
  isOpen,
  result,
  stats,
  onRestart,
  onChangeDifficulty,
}: EndGameModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management - focus primary button when modal opens
  useEffect(() => {
    if (isOpen && restartButtonRef.current) {
      restartButtonRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation - close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onRestart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onRestart]);

  if (!isOpen) return null;

  const isWin = result === 'won';
  const resultColor = isWin ? 'text-green-600' : 'text-red-600';
  const resultMessage = isWin ? '🎉 Victory!' : '💥 Game Over';
  const resultSubtext = isWin
    ? 'Congratulations! You cleared all the mines!'
    : 'Better luck next time!';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4
                 animate-fadeIn"
      onClick={onRestart}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-[95vw] sm:max-w-md w-full p-6 sm:p-8 border-4 border-gray-900
                   animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Result message */}
        <h2
          id="modal-title"
          className={`text-5xl font-extrabold mb-3 text-center ${resultColor}`}
        >
          {resultMessage}
        </h2>

        <p className="text-center text-gray-600 font-medium mb-8 text-lg">
          {resultSubtext}
        </p>

        {/* Statistics display */}
        <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
          <StatRow label="Time" value={formatTime(stats.time)} />
          <div className="border-t border-gray-300"></div>
          <StatRow label="Moves" value={stats.moves} />
          <div className="border-t border-gray-300"></div>
          <StatRow label="Difficulty" value={stats.difficulty.toUpperCase()} />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            ref={restartButtonRef}
            onClick={onRestart}
            className="w-full px-6 sm:px-8 py-4
                       min-h-[52px]
                       bg-blue-600 text-white font-extrabold text-lg sm:text-xl
                       rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105
                       active:scale-95 transition-all duration-150
                       focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Play again with same difficulty"
          >
            Play Again
          </button>

          <button
            onClick={onChangeDifficulty}
            className="w-full px-6 sm:px-8 py-4
                       min-h-[52px]
                       bg-gray-200 text-gray-900 font-bold text-base sm:text-lg
                       rounded-xl shadow hover:bg-gray-300 hover:scale-105
                       active:scale-95 transition-all duration-150
                       focus:outline-none focus:ring-4 focus:ring-gray-400"
            aria-label="Change game difficulty"
          >
            Change Difficulty
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Press ESC or click outside to close
        </p>
      </div>
    </div>
  );
}
