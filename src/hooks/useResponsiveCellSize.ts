import { useState, useEffect } from 'react';

/**
 * Custom hook for calculating responsive cell sizes
 * Ensures cells are appropriately sized for different grid dimensions and devices
 * Maintains minimum touch target size on mobile (32px)
 *
 * @param gridWidth - Number of columns in the grid
 * @param gridHeight - Number of rows in the grid
 * @returns cellSize - Calculated cell size in pixels
 */
export function useResponsiveCellSize(gridWidth: number, gridHeight: number): number {
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    const calculateSize = () => {
      // Detect if device has touch capability
      const isMobile = window.matchMedia('(pointer: coarse)').matches;

      // Minimum size constraints
      const minSize = isMobile ? 32 : 24;
      const maxSize = 60;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Account for UI elements (header, stats, controls, padding)
      const horizontalPadding = 32; // 16px on each side
      const verticalReserved = 400; // Space for header, stats, controls, instructions

      const availableWidth = viewportWidth - horizontalPadding;
      const availableHeight = viewportHeight - verticalReserved;

      // Calculate size that fits the grid
      const sizeByWidth = availableWidth / gridWidth;
      const sizeByHeight = availableHeight / gridHeight;

      // Use the smaller dimension to ensure grid fits
      const calculatedSize = Math.floor(Math.min(sizeByWidth, sizeByHeight));

      // Clamp between min and max
      const finalSize = Math.max(minSize, Math.min(maxSize, calculatedSize));

      setCellSize(finalSize);
    };

    // Calculate initially
    calculateSize();

    // Debounce resize events for performance
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateSize, 300) as unknown as number;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [gridWidth, gridHeight]);

  return cellSize;
}
