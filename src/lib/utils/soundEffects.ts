/**
 * Sound effects utility using Web Audio API
 */

// Audio context instance (lazy initialization)
let audioContext: AudioContext | null = null;

/**
 * Get or create audio context
 */
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      return null;
    }
  }

  return audioContext;
};

/**
 * Play a beep sound with specified frequency and duration
 *
 * @param frequency - Frequency in Hz (e.g., 440 for A4 note)
 * @param duration - Duration in milliseconds
 * @param volume - Volume level (0.0 to 1.0)
 */
const playBeep = (
  frequency: number,
  duration: number,
  volume: number = 0.3
): void => {
  const context = getAudioContext();
  if (!context) return;

  try {
    // Create oscillator for tone generation
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    // Configure volume with fade out
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      context.currentTime + duration / 1000
    );

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Play sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);
  } catch (error) {
    console.warn('Error playing beep:', error);
  }
};

/**
 * Check if sound is muted (from localStorage)
 */
const isMuted = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem('soundMuted');
    return stored === 'true';
  } catch {
    return false;
  }
};

/**
 * Set mute state in localStorage
 */
export const setMuted = (muted: boolean): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('soundMuted', String(muted));
  } catch (error) {
    console.warn('Failed to save mute setting:', error);
  }
};

/**
 * Get current mute state
 */
export const getMuted = (): boolean => {
  return isMuted();
};

/**
 * Play drop success sound (equipment placed)
 * Short, pleasant beep at middle frequency
 */
export const playDropSound = (): void => {
  if (isMuted()) return;
  playBeep(523, 100, 0.2); // C5 note, 100ms
};

/**
 * Play completion sound (all equipment placed)
 * Rising tone sequence
 */
export const playCompleteSound = (): void => {
  if (isMuted()) return;

  // Play a sequence of rising tones
  playBeep(523, 150, 0.2); // C5
  setTimeout(() => playBeep(659, 150, 0.2), 150); // E5
  setTimeout(() => playBeep(784, 200, 0.2), 300); // G5
};

/**
 * Play score display sound
 * Triumphant fanfare-like sound
 */
export const playScoreSound = (): void => {
  if (isMuted()) return;

  // Triumphant chord-like sequence
  playBeep(392, 120, 0.15); // G4
  setTimeout(() => playBeep(494, 120, 0.15), 50); // B4
  setTimeout(() => playBeep(587, 120, 0.15), 100); // D5
  setTimeout(() => playBeep(784, 250, 0.2), 150); // G5
};

/**
 * Play error sound (optional, for future use)
 * Low frequency, short duration
 */
export const playErrorSound = (): void => {
  if (isMuted()) return;
  playBeep(200, 200, 0.2); // Low beep
};

/**
 * Resume audio context if suspended (required on some browsers)
 * Call this on user interaction
 */
export const resumeAudioContext = (): void => {
  const context = getAudioContext();
  if (context && context.state === 'suspended') {
    context.resume().catch((error) => {
      console.warn('Failed to resume audio context:', error);
    });
  }
};
