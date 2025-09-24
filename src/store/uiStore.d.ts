interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
}
export declare const useSidebarStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SidebarState>>;
export {};
