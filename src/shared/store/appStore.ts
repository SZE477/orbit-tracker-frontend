import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
  language: string;
  autoRotateGlobe: boolean;
  showOrbitPaths: boolean;
  showSatelliteLabels: boolean;
  performanceMode: 'auto' | 'high' | 'medium' | 'low';
}

interface ViewState {
  selectedSatelliteId: number | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  globeRotation: [number, number, number];
  zoomLevel: number;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  panelsVisible: {
    satelliteList: boolean;
    satelliteDetail: boolean;
    passPrediction: boolean;
    settings: boolean;
  };
  modalsOpen: {
    auth: boolean;
    settings: boolean;
    about: boolean;
  };
  loading: {
    satellites: boolean;
    globe: boolean;
    passes: boolean;
  };
}

interface AppState {
  // User preferences
  preferences: UserPreferences;
  
  // View state
  view: ViewState;
  
  // UI state
  ui: UIState;
  
  // Actions
  setSelectedSatellite: (id: number | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateViewState: (viewState: Partial<ViewState>) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  togglePanel: (panel: keyof UIState['panelsVisible']) => void;
  openModal: (modal: keyof UIState['modalsOpen']) => void;
  closeModal: (modal: keyof UIState['modalsOpen']) => void;
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;
  resetView: () => void;
  resetPreferences: () => void;
}

// Default values
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  units: 'metric',
  language: 'en',
  autoRotateGlobe: false,
  showOrbitPaths: true,
  showSatelliteLabels: true,
  performanceMode: 'auto',
};

const defaultViewState: ViewState = {
  selectedSatelliteId: null,
  cameraPosition: [0, 0, 6],
  cameraTarget: [0, 0, 0],
  globeRotation: [0, 0, 0],
  zoomLevel: 1,
};

const defaultUIState: UIState = {
  sidebarOpen: true,
  sidebarWidth: 320,
  panelsVisible: {
    satelliteList: true,
    satelliteDetail: false,
    passPrediction: false,
    settings: false,
  },
  modalsOpen: {
    auth: false,
    settings: false,
    about: false,
  },
  loading: {
    satellites: false,
    globe: false,
    passes: false,
  },
};

// Create the store with middleware
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Initial state
          preferences: defaultPreferences,
          view: defaultViewState,
          ui: defaultUIState,

          // Actions
          setSelectedSatellite: (id) =>
            set((state) => {
              state.view.selectedSatelliteId = id;
              state.ui.panelsVisible.satelliteDetail = id !== null;
            }),

          updatePreferences: (newPreferences) =>
            set((state) => {
              Object.assign(state.preferences, newPreferences);
            }),

          updateViewState: (newViewState) =>
            set((state) => {
              Object.assign(state.view, newViewState);
            }),

          toggleSidebar: () =>
            set((state) => {
              state.ui.sidebarOpen = !state.ui.sidebarOpen;
            }),

          setSidebarWidth: (width) =>
            set((state) => {
              state.ui.sidebarWidth = Math.max(200, Math.min(600, width));
            }),

          togglePanel: (panel) =>
            set((state) => {
              state.ui.panelsVisible[panel] = !state.ui.panelsVisible[panel];
            }),

          openModal: (modal) =>
            set((state) => {
              state.ui.modalsOpen[modal] = true;
            }),

          closeModal: (modal) =>
            set((state) => {
              state.ui.modalsOpen[modal] = false;
            }),

          setLoading: (key, loading) =>
            set((state) => {
              state.ui.loading[key] = loading;
            }),

          resetView: () =>
            set((state) => {
              state.view = { ...defaultViewState };
            }),

          resetPreferences: () =>
            set((state) => {
              state.preferences = { ...defaultPreferences };
            }),
        }))
      ),
      {
        name: 'orbit-tracker-store',
        partialize: (state) => ({
          preferences: state.preferences,
          ui: {
            sidebarOpen: state.ui.sidebarOpen,
            sidebarWidth: state.ui.sidebarWidth,
            panelsVisible: state.ui.panelsVisible,
          },
        }),
      }
    ),
    {
      name: 'orbit-tracker',
    }
  )
);

// Selectors for better performance
export const useSelectedSatellite = () => useAppStore((state) => state.view.selectedSatelliteId);
export const usePreferences = () => useAppStore((state) => state.preferences);
export const useUIState = () => useAppStore((state) => state.ui);
export const useViewState = () => useAppStore((state) => state.view);

// Subscribe to changes for side effects
useAppStore.subscribe(
  (state) => state.preferences.theme,
  (theme) => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }
);

useAppStore.subscribe(
  (state) => state.view.selectedSatelliteId,
  (satelliteId) => {
    // Log satellite selection for analytics
    if (satelliteId) {
      console.log(`Satellite selected: ${satelliteId}`);
    }
  }
);
