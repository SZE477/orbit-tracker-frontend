/**
 * Hook to fetch all categories
 * @returns React Query result with categories data
 */
export declare const useCategories: () => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").Category>, Error>;
/**
 * Hook to fetch a specific category by ID
 * @param id - Category ID
 * @returns React Query result with category data
 */
export declare const useCategory: (id: number) => import("@tanstack/react-query").UseQueryResult<import("..").Category, Error>;
