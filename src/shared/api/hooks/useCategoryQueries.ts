import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { QueryKeys } from '../types';

// Category Query Hooks

/**
 * Hook to fetch all categories
 * @returns React Query result with categories data
 */
export const useCategories = () => {
  return useQuery({
    queryKey: QueryKeys.categories,
    queryFn: () => categoryService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};

/**
 * Hook to fetch a specific category by ID
 * @param id - Category ID
 * @returns React Query result with category data
 */
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: QueryKeys.category(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};