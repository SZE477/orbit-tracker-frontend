import { useQuery } from '@tanstack/react-query';
import { positionService } from '../services/positionService';
import { QueryKeys } from '../types';
import type { PositionFilters } from '../types';

// Position Query Hooks

/**
 * Hook to fetch all positions with optional filtering
 * @param filters - Optional filters for positions
 * @returns React Query result with positions data
 */
export const usePositions = (filters?: PositionFilters) => {
  return useQuery({
    queryKey: filters ? QueryKeys.positionsFiltered(filters) : QueryKeys.positions,
    queryFn: () => positionService.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for live positions
  });
};

/**
 * Hook to fetch a specific position by ID
 * @param id - Position ID
 * @returns React Query result with position data
 */
export const usePosition = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.position(id),
    queryFn: () => positionService.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};