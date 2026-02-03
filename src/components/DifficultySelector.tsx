import type { DifficultyLevel } from '../types/game.types';
import { DIFFICULTY_PRESETS } from '../types/game.types';

interface DifficultyOption {
  level: DifficultyLevel;
  name: string;
  specs?: string;
  icon: string;
}

interface DifficultySelectorProps {
  selectedLevel: DifficultyLevel;
  onSelect: (level: DifficultyLevel) => void;
}

/**
 * Difficulty Selector Component
 * Displays preset difficulty options (Beginner, Intermediate, Expert) and Custom option
 * Allows users to select their preferred difficulty level
 */
export function DifficultySelector({ selectedLevel, onSelect }: DifficultySelectorProps) {
  const options: DifficultyOption[] = [
    {
      level: 'beginner',
      name: 'Beginner',
      specs: `${DIFFICULTY_PRESETS.beginner.width}×${DIFFICULTY_PRESETS.beginner.height}, ${DIFFICULTY_PRESETS.beginner.mines} mines`,
      icon: '🌱',
    },
    {
      level: 'intermediate',
      name: 'Intermediate',
      specs: `${DIFFICULTY_PRESETS.intermediate.width}×${DIFFICULTY_PRESETS.intermediate.height}, ${DIFFICULTY_PRESETS.intermediate.mines} mines`,
      icon: '⚡',
    },
    {
      level: 'expert',
      name: 'Expert',
      specs: `${DIFFICULTY_PRESETS.expert.width}×${DIFFICULTY_PRESETS.expert.height}, ${DIFFICULTY_PRESETS.expert.mines} mines`,
      icon: '🔥',
    },
    {
      level: 'custom',
      name: 'Custom',
      specs: 'Create your own',
      icon: '⚙️',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      {options.map((option) => {
        const isSelected = selectedLevel === option.level;

        return (
          <button
            key={option.level}
            onClick={() => onSelect(option.level)}
            className={`
              p-6 rounded-xl border-4 transition-all duration-200
              ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 scale-105'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:scale-102'
              }
              focus:outline-none focus:ring-4 focus:ring-blue-300
              active:scale-95
            `}
            aria-label={`Select ${option.name} difficulty: ${option.specs}`}
            aria-pressed={isSelected}
          >
            {/* Icon */}
            <div className="text-5xl mb-3">{option.icon}</div>

            {/* Name */}
            <h3 className="text-2xl font-extrabold mb-2 text-gray-900">
              {option.name}
            </h3>

            {/* Specs */}
            <p className="text-sm font-semibold text-gray-600">
              {option.specs}
            </p>

            {/* Selected Indicator */}
            {isSelected && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                <span>✓</span>
                <span>SELECTED</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
