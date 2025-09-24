import { create } from 'zustand';

interface AppState {
  selectedSatelliteId: number | null;
  setSelectedSatelliteId: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedSatelliteId: null,
  setSelectedSatelliteId: (id: number | null) => set({ selectedSatelliteId: id }),
}));