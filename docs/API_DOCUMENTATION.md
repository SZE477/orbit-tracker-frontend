# API Documentation

## Overview

This document provides comprehensive documentation for the Orbit Tracker frontend API integration, component interfaces, and development guidelines.

## Table of Contents

1. [Backend API Integration](#backend-api-integration)
2. [Component API Reference](#component-api-reference)
3. [State Management](#state-management)
4. [Custom Hooks](#custom-hooks)
5. [Utility Functions](#utility-functions)
6. [Testing Guidelines](#testing-guidelines)

## Backend API Integration

### Base Configuration

```typescript
// src/shared/config/index.ts
export const config = {
  API_BASE_URL: string;     // Backend API base URL
  WS_BASE_URL: string;      // WebSocket base URL
  MOCK_API: boolean;        // Enable mock API for development
  NODE_ENV: string;         // Environment mode
};
```

### API Endpoints

#### Satellites

```typescript
// GET /api/satellites/
interface SatelliteListParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: number;
  is_active?: boolean;
  ordering?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// GET /api/satellites/{id}/
interface Satellite {
  id: number;
  name: string;
  norad_id: number;
  satellite_type: string;
  is_active: boolean;
  country: string;
  launch_date: string;
  inclination?: number;
  eccentricity?: number;
  mean_motion?: number;
  raan?: number;
  arg_perigee?: number;
  mean_anomaly?: number;
}
```

#### Categories

```typescript
// GET /api/categories/
interface Category {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  color?: string;
}
```

#### Pass Predictions

```typescript
// GET /api/passes/
interface PassParams {
  satellite_id?: number;
  latitude: number;
  longitude: number;
  min_elevation?: number;
  days_ahead?: number;
}

interface Pass {
  id: number;
  satellite: Satellite;
  start_time: string;
  end_time: string;
  max_elevation: number;
  max_elevation_time: string;
  direction: string;
  magnitude?: number;
  is_visible: boolean;
}
```

#### Authentication

```typescript
// POST /api/auth/login/
interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// GET /api/auth/me/
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: UserProfile;
}

interface UserProfile {
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  timezone: string;
  preferred_units: 'metric' | 'imperial';
}
```

### WebSocket Events

```typescript
interface WebSocketMessage {
  type: 'satellite_position' | 'satellite_status' | 'heartbeat';
  data: any;
  timestamp: string;
}

// Satellite position update
{
  type: 'satellite_position',
  data: {
    satellite_id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    timestamp: string;
  }
}

// Satellite status update
{
  type: 'satellite_status',
  data: {
    satellite_id: number;
    is_active: boolean;
    last_updated: string;
  }
}
```

## Component API Reference

### SatelliteList

```typescript
interface SatelliteListProps {
  /** Maximum number of satellites to display */
  maxItems?: number;
  /** Enable search functionality */
  enableSearch?: boolean;
  /** Enable filtering options */
  enableFilters?: boolean;
  /** Callback when satellite is selected */
  onSatelliteSelect?: (satellite: Satellite) => void;
  /** Custom loading component */
  loadingComponent?: React.ComponentType;
  /** Custom error component */
  errorComponent?: React.ComponentType<{ error: Error }>;
}

/**
 * Displays a list of satellites with search and filter capabilities
 * 
 * @example
 * ```tsx
 * <SatelliteList
 *   maxItems={100}
 *   enableSearch={true}
 *   enableFilters={true}
 *   onSatelliteSelect={(satellite) => console.log(satellite)}
 * />
 * ```
 */
export const SatelliteList: React.FC<SatelliteListProps>;
```

### GlobeScene

```typescript
interface GlobeSceneProps {
  /** Camera initial position */
  cameraPosition?: [number, number, number];
  /** Enable performance monitoring */
  showPerformanceMonitor?: boolean;
  /** Quality settings */
  quality?: 'auto' | 'high' | 'medium' | 'low';
  /** Enable orbit path visualization */
  showOrbitPaths?: boolean;
  /** Enable atmospheric effects */
  showAtmosphere?: boolean;
  /** Callback when satellite is clicked */
  onSatelliteClick?: (satellite: Satellite) => void;
}

/**
 * 3D globe scene with satellite visualization
 * 
 * @example
 * ```tsx
 * <GlobeScene
 *   cameraPosition={[0, 0, 6]}
 *   showPerformanceMonitor={true}
 *   quality="auto"
 *   showOrbitPaths={true}
 *   onSatelliteClick={(satellite) => selectSatellite(satellite.id)}
 * />
 * ```
 */
export const GlobeScene: React.FC<GlobeSceneProps>;
```

### PassPrediction

```typescript
interface PassPredictionProps {
  /** Satellite ID to show passes for */
  satelliteId?: number;
  /** Maximum number of passes to display */
  maxPasses?: number;
  /** Minimum elevation angle */
  minElevation?: number;
  /** User location override */
  location?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Displays upcoming satellite pass predictions
 * 
 * @example
 * ```tsx
 * <PassPrediction
 *   satelliteId={12345}
 *   maxPasses={10}
 *   minElevation={10}
 *   location={{ latitude: 40.7128, longitude: -74.0060 }}
 * />
 * ```
 */
export const PassPrediction: React.FC<PassPredictionProps>;
```

## State Management

### App Store

```typescript
interface AppState {
  preferences: UserPreferences;
  view: ViewState;
  ui: UIState;
  
  // Actions
  setSelectedSatellite: (id: number | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateViewState: (viewState: Partial<ViewState>) => void;
  toggleSidebar: () => void;
  // ... more actions
}

/**
 * Main application store using Zustand
 * 
 * @example
 * ```tsx
 * const { selectedSatelliteId, setSelectedSatellite } = useAppStore();
 * 
 * // Select a satellite
 * setSelectedSatellite(12345);
 * 
 * // Use selectors for performance
 * const preferences = useAppStore(state => state.preferences);
 * ```
 */
export const useAppStore: () => AppState;
```

## Custom Hooks

### useSatellites

```typescript
interface UseSatellitesOptions {
  search?: string;
  category?: number;
  is_active?: boolean;
  enabled?: boolean;
}

/**
 * Hook for fetching satellite data with caching and pagination
 * 
 * @param options - Query options
 * @returns Query result with satellite data
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useSatellites({
 *   search: 'ISS',
 *   category: 1,
 *   is_active: true
 * });
 * ```
 */
export const useSatellites: (options?: UseSatellitesOptions) => UseQueryResult<PaginatedResponse<Satellite>>;
```

### useWebSocket

```typescript
interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
}

/**
 * Hook for WebSocket connection management
 * 
 * @param options - WebSocket configuration
 * @returns Connection state and methods
 * 
 * @example
 * ```tsx
 * const { isConnected, sendMessage } = useWebSocket({
 *   url: 'ws://localhost:8000/satellites/',
 *   onMessage: (message) => console.log(message),
 *   reconnectAttempts: 5
 * });
 * ```
 */
export const useWebSocket: (options: UseWebSocketOptions) => {
  isConnected: boolean;
  connectionStatus: string;
  sendMessage: (message: any) => boolean;
};
```

## Utility Functions

### API Client

```typescript
/**
 * Generic API GET request
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Promise with response data
 * 
 * @example
 * ```typescript
 * const satellites = await apiGet<PaginatedResponse<Satellite>>('/satellites/', {
 *   page: 1,
 *   search: 'ISS'
 * });
 * ```
 */
export const apiGet: <T>(endpoint: string, params?: Record<string, any>) => Promise<T>;

/**
 * Generic API POST request
 * 
 * @param endpoint - API endpoint
 * @param data - Request body data
 * @returns Promise with response data
 */
export const apiPost: <T>(endpoint: string, data: any) => Promise<T>;
```

### Orbital Calculations

```typescript
/**
 * Calculate satellite position from orbital elements
 * 
 * @param elements - Keplerian orbital elements
 * @param time - Time for calculation
 * @returns 3D position vector
 * 
 * @example
 * ```typescript
 * const position = calculateSatellitePosition({
 *   inclination: 51.6,
 *   eccentricity: 0.0001,
 *   meanMotion: 15.5,
 *   // ... other elements
 * }, new Date());
 * ```
 */
export const calculateSatellitePosition: (
  elements: OrbitalElements,
  time: Date
) => Vector3;
```

## Testing Guidelines

### Component Testing

```typescript
import { renderWithProviders, createMockSatellite } from '@/test/utils';

describe('SatelliteList', () => {
  it('renders satellite list correctly', () => {
    const mockSatellites = [createMockSatellite()];
    
    renderWithProviders(<SatelliteList />, {
      queryClient: createMockQueryClient({
        '/satellites/': { results: mockSatellites }
      })
    });
    
    expect(screen.getByText('Test Satellite')).toBeInTheDocument();
  });
});
```

### API Testing

```typescript
import { mockApiResponse, mockApiError } from '@/test/utils';

describe('useSatellites', () => {
  it('handles successful API response', async () => {
    const mockData = createMockSatelliteList();
    vi.mocked(apiGet).mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useSatellites());
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
  });
});
```

### Performance Testing

```typescript
import { measureRenderTime, expectRenderTimeToBeUnder } from '@/test/utils';

describe('GlobeScene Performance', () => {
  it('renders within acceptable time', async () => {
    await expectRenderTimeToBeUnder(
      () => renderWithProviders(<GlobeScene />),
      100 // milliseconds
    );
  });
});
```
