import { create } from 'zustand';
import type { Equipment } from '@/components/game';
import { getMuted, setMuted as setSoundMuted } from '@/lib/utils';

export type GameState = 'idle' | 'loading' | 'playing' | 'finished';

interface PlacedEquipment {
  equipment: Equipment;
  position: number;
}

interface GameStore {
  // State
  gameState: GameState;
  sessionId: string | null;
  equipments: Equipment[];
  placedSequence: PlacedEquipment[];
  totalTime: number;
  optimalTime: number;
  optimalSequence: string[];
  hintsUsed: number;
  timerStartTime: number | null;
  isMuted: boolean;

  // Actions
  setGameState: (state: GameState) => void;
  setSessionId: (id: string) => void;
  setEquipments: (equipments: Equipment[]) => void;
  setOptimalData: (time: number, sequence: string[]) => void;
  addPlacedEquipment: (equipment: Equipment, position: number) => void;
  removePlacedEquipment: (equipmentId: string) => void;
  setTotalTime: (time: number) => void;
  addHintUsage: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  toggleMute: () => void;
  resetGame: () => void;
}

const initialState = {
  gameState: 'idle' as GameState,
  sessionId: null,
  equipments: [],
  placedSequence: [],
  totalTime: 0,
  optimalTime: 0,
  optimalSequence: [],
  hintsUsed: 0,
  timerStartTime: null,
  isMuted: typeof window !== 'undefined' ? getMuted() : false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setGameState: (state) => set({ gameState: state }),

  setSessionId: (id) => set({ sessionId: id }),

  setEquipments: (equipments) => set({ equipments }),

  setOptimalData: (time, sequence) =>
    set({ optimalTime: time, optimalSequence: sequence }),

  addPlacedEquipment: (equipment, position) =>
    set((state) => ({
      placedSequence: [...state.placedSequence, { equipment, position }],
    })),

  removePlacedEquipment: (equipmentId) =>
    set((state) => ({
      placedSequence: state.placedSequence
        .filter((pe) => pe.equipment.id !== equipmentId)
        .map((pe, index) => ({ ...pe, position: index })),
    })),

  setTotalTime: (time) => set({ totalTime: time }),

  addHintUsage: () =>
    set((state) => ({ hintsUsed: state.hintsUsed + 1 })),

  startTimer: () => set({ timerStartTime: Date.now() }),

  stopTimer: () => set({ timerStartTime: null }),

  toggleMute: () =>
    set((state) => {
      const newMuted = !state.isMuted;
      setSoundMuted(newMuted);
      return { isMuted: newMuted };
    }),

  resetGame: () => set({
    ...initialState,
    isMuted: typeof window !== 'undefined' ? getMuted() : false,
  }),
}));
