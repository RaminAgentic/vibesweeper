import { useState, useEffect } from 'react';
import type { DifficultyLevel, GameStatus } from '../types/game.types';
import { DifficultySelector } from './DifficultySelector';
import { CustomDifficultyForm } from './CustomDifficultyForm';

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGameStatus: GameStatus;
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onApplyCustom: (config: { width: number; height: number; mines: number }) => void;
}

/**
 * Difficulty Modal Component
 * Handles the workflow for changing difficulty levels
 * Shows confirmation if game is in progress
 */
export function DifficultyModal({
  isOpen,
  onClose,
  currentGameStatus,
  selectedDifficulty,
  onSelectDifficulty,
  onApplyCustom,
}: DifficultyModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<DifficultyLevel | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(false);
      setShowCustomForm(false);
      setPendingDifficulty(null);
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDifficultySelect = (level: DifficultyLevel) => {
    // Check if game is in progress
    if (currentGameStatus === 'in-progress') {
      setPendingDifficulty(level);
      setShowConfirmation(true);
    } else {
      // Safe to change immediately
      if (level === 'custom') {
        setShowCustomForm(true);
      } else {
        onSelectDifficulty(level);
        onClose();
      }
    }
  };

  const handleConfirmChange = () => {
    if (pendingDifficulty === 'custom') {
      setShowCustomForm(true);
      setShowConfirmation(false);
    } else if (pendingDifficulty) {
      onSelectDifficulty(pendingDifficulty);
      onClose();
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingDifficulty(null);
  };

  const handleCustomApply = (config: { width: number; height: number; mines: number }) => {
    onApplyCustom(config);
    onClose();
  };

  const handleCustomCancel = () => {
    setShowCustomForm(false);
    setPendingDifficulty(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="difficulty-modal-title"
    >
      <div
        className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-8 rounded-2xl shadow-2xl max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="text-center">
            <h2
              id="difficulty-modal-title"
              className="text-3xl font-extrabold mb-4 text-gray-900"
            >
              ⚠️ Game in Progress
            </h2>
            <p className="text-lg font-semibold text-gray-700 mb-6">
              Changing difficulty will reset your current game. Continue?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <button
                onClick={handleConfirmChange}
                className="flex-1 px-6 sm:px-8 py-4
                         min-h-[48px] min-w-[44px]
                         bg-red-600 text-white font-extrabold text-base sm:text-lg
                         rounded-xl hover:bg-red-700 hover:scale-105 active:scale-95
                         transition-all duration-150
                         focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Yes, Change Difficulty
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="flex-1 px-6 sm:px-8 py-4
                         min-h-[48px] min-w-[44px]
                         bg-gray-300 text-gray-700 font-bold text-base sm:text-lg
                         rounded-xl hover:bg-gray-400 hover:scale-105 active:scale-95
                         transition-all duration-150
                         focus:outline-none focus:ring-4 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Custom Form */}
        {!showConfirmation && showCustomForm && (
          <div className="flex flex-col items-center">
            <CustomDifficultyForm
              onApply={handleCustomApply}
              onCancel={handleCustomCancel}
            />
          </div>
        )}

        {/* Difficulty Selector */}
        {!showConfirmation && !showCustomForm && (
          <div className="flex flex-col items-center">
            <h2
              id="difficulty-modal-title"
              className="text-4xl font-extrabold mb-6 text-gray-900"
            >
              Choose Difficulty
            </h2>
            <DifficultySelector
              selectedLevel={selectedDifficulty}
              onSelect={handleDifficultySelect}
            />
            <button
              onClick={onClose}
              className="mt-6 px-8 py-4
                       min-h-[48px] min-w-[120px]
                       bg-gray-300 text-gray-700 font-bold text-base sm:text-lg
                       rounded-xl hover:bg-gray-400 hover:scale-105 active:scale-95
                       transition-all duration-150
                       focus:outline-none focus:ring-4 focus:ring-gray-400"
              aria-label="Close difficulty modal"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
