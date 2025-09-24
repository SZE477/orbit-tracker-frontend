import type { Subscription, SubscriptionCreate, SubscriptionFilters, PaginatedResponse } from '../types';
export declare const subscriptionService: {
    getAll: (filters?: SubscriptionFilters) => Promise<PaginatedResponse<Subscription>>;
    create: (data: SubscriptionCreate) => Promise<Subscription>;
    delete: (id: number) => Promise<void>;
};
