import type { SubscriptionFilters, SubscriptionCreate } from '../types';
/**
 * Hook to fetch all subscriptions with optional filtering
 * @param filters - Optional filters for subscriptions
 * @returns React Query result with subscriptions data
 */
export declare const useSubscriptions: (filters?: SubscriptionFilters) => import("@tanstack/react-query").UseQueryResult<import("..").PaginatedResponse<import("..").Subscription>, Error>;
/**
 * Hook to create a new subscription
 * @returns Mutation function and state for creating subscriptions
 */
export declare const useCreateSubscription: () => import("@tanstack/react-query").UseMutationResult<import("..").Subscription, Error, SubscriptionCreate, unknown>;
/**
 * Hook to delete a subscription
 * @returns Mutation function and state for deleting subscriptions
 */
export declare const useDeleteSubscription: () => import("@tanstack/react-query").UseMutationResult<void, Error, number, unknown>;
