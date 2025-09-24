import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Satellite } from '@/shared/api/types';

interface SelectionState {
  selectedSatellites: Satellite[];
  addSatellite: (satellite: Satellite) => void;
  removeSatellite: (noradId: number) => void;
  clearSelection: () => void;
  toggleSatellite: (satellite: Satellite) => void;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      selectedSatellites: [],
      addSatellite: (satellite) =>
        set((state) => ({
          selectedSatellites: [...state.selectedSatellites, satellite],
        })),
      removeSatellite: (noradId) =>
        set((state) => ({
          selectedSatellites: state.selectedSatellites.filter((s) => s.norad_id !== noradId),
        })),
      clearSelection: () => set({ selectedSatellites: [] }),
      toggleSatellite: (satellite) => {
        const isSelected = get().selectedSatellites.some((s) => s.norad_id === satellite.norad_id);
        if (isSelected) {
          get().removeSatellite(satellite.norad_id);
        } else {
          get().addSatellite(satellite);
        }
      },
    }),
    {
      name: 'satellite-selection-storage',
    },
  ),
);