import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../apiClient';
import type { 
  Satellite, 
  SatelliteCreate, 
  SatelliteUpdate, 
  SatelliteFilters,
  PaginatedResponse,
  Position,
  TLE,
  PositionFilters
} from '../types';

// Satellites API Service
export const satelliteService = {
  // GET /api/satellites/ - List all satellites with optional filtering
  getAll: async (filters?: SatelliteFilters): Promise<PaginatedResponse<Satellite>> => {
    return apiGet<PaginatedResponse<Satellite>>('/satellites/', filters);
  },

  // POST /api/satellites/ - Create a new satellite
  create: async (data: SatelliteCreate): Promise<Satellite> => {
    return apiPost<Satellite>('/satellites/', data);
  },

  // GET /api/satellites/{id}/ - Get detailed information for a specific satellite
  getById: async (id: number): Promise<Satellite> => {
    return apiGet<Satellite>(`/satellites/${id}/`);
  },

  // PUT /api/satellites/{id}/ - Update a satellite (full update)
  update: async (id: number, data: SatelliteUpdate): Promise<Satellite> => {
    return apiPut<Satellite>(`/satellites/${id}/`, data);
  },

  // PATCH /api/satellites/{id}/ - Partially update a satellite
  partialUpdate: async (id: number, data: Partial<SatelliteUpdate>): Promise<Satellite> => {
    return apiPatch<Satellite>(`/satellites/${id}/`, data);
  },

  // DELETE /api/satellites/{id}/ - Delete a satellite
  delete: async (id: number): Promise<void> => {
    return apiDelete<void>(`/satellites/${id}/`);
  },

  // GET /api/satellites/{id}/positions/ - Get historical positions for a specific satellite
  getPositions: async (id: number, filters?: PositionFilters): Promise<PaginatedResponse<Position>> => {
    return apiGet<PaginatedResponse<Position>>(`/satellites/${id}/positions/`, filters);
  },

  // GET /api/satellites/{id}/tle/ - Get the latest TLE data for a specific satellite
  getTle: async (id: number): Promise<TLE> => {
    return apiGet<TLE>(`/satellites/${id}/tle/`);
  },
};