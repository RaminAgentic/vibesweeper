import { useState, useEffect } from 'react';

interface CustomDifficultyFormProps {
  onApply: (config: { width: number; height: number; mines: number }) => void;
  onCancel: () => void;
  initialValues?: { width: number; height: number; mines: number };
}

interface ValidationErrors {
  width?: string;
  height?: string;
  mines?: string;
}

/**
 * Custom Difficulty Form Component
 * Allows users to create custom game configurations with validation
 * Ensures settings result in playable, fair game boards
 */
export function CustomDifficultyForm({
  onApply,
  onCancel,
  initialValues = { width: 12, height: 12, mines: 20 },
}: CustomDifficultyFormProps) {
  const [width, setWidth] = useState(initialValues.width);
  const [height, setHeight] = useState(initialValues.height);
  const [mines, setMines] = useState(initialValues.mines);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validate inputs
  const validate = (w: number, h: number, m: number): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Width validation
    if (w < 5 || w > 50) {
      newErrors.width = 'Width must be between 5 and 50';
    }

    // Height validation
    if (h < 5 || h > 50) {
      newErrors.height = 'Height must be between 5 and 50';
    }

    // Mines validation
    // Ensure first click + 8 neighbors are safe: mines < (width * height - 9)
    const maxMines = w * h - 9;
    if (m < 1) {
      newErrors.mines = 'At least 1 mine required';
    } else if (m > maxMines) {
      newErrors.mines = `Maximum ${maxMines} mines for ${w}×${h} grid`;
    }

    return newErrors;
  };

  // Validate on input change
  useEffect(() => {
    const validationErrors = validate(width, height, mines);
    setErrors(validationErrors);
  }, [width, height, mines]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Calculate recommended mine count (15-20% density)
  const recommendedMines = Math.floor(width * height * 0.17);

  const handleApply = () => {
    if (isValid) {
      onApply({ width, height, mines });
    }
  };

  const handleWidthChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setWidth(num);
    }
  };

  const handleHeightChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setHeight(num);
    }
  };

  const handleMinesChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setMines(num);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl border-4 border-gray-900 shadow-xl">
      <h3 className="text-2xl font-extrabold mb-4 text-gray-900">
        Custom Difficulty
      </h3>

      {/* Width Input */}
      <div className="mb-4">
        <label
          htmlFor="width"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Width (5-50)
        </label>
        <input
          id="width"
          type="number"
          min="5"
          max="50"
          value={width}
          onChange={(e) => handleWidthChange(e.target.value)}
          className={`
            w-full px-4 py-3 text-lg font-semibold rounded-lg border-2
            ${
              errors.width
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-blue-600'
            }
            focus:outline-none focus:ring-2
            ${errors.width ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
          `}
          aria-invalid={!!errors.width}
          aria-describedby={errors.width ? 'width-error' : undefined}
        />
        {errors.width && (
          <p id="width-error" className="mt-1 text-sm text-red-600 font-semibold">
            {errors.width}
          </p>
        )}
      </div>

      {/* Height Input */}
      <div className="mb-4">
        <label
          htmlFor="height"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Height (5-50)
        </label>
        <input
          id="height"
          type="number"
          min="5"
          max="50"
          value={height}
          onChange={(e) => handleHeightChange(e.target.value)}
          className={`
            w-full px-4 py-3 text-lg font-semibold rounded-lg border-2
            ${
              errors.height
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-blue-600'
            }
            focus:outline-none focus:ring-2
            ${errors.height ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
          `}
          aria-invalid={!!errors.height}
          aria-describedby={errors.height ? 'height-error' : undefined}
        />
        {errors.height && (
          <p id="height-error" className="mt-1 text-sm text-red-600 font-semibold">
            {errors.height}
          </p>
        )}
      </div>

      {/* Mines Input */}
      <div className="mb-4">
        <label
          htmlFor="mines"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Mines
        </label>
        <input
          id="mines"
          type="number"
          min="1"
          max={width * height - 9}
          value={mines}
          onChange={(e) => handleMinesChange(e.target.value)}
          className={`
            w-full px-4 py-3 text-lg font-semibold rounded-lg border-2
            ${
              errors.mines
                ? 'border-red-500 focus:border-red-600'
                : 'border-gray-300 focus:border-blue-600'
            }
            focus:outline-none focus:ring-2
            ${errors.mines ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
          `}
          aria-invalid={!!errors.mines}
          aria-describedby={errors.mines ? 'mines-error' : undefined}
        />
        {errors.mines && (
          <p id="mines-error" className="mt-1 text-sm text-red-600 font-semibold">
            {errors.mines}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Recommended: ~{recommendedMines} mines (15-20% density)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleApply}
          disabled={!isValid}
          className={`
            flex-1 px-6 py-3 font-extrabold text-lg rounded-xl
            transition-all duration-150
            ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          aria-label="Apply custom difficulty settings"
        >
          Apply
        </button>

        <button
          onClick={onCancel}
          className="
            flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold text-lg
            rounded-xl hover:bg-gray-300 hover:scale-105 active:scale-95
            transition-all duration-150
            focus:outline-none focus:ring-4 focus:ring-gray-400
          "
          aria-label="Cancel custom difficulty"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
