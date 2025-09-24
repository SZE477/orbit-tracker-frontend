interface AppState {
    selectedSatelliteId: number | null;
    setSelectedSatelliteId: (id: number | null) => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export {};
