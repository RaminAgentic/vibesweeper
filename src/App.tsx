import { DIFFICULTY_PRESETS } from './types/game.types';
import { useGameState } from './hooks/useGameState';
import { Grid } from './components/Grid';

function App() {
  const { gameState, revealCell, initializeGame } = useGameState(
    DIFFICULTY_PRESETS.beginner
  );

  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
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
    switch (gameState.gameStatus) {
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
            <span className="font-semibold">Moves:</span> {gameState.moveCount}
          </p>
          <p>
            <span className="font-semibold">Mines:</span> {gameState.difficulty.mines}
          </p>
          <p>
            <span className="font-semibold">Revealed:</span> {gameState.revealedCount}/
            {gameState.difficulty.width * gameState.difficulty.height - gameState.difficulty.mines}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Grid
          grid={gameState.grid}
          onCellClick={(row, col) => revealCell({ row, col })}
        />
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
        <p>Sprint 1: Core game mechanics implemented</p>
        <p className="mt-1">
          Click cells to reveal them. First click is always safe!
        </p>
      </div>
    </div>
  );
}

export default App;
