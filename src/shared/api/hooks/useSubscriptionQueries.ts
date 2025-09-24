import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';
import { QueryKeys } from '../types';
import type { SubscriptionFilters, SubscriptionCreate } from '../types';

// Subscription Query Hooks

/**
 * Hook to fetch all subscriptions with optional filtering
 * @param filters - Optional filters for subscriptions
 * @returns React Query result with subscriptions data
 */
export const useSubscriptions = (filters?: SubscriptionFilters) => {
  return useQuery({
    queryKey: filters ? QueryKeys.subscriptionsFiltered(filters) : QueryKeys.subscriptions,
    queryFn: () => subscriptionService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Subscription Mutation Hooks

/**
 * Hook to create a new subscription
 * @returns Mutation function and state for creating subscriptions
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscriptionCreate) => subscriptionService.create(data),
    onSuccess: () => {
      // Invalidate subscriptions queries to refresh the list
      queryClient.invalidateQueries({ queryKey: QueryKeys.subscriptions });
    },
  });
};

/**
 * Hook to delete a subscription
 * @returns Mutation function and state for deleting subscriptions
 */
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscriptionService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QueryKeys.subscription(deletedId) });
      // Invalidate subscriptions list
      queryClient.invalidateQueries({ queryKey: QueryKeys.subscriptions });
    },
  });
};