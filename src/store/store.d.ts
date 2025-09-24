interface AppState {
    drawerOpen: boolean;
    toggleDrawer: () => void;
}
export declare const useAppStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>;
export {};
