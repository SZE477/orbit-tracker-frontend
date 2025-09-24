import { apiGet, apiPost, apiDelete } from '../apiClient';
import type { Favorite, FavoriteCreate, PaginatedResponse } from '../types';

// Favorites API Service
export const favoriteService = {
  // GET /api/favorites/ - List the current user's favorite satellites
  getAll: async (): Promise<PaginatedResponse<Favorite>> => {
    return apiGet<PaginatedResponse<Favorite>>('/favorites/');
  },

  // POST /api/favorites/ - Add a satellite to the user's favorites
  create: async (data: FavoriteCreate): Promise<Favorite> => {
    return apiPost<Favorite>('/favorites/', data);
  },

  // GET /api/favorites/{id}/ - Retrieve a specific favorite entry
  getById: async (id: number): Promise<Favorite> => {
    return apiGet<Favorite>(`/favorites/${id}/`);
  },

  // DELETE /api/favorites/{id}/ - Remove a satellite from the user's favorites
  delete: async (id: number): Promise<void> => {
    return apiDelete<void>(`/favorites/${id}/`);
  },
};