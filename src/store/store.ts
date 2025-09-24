import { create } from 'zustand';

interface AppState {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  drawerOpen: false,
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
}));