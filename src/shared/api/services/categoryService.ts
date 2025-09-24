import { apiGet } from '../apiClient';
import type { Category, PaginatedResponse } from '../types';

// Categories API Service
export const categoryService = {
  // GET /api/categories/ - List all satellite categories
  getAll: async (): Promise<PaginatedResponse<Category>> => {
    return apiGet<PaginatedResponse<Category>>('/categories/');
  },

  // GET /api/categories/{id}/ - Retrieve a specific satellite category
  getById: async (id: number): Promise<Category> => {
    return apiGet<Category>(`/categories/${id}/`);
  },
};