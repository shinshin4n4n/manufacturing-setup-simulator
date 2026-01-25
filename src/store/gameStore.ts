import { create } from 'zustand';
import type { Equipment } from '@/components/game';

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

  // Actions
  setGameState: (state: GameState) => void;
  setSessionId: (id: string) => void;
  setEquipments: (equipments: Equipment[]) => void;
  setOptimalData: (time: number, sequence: string[]) => void;
  addPlacedEquipment: (equipment: Equipment, position: number) => void;
  removePlacedEquipment: (equipmentId: string) => void;
  setTotalTime: (time: number) => void;
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

  resetGame: () => set(initialState),
}));
