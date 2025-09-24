import type { FavoriteCreate } from '../types';
/**
 * Hook to fetch all user favorites
 * @returns React Query result with favorites data
 */
export declare const useFavorites: () => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").Favorite>, Error>;
/**
 * Hook to fetch a specific favorite by ID
 * @param id - Favorite ID
 * @returns React Query result with favorite data
 */
export declare const useFavorite: (id: number) => import("@tanstack/react-query").UseQueryResult<import("..").Favorite, Error>;
/**
 * Hook to add a satellite to favorites
 * @returns Mutation function and state for adding favorites
 */
export declare const useAddFavorite: () => import("@tanstack/react-query").UseMutationResult<import("..").Favorite, Error, FavoriteCreate, unknown>;
/**
 * Hook to remove a satellite from favorites
 * @returns Mutation function and state for removing favorites
 */
export declare const useRemoveFavorite: () => import("@tanstack/react-query").UseMutationResult<void, Error, number, unknown>;
