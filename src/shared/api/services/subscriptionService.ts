import { apiGet, apiPost, apiDelete } from '../apiClient';
import type { 
  Subscription, 
  SubscriptionCreate, 
  SubscriptionFilters,
  PaginatedResponse 
} from '../types';

// Subscriptions API Service
export const subscriptionService = {
  // GET /api/subscriptions/ - List user/device subscriptions
  getAll: async (filters?: SubscriptionFilters): Promise<PaginatedResponse<Subscription>> => {
    return apiGet<PaginatedResponse<Subscription>>('/subscriptions/', filters);
  },

  // POST /api/subscriptions/ - Create a new subscription
  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    return apiPost<Subscription>('/subscriptions/', data);
  },

  // DELETE /api/subscriptions/{id}/ - Delete a subscription
  delete: async (id: number): Promise<void> => {
    return apiDelete<void>(`/subscriptions/${id}/`);
  },
};