import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { satelliteService } from '../services/satelliteService';
import { QueryKeys } from '../types';
import type { 
  SatelliteFilters,
  SatelliteCreate,
  SatelliteUpdate,
  PositionFilters 
} from '../types';

// Satellite Query Hooks

/**
 * Hook to fetch all satellites with optional filtering
 * @param filters - Optional filters for satellites
 * @returns React Query result with satellites data
 */
export const useSatellites = (filters?: SatelliteFilters) => {
  return useQuery({
    queryKey: filters ? QueryKeys.satellitesFiltered(filters) : QueryKeys.satellites,
    queryFn: () => satelliteService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific satellite by ID
 * @param id - Satellite ID
 * @returns React Query result with satellite data
 */
export const useSatellite = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.satellite(id),
    queryFn: () => satelliteService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch satellite positions
 * @param id - Satellite ID
 * @param filters - Optional position filters
 * @returns React Query result with satellite positions
 */
export const useSatellitePositions = (id: number, filters?: PositionFilters) => {
  return useQuery({
    queryKey: QueryKeys.satellitePositions(id),
    queryFn: () => satelliteService.getPositions(id, filters),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch satellite TLE data
 * @param id - Satellite ID
 * @returns React Query result with TLE data
 */
export const useSatelliteTle = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.satelliteTle(id),
    queryFn: () => satelliteService.getTle(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Satellite Mutation Hooks

/**
 * Hook to create a new satellite
 * @returns Mutation function and state for creating satellites
 */
export const useCreateSatellite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SatelliteCreate) => satelliteService.create(data),
    onSuccess: () => {
      // Invalidate satellites queries to refresh the list
      queryClient.invalidateQueries({ queryKey: QueryKeys.satellites });
    },
  });
};

/**
 * Hook to update a satellite (full update)
 * @returns Mutation function and state for updating satellites
 */
export const useUpdateSatellite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SatelliteUpdate }) =>
      satelliteService.update(id, data),
    onSuccess: (updatedSatellite) => {
      // Update the specific satellite in cache
      queryClient.setQueryData(QueryKeys.satellite(updatedSatellite.id), updatedSatellite);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.satellites });
    },
  });
};

/**
 * Hook to partially update a satellite
 * @returns Mutation function and state for partial satellite updates
 */
export const usePartialUpdateSatellite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SatelliteUpdate> }) =>
      satelliteService.partialUpdate(id, data),
    onSuccess: (updatedSatellite) => {
      // Update the specific satellite in cache
      queryClient.setQueryData(QueryKeys.satellite(updatedSatellite.id), updatedSatellite);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.satellites });
    },
  });
};

/**
 * Hook to delete a satellite
 * @returns Mutation function and state for deleting satellites
 */
export const useDeleteSatellite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => satelliteService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QueryKeys.satellite(deletedId) });
      queryClient.removeQueries({ queryKey: QueryKeys.satellitePositions(deletedId) });
      queryClient.removeQueries({ queryKey: QueryKeys.satelliteTle(deletedId) });
      // Invalidate satellites list
      queryClient.invalidateQueries({ queryKey: QueryKeys.satellites });
    },
  });
};