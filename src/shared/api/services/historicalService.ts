 import { apiGet, apiPost } from '../apiClient';
import type { 
  HistoricalQuery, 
  HistoricalQueryCreate, 
  HistoricalQueryFilters,
  PaginatedResponse 
} from '../types';

// Historical Queries API Service
export const historicalService = {
  // GET /api/historical/query/ - List all historical playback queries
  getAllQueries: async (filters?: HistoricalQueryFilters): Promise<PaginatedResponse<HistoricalQuery>> => {
    return apiGet<PaginatedResponse<HistoricalQuery>>('/historical/query/', filters);
  },

  // POST /api/historical/query/ - Enqueue a new historical playback generation task
  createQuery: async (data: HistoricalQueryCreate): Promise<HistoricalQuery> => {
    return apiPost<HistoricalQuery>('/historical/query/', data);
  },

  // GET /api/historical/query/{id}/ - Get the details and status of a specific query
  getQueryById: async (id: number): Promise<HistoricalQuery> => {
    return apiGet<HistoricalQuery>(`/historical/query/${id}/`);
  },
};