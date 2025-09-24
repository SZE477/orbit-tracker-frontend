import { QueryClient } from '@tanstack/react-query';
/**
 * Create and configure the QueryClient with optimal defaults for the Orbit Tracker API
 */
export declare const createQueryClient: () => QueryClient;
/**
 * Singleton instance of QueryClient for the application
 */
export declare const queryClient: QueryClient;
/**
 * Query key factory for consistent cache management
 * This ensures all query keys follow a consistent pattern
 */
export declare const createQueryKey: {
    all: readonly ["orbit-tracker"];
    categories: () => readonly ["orbit-tracker", "categories"];
    category: (id: number) => readonly ["orbit-tracker", "categories", number];
    satellites: () => readonly ["orbit-tracker", "satellites"];
    satellite: (id: number) => readonly ["orbit-tracker", "satellites", number];
    satellitePositions: (id: number) => readonly ["orbit-tracker", "satellites", number, "positions"];
    satelliteTle: (id: number) => readonly ["orbit-tracker", "satellites", number, "tle"];
    positions: () => readonly ["orbit-tracker", "positions"];
    position: (id: number) => readonly ["orbit-tracker", "positions", number];
    favorites: () => readonly ["orbit-tracker", "favorites"];
    favorite: (id: number) => readonly ["orbit-tracker", "favorites", number];
    historical: () => readonly ["orbit-tracker", "historical"];
    historicalQuery: (id: number) => readonly ["orbit-tracker", "historical", "query", number];
    subscriptions: () => readonly ["orbit-tracker", "subscriptions"];
    subscription: (id: number) => readonly ["orbit-tracker", "subscriptions", number];
};
export declare const queryUtils: {
    /**
     * Invalidate all queries for a specific satellite
     */
    invalidateSatellite: (id: number) => void;
    /**
     * Remove all cached data for a satellite
     */
    removeSatellite: (id: number) => void;
    /**
     * Prefetch a satellite's data
     */
    prefetchSatellite: (id: number) => Promise<void>;
    /**
     * Clear all cached data
     */
    clearCache: () => void;
    /**
     * Get cached satellite data without triggering a request
     */
    getCachedSatellite: (id: number) => unknown;
};
