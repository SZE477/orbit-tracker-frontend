import type { Favorite, FavoriteCreate, PaginatedResponse } from '../types';
export declare const favoriteService: {
    getAll: () => Promise<PaginatedResponse<Favorite>>;
    create: (data: FavoriteCreate) => Promise<Favorite>;
    getById: (id: number) => Promise<Favorite>;
    delete: (id: number) => Promise<void>;
};
