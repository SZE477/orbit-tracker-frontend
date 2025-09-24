interface AppState {
    selectedSatellite: string | null;
    setSelectedSatellite: (id: string | null) => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export {};
