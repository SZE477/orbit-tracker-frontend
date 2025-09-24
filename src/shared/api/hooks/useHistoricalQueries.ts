import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { historicalService } from '../services/historicalService';
import { QueryKeys } from '../types';
import type { HistoricalQueryFilters, HistoricalQueryCreate } from '../types';

// Historical Query Hooks

/**
 * Hook to fetch all historical queries with optional filtering
 * @param filters - Optional filters for historical queries
 * @returns React Query result with historical queries data
 */
export const useHistoricalQueries = (filters?: HistoricalQueryFilters) => {
  return useQuery({
    queryKey: filters ? QueryKeys.historicalQueriesFiltered(filters) : QueryKeys.historicalQueries,
    queryFn: () => historicalService.getAllQueries(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific historical query by ID
 * @param id - Historical query ID
 * @returns React Query result with historical query data
 */
export const useHistoricalQuery = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.historicalQuery(id),
    queryFn: () => historicalService.getQueryById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: (query) => {
      // Refetch every 5 seconds if query is still processing
      const data = query.state.data;
      if (data?.status === 'processing' || data?.status === 'pending') {
        return 5 * 1000;
      }
      return false;
    },
  });
};

// Historical Query Mutation Hooks

/**
 * Hook to create a new historical query
 * @returns Mutation function and state for creating historical queries
 */
export const useCreateHistoricalQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HistoricalQueryCreate) => historicalService.createQuery(data),
    onSuccess: (newQuery) => {
      // Add to cache and invalidate queries list
      queryClient.setQueryData(QueryKeys.historicalQuery(newQuery.id), newQuery);
      queryClient.invalidateQueries({ queryKey: QueryKeys.historicalQueries });
    },
  });
};