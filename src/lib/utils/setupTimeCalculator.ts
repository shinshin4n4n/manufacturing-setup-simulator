import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Optimal sequence result type
 */
export interface OptimalSequenceResult {
  sequence: string[];
  time: number;
}

/**
 * Rank type
 */
export type Rank = 'S' | 'A' | 'B' | 'C' | 'D';

/**
 * Calculate total setup time for a given equipment sequence
 *
 * @param sequence - Array of equipment codes in order (e.g., ["A", "B", "C", "D", "E"])
 * @returns Total setup time in minutes
 * @throws Error if sequence is invalid or database query fails
 *
 * @example
 * const time = await calculateTotalSetupTime(["A", "B", "C", "D", "E"]);
 * console.log(time); // e.g., 85
 */
export async function calculateTotalSetupTime(sequence: string[]): Promise<number> {
  // Validate input
  if (!sequence || sequence.length === 0) {
    return 0;
  }

  if (sequence.length === 1) {
    return 0; // No setup time needed for a single equipment
  }

  let totalTime = 0;

  // Calculate setup time for each transition
  for (let i = 0; i < sequence.length - 1; i++) {
    const fromCode = sequence[i];
    const toCode = sequence[i + 1];

    // Get equipment IDs from codes
    const fromEquipment = await prisma.equipment.findUnique({
      where: { code: fromCode },
    });

    const toEquipment = await prisma.equipment.findUnique({
      where: { code: toCode },
    });

    if (!fromEquipment || !toEquipment) {
      throw new Error(`Equipment not found: ${fromCode} or ${toCode}`);
    }

    // Get setup time from matrix
    const setupMatrix = await prisma.setupMatrix.findUnique({
      where: {
        fromEquipmentId_toEquipmentId: {
          fromEquipmentId: fromEquipment.id,
          toEquipmentId: toEquipment.id,
        },
      },
    });

    if (!setupMatrix) {
      throw new Error(`Setup time not found for transition: ${fromCode} -> ${toCode}`);
    }

    totalTime += setupMatrix.setupTime;
  }

  return totalTime;
}

/**
 * Generate all permutations of an array
 *
 * @param arr - Array to permute
 * @returns Array of all permutations
 */
function permute<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];

  const result: T[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingPermutations = permute(remaining);

    for (const perm of remainingPermutations) {
      result.push([current, ...perm]);
    }
  }

  return result;
}

/**
 * Find the optimal equipment sequence with minimum setup time
 * Uses brute force approach for 5 equipment (5! = 120 permutations)
 *
 * @returns Object containing optimal sequence and its total time
 * @throws Error if no equipment found or calculation fails
 *
 * @example
 * const result = await findOptimalSequence();
 * console.log(result); // { sequence: ["A", "C", "B", "E", "D"], time: 65 }
 */
export async function findOptimalSequence(): Promise<OptimalSequenceResult> {
  // Get all equipment
  const allEquipment = await prisma.equipment.findMany({
    orderBy: { code: 'asc' },
  });

  if (allEquipment.length === 0) {
    throw new Error('No equipment found in database');
  }

  const equipmentCodes = allEquipment.map((eq) => eq.code);

  // Generate all permutations
  const allPermutations = permute(equipmentCodes);

  let optimalSequence: string[] = [];
  let minTime = Infinity;

  // Try each permutation and find the one with minimum time
  for (const sequence of allPermutations) {
    try {
      const time = await calculateTotalSetupTime(sequence);

      if (time < minTime) {
        minTime = time;
        optimalSequence = sequence;
      }
    } catch (error) {
      // Skip invalid sequences
      console.error(`Error calculating time for sequence ${sequence}:`, error);
    }
  }

  if (optimalSequence.length === 0) {
    throw new Error('Failed to find optimal sequence');
  }

  return {
    sequence: optimalSequence,
    time: minTime,
  };
}

/**
 * Calculate score based on user's time vs optimal time
 *
 * @param userTime - User's total setup time in minutes
 * @param optimalTime - Optimal total setup time in minutes
 * @returns Score as percentage (0-100), capped at 100
 *
 * @example
 * const score = calculateScore(85, 65);
 * console.log(score); // 76.47
 */
export function calculateScore(userTime: number, optimalTime: number): number {
  // Validate input
  if (userTime <= 0 || optimalTime <= 0) {
    return 0;
  }

  // Calculate score as percentage
  // Score = (optimalTime / userTime) × 100
  const score = (optimalTime / userTime) * 100;

  // Cap at 100 (in case user matches or beats optimal due to rounding)
  return Math.min(Math.round(score * 100) / 100, 100);
}

/**
 * Determine rank based on score percentage
 *
 * Ranking system:
 * - S: 100% (perfect score)
 * - A: 95-99%
 * - B: 85-94%
 * - C: 75-84%
 * - D: Below 75%
 *
 * @param scorePercent - Score as percentage (0-100)
 * @returns Rank letter (S, A, B, C, or D)
 *
 * @example
 * getRank(100); // "S"
 * getRank(97);  // "A"
 * getRank(90);  // "B"
 * getRank(80);  // "C"
 * getRank(70);  // "D"
 */
export function getRank(scorePercent: number): Rank {
  if (scorePercent >= 100) {
    return 'S';
  } else if (scorePercent >= 95) {
    return 'A';
  } else if (scorePercent >= 85) {
    return 'B';
  } else if (scorePercent >= 75) {
    return 'C';
  } else {
    return 'D';
  }
}
