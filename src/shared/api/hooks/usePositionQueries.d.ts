import type { PositionFilters } from '../types';
/**
 * Hook to fetch all positions with optional filtering
 * @param filters - Optional filters for positions
 * @returns React Query result with positions data
 */
export declare const usePositions: (filters?: PositionFilters) => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").Position>, Error>;
/**
 * Hook to fetch a specific position by ID
 * @param id - Position ID
 * @returns React Query result with position data
 */
export declare const usePosition: (id: number) => import("@tanstack/react-query").UseQueryResult<import("..").Position, Error>;
