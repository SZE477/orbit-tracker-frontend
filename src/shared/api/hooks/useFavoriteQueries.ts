import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import { QueryKeys } from '../types';
import type { FavoriteCreate } from '../types';

// Favorite Query Hooks

/**
 * Hook to fetch all user favorites
 * @returns React Query result with favorites data
 */
export const useFavorites = () => {
  return useQuery({
    queryKey: QueryKeys.favorites,
    queryFn: () => favoriteService.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific favorite by ID
 * @param id - Favorite ID
 * @returns React Query result with favorite data
 */
export const useFavorite = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.favorite(id),
    queryFn: () => favoriteService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Favorite Mutation Hooks

/**
 * Hook to add a satellite to favorites
 * @returns Mutation function and state for adding favorites
 */
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FavoriteCreate) => favoriteService.create(data),
    onSuccess: () => {
      // Invalidate favorites queries to refresh the list
      queryClient.invalidateQueries({ queryKey: QueryKeys.favorites });
    },
  });
};

/**
 * Hook to remove a satellite from favorites
 * @returns Mutation function and state for removing favorites
 */
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => favoriteService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QueryKeys.favorite(deletedId) });
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: QueryKeys.favorites });
    },
  });
};