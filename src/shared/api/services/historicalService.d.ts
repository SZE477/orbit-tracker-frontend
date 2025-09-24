import type { HistoricalQuery, HistoricalQueryCreate, HistoricalQueryFilters, PaginatedResponse } from '../types';
export declare const historicalService: {
    getAllQueries: (filters?: HistoricalQueryFilters) => Promise<PaginatedResponse<HistoricalQuery>>;
    createQuery: (data: HistoricalQueryCreate) => Promise<HistoricalQuery>;
    getQueryById: (id: number) => Promise<HistoricalQuery>;
};
