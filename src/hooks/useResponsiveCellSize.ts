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

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Detect orientation
      const isLandscape = viewportWidth > viewportHeight;

      // Minimum size constraints - ensure comfortable touch targets
      const minSize = isMobile ? 32 : 24;

      // Maximum size constraints - adjusted for ultra-wide displays
      const isUltrawide = viewportWidth > 2560;
      const maxSize = isUltrawide ? 70 : (isMobile ? 60 : 65);

      // Account for UI elements (header, stats, controls, padding)
      // Adjust based on device type and orientation
      const horizontalPadding = isMobile ? 16 : 32;

      // Vertical space reserved for UI elements - optimized for orientation
      let verticalReserved: number;
      if (isMobile) {
        // Mobile needs less vertical space in landscape mode
        verticalReserved = isLandscape ? 250 : 450;
      } else {
        verticalReserved = 400;
      }

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
