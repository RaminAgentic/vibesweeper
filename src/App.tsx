import { DIFFICULTY_PRESETS } from './types/game.types';
import { useGameStore } from './store/gameStore';
import { Grid } from './components/Grid';

function App() {
  const { grid, gameStatus, difficulty, moveCount, revealedCount, flagCount, initializeGame } = useGameStore();

  const remainingMines = difficulty.mines - flagCount;

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'not-started':
        return 'Click any cell to start!';
      case 'in-progress':
        return 'Game in progress...';
      case 'won':
        return '🎉 You won! Congratulations!';
      case 'lost':
        return '💥 Game Over! You hit a mine.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'won':
        return 'text-green-600';
      case 'lost':
        return 'text-red-600';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Minesweeper</h1>

      <div className="mb-6 text-center">
        <p className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
        <div className="flex gap-4 justify-center text-sm text-gray-600">
          <p>
            <span className="font-semibold">Moves:</span> {moveCount}
          </p>
          <p>
            <span className="font-semibold">Remaining Mines:</span> {remainingMines}
          </p>
          <p>
            <span className="font-semibold">Revealed:</span> {revealedCount}/
            {difficulty.width * difficulty.height - difficulty.mines}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Grid grid={grid} />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => initializeGame(DIFFICULTY_PRESETS.beginner)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          New Game
        </button>
      </div>

      <div className="mt-8 text-xs text-gray-500 text-center max-w-md">
        <p>Sprint 2: Interactive controls with flag placement</p>
        <p className="mt-1">
          Left-click to reveal • Right-click to flag • Long-press on mobile to flag
        </p>
      </div>
    </div>
  );
}

export default App;
