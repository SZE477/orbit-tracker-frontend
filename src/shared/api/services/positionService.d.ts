import type { Position, PositionFilters, PaginatedResponse } from '../types';
export declare const positionService: {
    getAll: (filters?: PositionFilters) => Promise<PaginatedResponse<Position>>;
    getById: (id: number) => Promise<Position>;
};
