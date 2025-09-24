import { QueryClient } from '@tanstack/react-query';
import type { APIError } from './types';

// Default query options
const DEFAULT_QUERY_OPTIONS = {
  // Stale time - how long data is considered fresh
  staleTime: 5 * 60 * 1000, // 5 minutes
  
  // Cache time (now gcTime) - how long unused data stays in cache
  gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  
  // Retry configuration
  retry: (failureCount: number, error: Error) => {
    // Don't retry on client errors (4xx) if it's an APIError
    const apiError = error as unknown as APIError;
    if (apiError.code && apiError.code.startsWith('4')) {
      return false;
    }
    
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
  
  // Retry delay - exponential backoff
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  
  // Don't refetch on window focus by default
  refetchOnWindowFocus: false,
  
  // Refetch on reconnect
  refetchOnReconnect: 'always' as const,
  
  // Refetch on mount if data is stale
  refetchOnMount: true,
};

const DEFAULT_MUTATION_OPTIONS = {
  // Retry mutations once for network errors
  retry: (failureCount: number, error: Error) => {
    const apiError = error as unknown as APIError;
    if (apiError.code === 'NETWORK_ERROR' && failureCount === 0) {
      return true;
    }
    return false;
  },
  
  // Retry delay for mutations
  retryDelay: 1000,
};

/**
 * Create and configure the QueryClient with optimal defaults for the Orbit Tracker API
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: DEFAULT_QUERY_OPTIONS,
      mutations: DEFAULT_MUTATION_OPTIONS,
    },
  });
};

/**
 * Singleton instance of QueryClient for the application
 */
export const queryClient = createQueryClient();

/**
 * Query key factory for consistent cache management
 * This ensures all query keys follow a consistent pattern
 */
export const createQueryKey = {
  all: ['orbit-tracker'] as const,
  categories: () => [...createQueryKey.all, 'categories'] as const,
  category: (id: number) => [...createQueryKey.categories(), id] as const,
  
  satellites: () => [...createQueryKey.all, 'satellites'] as const,
  satellite: (id: number) => [...createQueryKey.satellites(), id] as const,
  satellitePositions: (id: number) => [...createQueryKey.satellite(id), 'positions'] as const,
  satelliteTle: (id: number) => [...createQueryKey.satellite(id), 'tle'] as const,
  
  positions: () => [...createQueryKey.all, 'positions'] as const,
  position: (id: number) => [...createQueryKey.positions(), id] as const,
  
  favorites: () => [...createQueryKey.all, 'favorites'] as const,
  favorite: (id: number) => [...createQueryKey.favorites(), id] as const,
  
  historical: () => [...createQueryKey.all, 'historical'] as const,
  historicalQuery: (id: number) => [...createQueryKey.historical(), 'query', id] as const,
  
  subscriptions: () => [...createQueryKey.all, 'subscriptions'] as const,
  subscription: (id: number) => [...createQueryKey.subscriptions(), id] as const,
};

// Helper functions for common query operations
export const queryUtils = {
  /**
   * Invalidate all queries for a specific satellite
   */
  invalidateSatellite: (id: number) => {
    queryClient.invalidateQueries({ queryKey: createQueryKey.satellite(id) });
  },
  
  /**
   * Remove all cached data for a satellite
   */
  removeSatellite: (id: number) => {
    queryClient.removeQueries({ queryKey: createQueryKey.satellite(id) });
  },
  
  /**
   * Prefetch a satellite's data
   */
  prefetchSatellite: async (id: number) => {
    const { satelliteService } = await import('./services/satelliteService');
    
    return queryClient.prefetchQuery({
      queryKey: createQueryKey.satellite(id),
      queryFn: () => satelliteService.getById(id),
      staleTime: DEFAULT_QUERY_OPTIONS.staleTime,
    });
  },
  
  /**
   * Clear all cached data
   */
  clearCache: () => {
    queryClient.clear();
  },
  
  /**
   * Get cached satellite data without triggering a request
   */
  getCachedSatellite: (id: number) => {
    return queryClient.getQueryData(createQueryKey.satellite(id));
  },
};