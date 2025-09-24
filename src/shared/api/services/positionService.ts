import { apiGet } from '../apiClient';
import type { Position, PositionFilters, PaginatedResponse } from '../types';

// Positions API Service
export const positionService = {
  // GET /api/positions/ - List satellite positions with optional filtering
  getAll: async (filters?: PositionFilters): Promise<PaginatedResponse<Position>> => {
    return apiGet<PaginatedResponse<Position>>('/positions/', filters);
  },

  // GET /api/positions/{id}/ - Retrieve a specific position entry
  getById: async (id: number): Promise<Position> => {
    return apiGet<Position>(`/positions/${id}/`);
  },
};