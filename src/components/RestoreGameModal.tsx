
interface RestoreGameModalProps {
  onRestore: () => void;
  onNewGame: () => void;
}

/**
 * Modal that prompts user to restore a saved game or start fresh
 * Appears when saved game state is detected on app load
 */
export function RestoreGameModal({ onRestore, onNewGame }: RestoreGameModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Resume Game?
        </h2>

        <p className="text-gray-300 text-lg mb-6">
          We found a game in progress. Would you like to continue where you left off?
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestore}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
          >
            Continue Game
          </button>

          <button
            onClick={onNewGame}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
