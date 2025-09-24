import type { SatelliteFilters, SatelliteCreate, SatelliteUpdate, PositionFilters } from '../types';
/**
 * Hook to fetch all satellites with optional filtering
 * @param filters - Optional filters for satellites
 * @returns React Query result with satellites data
 */
export declare const useSatellites: (filters?: SatelliteFilters) => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").Satellite>, Error>;
/**
 * Hook to fetch a specific satellite by ID
 * @param id - Satellite ID
 * @returns React Query result with satellite data
 */
export declare const useSatellite: (id: number) => import("@tanstack/react-query").UseQueryResult<import("..").Satellite, Error>;
/**
 * Hook to fetch satellite positions
 * @param id - Satellite ID
 * @param filters - Optional position filters
 * @returns React Query result with satellite positions
 */
export declare const useSatellitePositions: (id: number, filters?: PositionFilters) => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").Position>, Error>;
/**
 * Hook to fetch satellite TLE data
 * @param id - Satellite ID
 * @returns React Query result with TLE data
 */
export declare const useSatelliteTle: (id: number) => import("@tanstack/react-query").UseQueryResult<import("..").TLE, Error>;
/**
 * Hook to create a new satellite
 * @returns Mutation function and state for creating satellites
 */
export declare const useCreateSatellite: () => import("@tanstack/react-query").UseMutationResult<import("..").Satellite, Error, SatelliteCreate, unknown>;
/**
 * Hook to update a satellite (full update)
 * @returns Mutation function and state for updating satellites
 */
export declare const useUpdateSatellite: () => import("@tanstack/react-query").UseMutationResult<import("..").Satellite, Error, {
    id: number;
    data: SatelliteUpdate;
}, unknown>;
/**
 * Hook to partially update a satellite
 * @returns Mutation function and state for partial satellite updates
 */
export declare const usePartialUpdateSatellite: () => import("@tanstack/react-query").UseMutationResult<import("..").Satellite, Error, {
    id: number;
    data: Partial<SatelliteUpdate>;
}, unknown>;
/**
 * Hook to delete a satellite
 * @returns Mutation function and state for deleting satellites
 */
export declare const useDeleteSatellite: () => import("@tanstack/react-query").UseMutationResult<void, Error, number, unknown>;
