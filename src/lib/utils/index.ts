export {
  calculateTotalSetupTime,
  findOptimalSequence,
  calculateScore,
  getRank,
} from './setupTimeCalculator';

export type { OptimalSequenceResult, Rank } from './setupTimeCalculator';

export {
  getCachedOptimal,
  setCachedOptimal,
  clearCachedOptimal,
} from './optimalCache';

export {
  playDropSound,
  playCompleteSound,
  playScoreSound,
  playErrorSound,
  getMuted,
  setMuted,
  resumeAudioContext,
} from './soundEffects';
