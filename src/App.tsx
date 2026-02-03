import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Grid } from './components/Grid';
import { StatsPanel } from './components/StatsPanel';
import { EndGameModal } from './components/EndGameModal';
import { DifficultyModal } from './components/DifficultyModal';

function App() {
  const {
    grid,
    gameStatus,
    difficulty,
    elapsedTime,
    moveCount,
    resetGame,
    selectedDifficulty,
    setDifficulty,
    setCustomSettings,
  } = useGameStore();

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);

  const showEndGameModal = gameStatus === 'won' || gameStatus === 'lost';

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'not-started':
        return 'Click any cell to start!';
      case 'in-progress':
        return 'Find all the mines!';
      case 'won':
        return '';
      case 'lost':
        return '';
      default:
        return '';
    }
  };

  const handleChangeDifficulty = () => {
    setIsDifficultyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
        Minesweeper
      </h1>

      {/* Status Message */}
      {!showEndGameModal && (
        <p className="text-xl font-bold mb-6 text-gray-700">
          {getStatusMessage()}
        </p>
      )}

      {/* Statistics Panel */}
      <div className="mb-6 w-full max-w-2xl">
        <StatsPanel />
      </div>

      {/* Game Grid */}
      <div className="mb-6">
        <Grid grid={grid} />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 w-full max-w-md px-4 sm:px-0">
        <button
          onClick={resetGame}
          className="flex-1 px-6 sm:px-8 py-4 sm:py-4
                     min-h-[48px] sm:min-h-[56px] min-w-[44px]
                     bg-blue-600 text-white font-extrabold text-base sm:text-lg
                     rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105
                     active:scale-95 transition-all duration-150
                     focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Start new game with same difficulty"
        >
          New Game
        </button>

        <button
          onClick={handleChangeDifficulty}
          className="flex-1 px-6 sm:px-8 py-4 sm:py-4
                     min-h-[48px] sm:min-h-[56px] min-w-[44px]
                     bg-gray-700 text-white font-bold text-base sm:text-lg
                     rounded-xl shadow-lg hover:bg-gray-800 hover:scale-105
                     active:scale-95 transition-all duration-150
                     focus:outline-none focus:ring-4 focus:ring-gray-500"
          aria-label="Change game difficulty"
        >
          Change Difficulty
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-sm text-gray-600 text-center max-w-md space-y-1">
        <p className="font-semibold">How to Play:</p>
        <p>Desktop: Left-click to reveal • Right-click to flag</p>
        <p>Mobile: Tap to reveal • Long-press to flag</p>
      </div>

      {/* End-Game Modal */}
      <EndGameModal
        isOpen={showEndGameModal}
        result={gameStatus === 'won' ? 'won' : 'lost'}
        stats={{
          time: elapsedTime,
          moves: moveCount,
          difficulty: difficulty.level,
        }}
        onRestart={resetGame}
        onChangeDifficulty={handleChangeDifficulty}
      />

      {/* Difficulty Modal */}
      <DifficultyModal
        isOpen={isDifficultyModalOpen}
        onClose={() => setIsDifficultyModalOpen(false)}
        currentGameStatus={gameStatus}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setDifficulty}
        onApplyCustom={setCustomSettings}
      />
    </div>
  );
}

export default App;
