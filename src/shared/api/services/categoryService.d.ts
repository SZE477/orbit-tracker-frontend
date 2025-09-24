import type { Category, PaginatedResponse } from '../types';
export declare const categoryService: {
    getAll: () => Promise<PaginatedResponse<Category>>;
    getById: (id: number) => Promise<Category>;
};
