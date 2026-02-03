import { useGameStore } from '../store/gameStore';
import { formatTime } from '../utils/formatUtils';
import type { DifficultyConfig } from '../types/game.types';

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
}

/**
 * Individual stat item displaying icon, label, and value
 */
function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[100px]">
      <div className="text-3xl">{icon}</div>
      <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
        {label}
      </div>
      <div className="text-2xl font-extrabold text-gray-900">
        {value}
      </div>
    </div>
  );
}

/**
 * Format difficulty display name and specs
 */
function getDifficultyDisplay(difficulty: DifficultyConfig): string {
  if (difficulty.level === 'custom') {
    return `Custom ${difficulty.width}×${difficulty.height}`;
  }
  const levelName = difficulty.level.charAt(0).toUpperCase() + difficulty.level.slice(1);
  return levelName;
}

/**
 * Statistics display panel showing difficulty, timer, mines, and moves
 * Positioned prominently at top of game board
 * Responsive layout with bold design system principles
 */
export function StatsPanel() {
  const { elapsedTime, difficulty, flagCount, moveCount } = useGameStore();

  // Calculate remaining mines
  const remainingMines = difficulty.mines - flagCount;
  const formattedTime = formatTime(elapsedTime);
  const difficultyDisplay = getDifficultyDisplay(difficulty);

  return (
    <div
      className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12
                 p-6 bg-white rounded-xl shadow-xl border-4 border-gray-900
                 min-h-[120px]"
      role="region"
      aria-label="Game statistics"
    >
      <StatItem icon="🎮" label="Difficulty" value={difficultyDisplay} />
      <StatItem icon="⏱️" label="Time" value={formattedTime} />
      <StatItem icon="💣" label="Mines" value={remainingMines} />
      <StatItem icon="🎯" label="Moves" value={moveCount} />
    </div>
  );
}
