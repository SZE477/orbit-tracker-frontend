export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
export interface APIError {
    detail: string;
    code?: string;
    field_errors?: Record<string, string[]>;
}
export interface Category {
    id: number;
    name: string;
    display_name: string;
    color_hex: string;
    priority: number;
    slug: string;
    created_at: string;
    updated_at: string;
}
export interface CategoryCreate {
    name: string;
    display_name: string;
    color_hex: string;
    priority: number;
    slug: string;
}
export interface CategoryUpdate extends Partial<CategoryCreate> {
}
export interface TLE {
    line1: string;
    line2: string;
    epoch: string;
    created_at?: string;
    updated_at?: string;
}
export interface Satellite {
    id: number;
    norad_id: number;
    name: string;
    category: Category | number;
    country: string;
    launch_date: string;
    is_active: boolean;
    description?: string;
    mass_kg?: number;
    orbit_class?: string;
    orbit_type?: string;
    orbit_period_minutes?: number;
    inclination_degrees?: number;
    apogee_altitude_km?: number;
    perigee_altitude_km?: number;
    semi_major_axis_km?: number;
    eccentricity?: number;
    mean_motion_revs_per_day?: number;
    created_at: string;
    updated_at: string;
}
export interface SatelliteCreate {
    norad_id: number;
    name: string;
    category: number;
    country: string;
    launch_date: string;
    is_active?: boolean;
    description?: string;
    mass_kg?: number;
    orbit_class?: string;
    orbit_type?: string;
    orbit_period_minutes?: number;
    inclination_degrees?: number;
    apogee_altitude_km?: number;
    perigee_altitude_km?: number;
    semi_major_axis_km?: number;
    eccentricity?: number;
    mean_motion_revs_per_day?: number;
}
export interface SatelliteUpdate extends Partial<SatelliteCreate> {
}
export interface SatelliteFilters {
    category?: number;
    country?: string;
    is_active?: boolean;
    launch_date_after?: string;
    launch_date_before?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}
export interface Position {
    id: number;
    satellite: number;
    latitude: number;
    longitude: number;
    altitude_km: number;
    velocity_kmh?: number;
    azimuth_degrees?: number;
    elevation_degrees?: number;
    range_km?: number;
    timestamp: string;
    created_at: string;
}
export interface PositionFilters {
    satellite?: number;
    timestamp_after?: string;
    timestamp_before?: string;
    latitude_min?: number;
    latitude_max?: number;
    longitude_min?: number;
    longitude_max?: number;
    altitude_min_km?: number;
    altitude_max_km?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
}
export interface Favorite {
    id: number;
    satellite: Satellite | number;
    user: number;
    created_at: string;
    notes?: string;
}
export interface FavoriteCreate {
    satellite: number;
    notes?: string;
}
export interface FavoriteUpdate {
    notes?: string;
}
export type HistoricalQueryStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export interface HistoricalQuery {
    id: number;
    satellites: number[];
    start_time: string;
    end_time: string;
    time_step_seconds: number;
    status: HistoricalQueryStatus;
    progress_percent: number;
    estimated_completion_time?: string;
    result_file_url?: string;
    error_message?: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}
export interface HistoricalQueryCreate {
    satellites: number[];
    start_time: string;
    end_time: string;
    time_step_seconds?: number;
}
export interface HistoricalQueryFilters {
    status?: HistoricalQueryStatus;
    satellites?: number[];
    start_time_after?: string;
    start_time_before?: string;
    created_at_after?: string;
    created_at_before?: string;
    page?: number;
    page_size?: number;
    ordering?: string;
}
export type SubscriptionType = 'email' | 'push' | 'webhook' | 'sms';
export type SubscriptionEvent = 'satellite_pass' | 'orbital_decay' | 'collision_warning' | 'launch_notification';
export interface Subscription {
    id: number;
    user: number;
    type: SubscriptionType;
    event: SubscriptionEvent;
    satellites: number[];
    is_active: boolean;
    endpoint?: string;
    phone_number?: string;
    email?: string;
    frequency_hours?: number;
    location_latitude?: number;
    location_longitude?: number;
    elevation_threshold_degrees?: number;
    created_at: string;
    updated_at: string;
}
export interface SubscriptionCreate {
    type: SubscriptionType;
    event: SubscriptionEvent;
    satellites: number[];
    is_active?: boolean;
    endpoint?: string;
    phone_number?: string;
    email?: string;
    frequency_hours?: number;
    location_latitude?: number;
    location_longitude?: number;
    elevation_threshold_degrees?: number;
}
export interface SubscriptionUpdate extends Partial<SubscriptionCreate> {
}
export interface SubscriptionFilters {
    type?: SubscriptionType;
    event?: SubscriptionEvent;
    is_active?: boolean;
    satellites?: number[];
    page?: number;
    page_size?: number;
    ordering?: string;
}
export interface SatellitePosition {
    norad_id: number;
    position: Position;
}
export interface Pass {
    start_time: string;
    end_time: string;
    peak_time: string;
    start_azimuth: number;
    peak_azimuth: number;
    end_azimuth: number;
    peak_elevation: number;
    duration_seconds: number;
    visual_magnitude?: number;
}
export interface HealthStatus {
    status: 'ok' | 'degraded' | 'error';
    api_version: string;
    database_connected: boolean;
}
export declare const QueryKeys: {
    readonly categories: readonly ["categories"];
    readonly category: (id: number) => readonly ["categories", number];
    readonly satellites: readonly ["satellites"];
    readonly satellite: (id: number) => readonly ["satellites", number];
    readonly satellitePositions: (id: number) => readonly ["satellites", number, "positions"];
    readonly satelliteTle: (id: number) => readonly ["satellites", number, "tle"];
    readonly satellitesFiltered: (filters: SatelliteFilters) => readonly ["satellites", "filtered", SatelliteFilters];
    readonly positions: readonly ["positions"];
    readonly position: (id: number) => readonly ["positions", number];
    readonly positionsFiltered: (filters: PositionFilters) => readonly ["positions", "filtered", PositionFilters];
    readonly favorites: readonly ["favorites"];
    readonly favorite: (id: number) => readonly ["favorites", number];
    readonly historicalQueries: readonly ["historical-queries"];
    readonly historicalQuery: (id: number) => readonly ["historical-queries", number];
    readonly historicalQueriesFiltered: (filters: HistoricalQueryFilters) => readonly ["historical-queries", "filtered", HistoricalQueryFilters];
    readonly subscriptions: readonly ["subscriptions"];
    readonly subscription: (id: number) => readonly ["subscriptions", number];
    readonly subscriptionsFiltered: (filters: SubscriptionFilters) => readonly ["subscriptions", "filtered", SubscriptionFilters];
};
