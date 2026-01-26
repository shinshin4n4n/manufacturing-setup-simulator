/**
 * Setup Time Optimizer - Held-Karp Algorithm Implementation
 * Optimizes the Traveling Salesman Problem (TSP) using Dynamic Programming
 *
 * Time Complexity: O(n² × 2ⁿ)
 * Space Complexity: O(n × 2ⁿ)
 *
 * This is significantly faster than brute force O(n!) for n > 10:
 * - n=10: 10! = 3,628,800 vs 10² × 2¹⁰ = 102,400 (35x faster)
 * - n=15: 15! = 1,307,674,368,000 vs 15² × 2¹⁵ = 7,372,800 (177,000x faster)
 */

/**
 * Setup matrix cache for in-memory calculations
 */
interface SetupMatrixCache {
  [fromCode: string]: {
    [toCode: string]: number;
  };
}

/**
 * Optimal sequence result type
 */
export interface OptimalSequenceResult {
  sequence: string[];
  time: number;
}

/**
 * DP state: dp[mask][last] = minimum time to visit cities in mask, ending at last
 */
interface DPState {
  [mask: number]: {
    [last: number]: {
      time: number;
      prev: number;
    };
  };
}

/**
 * Find optimal sequence using Held-Karp algorithm (Dynamic Programming)
 *
 * Algorithm:
 * 1. Use bitmask to represent visited set of equipment
 * 2. dp[mask][i] = minimum time to visit equipment in mask, ending at i
 * 3. Transition: dp[mask | (1<<j)][j] = min(dp[mask][i] + time[i][j])
 * 4. Reconstruct path from DP table
 *
 * @param equipmentCodes - Array of equipment codes to optimize
 * @param cache - Setup time matrix cache
 * @returns Optimal sequence and total time
 */
export function findOptimalSequenceDP(
  equipmentCodes: string[],
  cache: SetupMatrixCache
): OptimalSequenceResult {
  const n = equipmentCodes.length;

  // Edge cases
  if (n === 0) {
    return { sequence: [], time: 0 };
  }
  if (n === 1) {
    return { sequence: equipmentCodes, time: 0 };
  }

  // Initialize DP table
  const dp: DPState = {};

  // Start from equipment 0 (arbitrary starting point)
  // mask = 1 means only equipment 0 is visited
  const startMask = 1 << 0;
  dp[startMask] = {};
  dp[startMask][0] = { time: 0, prev: -1 };

  // Fill DP table
  // Iterate through all possible masks (subsets of equipment)
  for (let mask = 1; mask < (1 << n); mask++) {
    if (!dp[mask]) continue;

    // For each equipment in current mask
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue; // last must be in mask
      if (!dp[mask][last]) continue;

      const currentTime = dp[mask][last].time;

      // Try adding each unvisited equipment
      for (let next = 0; next < n; next++) {
        if (mask & (1 << next)) continue; // next must not be in mask

        const fromCode = equipmentCodes[last];
        const toCode = equipmentCodes[next];

        // Get setup time from cache
        if (!cache[fromCode] || cache[fromCode][toCode] === undefined) {
          throw new Error(`Setup time not found for transition: ${fromCode} -> ${toCode}`);
        }

        const setupTime = cache[fromCode][toCode];
        const newMask = mask | (1 << next);
        const newTime = currentTime + setupTime;

        // Update DP table if this is better
        if (!dp[newMask]) {
          dp[newMask] = {};
        }
        if (!dp[newMask][next] || dp[newMask][next].time > newTime) {
          dp[newMask][next] = {
            time: newTime,
            prev: last,
          };
        }
      }
    }
  }

  // Find the best ending position (all equipment visited)
  const fullMask = (1 << n) - 1;
  let minTime = Infinity;
  let bestLast = -1;

  for (let last = 0; last < n; last++) {
    if (dp[fullMask] && dp[fullMask][last]) {
      if (dp[fullMask][last].time < minTime) {
        minTime = dp[fullMask][last].time;
        bestLast = last;
      }
    }
  }

  if (bestLast === -1) {
    throw new Error('Failed to find optimal sequence');
  }

  // Reconstruct path
  const sequence: number[] = [];
  let currentMask = fullMask;
  let currentPos = bestLast;

  while (currentPos !== -1) {
    sequence.push(currentPos);
    const prev = dp[currentMask][currentPos].prev;

    if (prev !== -1) {
      currentMask ^= (1 << currentPos); // Remove currentPos from mask
    }

    currentPos = prev;
  }

  sequence.reverse();

  // Convert indices back to equipment codes
  const optimalSequence = sequence.map(idx => equipmentCodes[idx]);

  return {
    sequence: optimalSequence,
    time: minTime,
  };
}

/**
 * Calculate total setup time using in-memory cache (fast)
 */
export function calculateTotalSetupTimeFromCache(
  sequence: string[],
  cache: SetupMatrixCache
): number {
  if (!sequence || sequence.length <= 1) {
    return 0;
  }

  let totalTime = 0;

  for (let i = 0; i < sequence.length - 1; i++) {
    const fromCode = sequence[i];
    const toCode = sequence[i + 1];

    if (!cache[fromCode] || cache[fromCode][toCode] === undefined) {
      throw new Error(`Setup time not found for transition: ${fromCode} -> ${toCode}`);
    }

    totalTime += cache[fromCode][toCode];
  }

  return totalTime;
}
