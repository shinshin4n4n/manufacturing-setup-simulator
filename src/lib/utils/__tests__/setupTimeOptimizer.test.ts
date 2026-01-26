/**
 * Tests for Setup Time Optimizer (Held-Karp Algorithm)
 */

import { findOptimalSequenceDP, calculateTotalSetupTimeFromCache } from '../setupTimeOptimizer';

describe('Setup Time Optimizer', () => {
  // Sample setup matrix cache for testing
  const createTestCache = () => ({
    A: { B: 10, C: 15, D: 20 },
    B: { A: 10, C: 35, D: 25 },
    C: { A: 15, B: 35, D: 30 },
    D: { A: 20, B: 25, C: 30 },
  });

  describe('calculateTotalSetupTimeFromCache', () => {
    const cache = createTestCache();

    test('should return 0 for empty sequence', () => {
      expect(calculateTotalSetupTimeFromCache([], cache)).toBe(0);
    });

    test('should return 0 for single equipment', () => {
      expect(calculateTotalSetupTimeFromCache(['A'], cache)).toBe(0);
    });

    test('should calculate correct time for 2 equipment', () => {
      expect(calculateTotalSetupTimeFromCache(['A', 'B'], cache)).toBe(10);
      expect(calculateTotalSetupTimeFromCache(['B', 'A'], cache)).toBe(10);
    });

    test('should calculate correct time for sequence A->B->C', () => {
      const time = calculateTotalSetupTimeFromCache(['A', 'B', 'C'], cache);
      expect(time).toBe(10 + 35); // A->B(10) + B->C(35) = 45
    });

    test('should calculate correct time for sequence A->C->B->D', () => {
      const time = calculateTotalSetupTimeFromCache(['A', 'C', 'B', 'D'], cache);
      expect(time).toBe(15 + 35 + 25); // A->C(15) + C->B(35) + B->D(25) = 75
    });

    test('should throw error for missing transition', () => {
      expect(() => {
        calculateTotalSetupTimeFromCache(['A', 'E'], cache);
      }).toThrow('Setup time not found');
    });
  });

  describe('findOptimalSequenceDP', () => {
    const cache = createTestCache();

    test('should handle empty equipment list', () => {
      const result = findOptimalSequenceDP([], cache);
      expect(result.sequence).toEqual([]);
      expect(result.time).toBe(0);
    });

    test('should handle single equipment', () => {
      const result = findOptimalSequenceDP(['A'], cache);
      expect(result.sequence).toEqual(['A']);
      expect(result.time).toBe(0);
    });

    test('should find optimal sequence for 2 equipment', () => {
      const result = findOptimalSequenceDP(['A', 'B'], cache);
      expect(result.time).toBe(10); // A->B or B->A both cost 10
      expect(result.sequence.length).toBe(2);
    });

    test('should find optimal sequence for 4 equipment', () => {
      const equipmentCodes = ['A', 'B', 'C', 'D'];
      const result = findOptimalSequenceDP(equipmentCodes, cache);

      // Verify result structure
      expect(result.sequence).toHaveLength(4);
      expect(result.time).toBeGreaterThan(0);

      // Verify all equipment are included
      expect(new Set(result.sequence)).toEqual(new Set(equipmentCodes));

      // Verify time calculation is correct
      const calculatedTime = calculateTotalSetupTimeFromCache(result.sequence, cache);
      expect(result.time).toBe(calculatedTime);

      // The optimal should be A->B->D->C or similar (total: 10+25+30=65)
      // or A->D->B->C (total: 20+25+35=80)
      // or other combinations, but should find minimum
      expect(result.time).toBeLessThanOrEqual(80);
    });

    test('should throw error for invalid transitions', () => {
      const invalidCache = {
        A: { B: 10 },
        B: {},
      };

      expect(() => {
        findOptimalSequenceDP(['A', 'B', 'C'], invalidCache);
      }).toThrow('Setup time not found');
    });
  });

  describe('Algorithm Correctness - Compare with Brute Force', () => {
    // Brute force implementation for testing
    function findOptimalBruteForce(
      equipmentCodes: string[],
      cache: Record<string, Record<string, number>>
    ) {
      if (equipmentCodes.length === 0) return { sequence: [], time: 0 };
      if (equipmentCodes.length === 1) return { sequence: equipmentCodes, time: 0 };

      const permute = <T,>(arr: T[]): T[][] => {
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
      };

      const allPermutations = permute(equipmentCodes);
      let minTime = Infinity;
      let bestSequence: string[] = [];

      for (const seq of allPermutations) {
        const time = calculateTotalSetupTimeFromCache(seq, cache);
        if (time < minTime) {
          minTime = time;
          bestSequence = seq;
        }
      }

      return { sequence: bestSequence, time: minTime };
    }

    test('DP should match brute force for 3 equipment', () => {
      const cache = createTestCache();
      const equipmentCodes = ['A', 'B', 'C'];

      const dpResult = findOptimalSequenceDP(equipmentCodes, cache);
      const bruteForceResult = findOptimalBruteForce(equipmentCodes, cache);

      expect(dpResult.time).toBe(bruteForceResult.time);
    });

    test('DP should match brute force for 4 equipment', () => {
      const cache = createTestCache();
      const equipmentCodes = ['A', 'B', 'C', 'D'];

      const dpResult = findOptimalSequenceDP(equipmentCodes, cache);
      const bruteForceResult = findOptimalBruteForce(equipmentCodes, cache);

      expect(dpResult.time).toBe(bruteForceResult.time);
    });
  });

  describe('Performance Benchmark', () => {
    // Create larger test cache
    const createLargeCache = (n: number) => {
      const cache: Record<string, Record<string, number>> = {};
      const codes = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, ...

      for (const from of codes) {
        cache[from] = {};
        for (const to of codes) {
          if (from !== to) {
            // Random setup time between 10 and 50
            cache[from][to] = Math.floor(Math.random() * 40) + 10;
          }
        }
      }

      return cache;
    };

    test('should complete in reasonable time for 8 equipment', () => {
      const cache = createLargeCache(8);
      const equipmentCodes = Array.from({ length: 8 }, (_, i) => String.fromCharCode(65 + i));

      const startTime = Date.now();
      const result = findOptimalSequenceDP(equipmentCodes, cache);
      const elapsed = Date.now() - startTime;

      console.log(`8 equipment: ${elapsed}ms`);

      expect(result.sequence).toHaveLength(8);
      expect(elapsed).toBeLessThan(1000); // Should complete in less than 1 second
    });

    test('should complete in reasonable time for 10 equipment', () => {
      const cache = createLargeCache(10);
      const equipmentCodes = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));

      const startTime = Date.now();
      const result = findOptimalSequenceDP(equipmentCodes, cache);
      const elapsed = Date.now() - startTime;

      console.log(`10 equipment: ${elapsed}ms`);

      expect(result.sequence).toHaveLength(10);
      expect(elapsed).toBeLessThan(1000); // Should complete in less than 1 second
    });

    test('should complete in reasonable time for 12 equipment', () => {
      const cache = createLargeCache(12);
      const equipmentCodes = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));

      const startTime = Date.now();
      const result = findOptimalSequenceDP(equipmentCodes, cache);
      const elapsed = Date.now() - startTime;

      console.log(`12 equipment: ${elapsed}ms`);

      expect(result.sequence).toHaveLength(12);
      expect(elapsed).toBeLessThan(2000); // Should complete in less than 2 seconds
    });
  });
});
