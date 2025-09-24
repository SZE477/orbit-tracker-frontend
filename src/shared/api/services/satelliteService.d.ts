import type { Satellite, SatelliteCreate, SatelliteUpdate, SatelliteFilters, PaginatedResponse, Position, TLE, PositionFilters } from '../types';
export declare const satelliteService: {
    getAll: (filters?: SatelliteFilters) => Promise<PaginatedResponse<Satellite>>;
    create: (data: SatelliteCreate) => Promise<Satellite>;
    getById: (id: number) => Promise<Satellite>;
    update: (id: number, data: SatelliteUpdate) => Promise<Satellite>;
    partialUpdate: (id: number, data: Partial<SatelliteUpdate>) => Promise<Satellite>;
    delete: (id: number) => Promise<void>;
    getPositions: (id: number, filters?: PositionFilters) => Promise<PaginatedResponse<Position>>;
    getTle: (id: number) => Promise<TLE>;
};
