import { OptimalSequenceResult } from './setupTimeCalculator';

/**
 * Cache for optimal sequence result
 * This avoids recalculating the optimal sequence on every request
 */
let optimalCache: OptimalSequenceResult | null = null;

/**
 * Get the cached optimal sequence result
 */
export function getCachedOptimal(): OptimalSequenceResult | null {
  return optimalCache;
}

/**
 * Set the cached optimal sequence result
 */
export function setCachedOptimal(result: OptimalSequenceResult): void {
  optimalCache = result;
}

/**
 * Clear the cached optimal sequence result
 */
export function clearCachedOptimal(): void {
  optimalCache = null;
}
