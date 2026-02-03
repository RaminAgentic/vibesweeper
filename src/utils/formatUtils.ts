/**
 * Format elapsed time in seconds to MM:SS or HH:MM:SS format
 * @param seconds - Total elapsed seconds
 * @returns Formatted time string (MM:SS for < 1 hour, HH:MM:SS for >= 1 hour)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Pad single digits with leading zero
  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${pad(minutes)}:${pad(secs)}`;
}
