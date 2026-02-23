/**
 * Utility functions for formatting test result data
 */

/**
 * Parse total marks string into scored and maximum values
 * @param totalMarks - String in format "scored/maximum" (e.g., "41/360")
 * @returns Object with scored and maximum values
 */
export function parseTotalMarks(totalMarks: string): { scored: number; maximum: number } {
  const [scored, maximum] = totalMarks.split('/').map(Number);
  return { scored, maximum };
}

/**
 * Calculate percentage from scored and maximum values
 * @param scored - Score achieved
 * @param maximum - Maximum possible score
 * @returns Formatted percentage string
 */
export function calculatePercentage(scored: number, maximum: number): string {
  if (maximum === 0) return '0';
  const percentage = (scored / maximum) * 100;
  return percentage === 0 ? '0' : percentage.toFixed(2);
}

/**
 * Format percentage value according to requirements
 * @param percentage - Percentage value
 * @returns Formatted percentage string
 */
export function formatPercentage(percentage: number): string {
  return percentage === 0 ? '0' : percentage.toFixed(2);
}

/**
 * Format global rank value, returning 'NA' if undefined
 * @param globalRank - Optional global rank value
 * @returns Formatted global rank string
 */
export function formatGlobalRank(globalRank?: bigint): string {
  return globalRank !== undefined ? globalRank.toString() : 'NA';
}
