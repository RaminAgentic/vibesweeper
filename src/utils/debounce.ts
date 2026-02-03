/**
 * Debounce function to limit how often a function can be called
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before calling function
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const context = this;

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
}
