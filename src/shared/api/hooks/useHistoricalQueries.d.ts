import type { HistoricalQueryFilters, HistoricalQueryCreate } from '../types';
/**
 * Hook to fetch all historical queries with optional filtering
 * @param filters - Optional filters for historical queries
 * @returns React Query result with historical queries data
 */
export declare const useHistoricalQueries: (filters?: HistoricalQueryFilters) => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").HistoricalQuery>, Error>;
/**
 * Hook to fetch a specific historical query by ID
 * @param id - Historical query ID
 * @returns React Query result with historical query data
 */
export declare const useHistoricalQuery: (id: number) => import("@tanstack/react-query").UseQueryResult<import("..").HistoricalQuery, Error>;
/**
 * Hook to create a new historical query
 * @returns Mutation function and state for creating historical queries
 */
export declare const useCreateHistoricalQuery: () => import("@tanstack/react-query").UseMutationResult<import("..").HistoricalQuery, Error, HistoricalQueryCreate, unknown>;
