# Orbit Tracker Frontend API Integration

This directory contains a comprehensive API integration layer for the Orbit Tracker application, built with React Query, TypeScript, and Axios.

## Architecture Overview

```
src/shared/api/
├── types.ts                 # All TypeScript interfaces and types
├── apiClient.ts            # Axios configuration and HTTP methods
├── queryClient.ts          # React Query client configuration
├── services/               # API service functions
│   ├── categoryService.ts
│   ├── satelliteService.ts
│   ├── positionService.ts
│   ├── favoriteService.ts
│   ├── historicalService.ts
│   └── subscriptionService.ts
├── hooks/                  # React Query hooks
│   ├── useCategoryQueries.ts
│   ├── useSatelliteQueries.ts
│   ├── usePositionQueries.ts
│   ├── useFavoriteQueries.ts
│   ├── useHistoricalQueries.ts
│   └── useSubscriptionQueries.ts
└── index.ts               # Main API exports
```

## Features

### ✅ Comprehensive Type Definitions
- Full TypeScript interfaces for all API entities
- Proper typing for requests, responses, and filters
- Utility types for pagination and error handling

### ✅ Robust HTTP Client
- Axios-based API client with interceptors
- Automatic error handling and transformation
- Request/response logging and auth token management

### ✅ React Query Integration  
- Optimized hooks for all API endpoints
- Smart caching with appropriate stale times
- Automatic background refetching for live data
- Mutation hooks with cache invalidation

### ✅ Service Layer
- Clean separation of concerns
- Reusable service functions
- Consistent API patterns across resources

## Usage Examples

### Basic Data Fetching

```tsx
import { useSatellites, useCategories } from '@/shared/api';

function SatelliteList() {
  const { data: satellites, isLoading, error } = useSatellites();
  const { data: categories } = useCategories();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.detail}</div>;
  
  return (
    <div>
      {satellites?.results.map(sat => (
        <div key={sat.id}>{sat.name}</div>
      ))}
    </div>
  );
}
```

### Filtered Queries

```tsx
import { useSatellites } from '@/shared/api';

function FilteredSatellites() {
  const { data } = useSatellites({
    category: 1,
    country: 'USA',
    is_active: true,
    search: 'ISS'
  });
  
  return <SatelliteGrid satellites={data?.results} />;
}
```

### Mutations

```tsx
import { useCreateSatellite, useDeleteSatellite } from '@/shared/api';

function SatelliteManager() {
  const createSatellite = useCreateSatellite();
  const deleteSatellite = useDeleteSatellite();
  
  const handleCreate = () => {
    createSatellite.mutate({
      norad_id: 12345,
      name: 'New Satellite',
      category: 1,
      country: 'USA',
      launch_date: '2025-01-01',
    });
  };
  
  const handleDelete = (id: number) => {
    deleteSatellite.mutate(id);
  };
  
  return (
    <div>
      <button onClick={handleCreate}>Add Satellite</button>
    </div>
  );
}
```

### Real-time Position Updates

```tsx
import { usePositions } from '@/shared/api';

function LivePositions() {
  // Automatically refetches every minute
  const { data: positions } = usePositions({
    satellite: 25544, // ISS
    page_size: 10
  });
  
  return <PositionMap positions={positions?.results} />;
}
```

### Historical Queries

```tsx
import { useCreateHistoricalQuery, useHistoricalQuery } from '@/shared/api';

function HistoricalPlayback() {
  const createQuery = useCreateHistoricalQuery();
  const [queryId, setQueryId] = useState<number>();
  
  // This will automatically refetch every 5s while processing
  const { data: query } = useHistoricalQuery(queryId!);
  
  const startHistoricalQuery = () => {
    createQuery.mutate({
      satellites: [25544],
      start_time: '2025-01-01T00:00:00Z',
      end_time: '2025-01-02T00:00:00Z',
      time_step_seconds: 60
    }, {
      onSuccess: (data) => setQueryId(data.id)
    });
  };
  
  return (
    <div>
      <button onClick={startHistoricalQuery}>Generate Historical Data</button>
      {query && (
        <div>Status: {query.status} ({query.progress_percent}%)</div>
      )}
    </div>
  );
}
```

## Configuration

### Environment Variables

```env
VITE_API_BASE=/api  # API base URL (default: /api)
```

### Query Client Setup

The QueryClient is pre-configured with optimal defaults:

```tsx
// Already configured in src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});
```

## API Resources

### 📡 Satellites
- Full CRUD operations
- Advanced filtering and search
- Position history and TLE data
- Real-time orbit calculations

### 🏷️ Categories  
- Satellite categorization
- Color-coded display
- Hierarchical organization

### 📍 Positions
- Real-time satellite positions
- Historical position data
- Geographic filtering

### ⭐ Favorites
- User favorite satellites
- Personal notes and organization

### 📊 Historical Queries
- Batch position generation
- Progress tracking
- File export capabilities  

### 🔔 Subscriptions
- Event notifications
- Multi-channel delivery (email, push, webhook)
- Location-based alerts

## Error Handling

All API calls return standardized error objects:

```tsx
interface APIError {
  detail: string;           // Human-readable error message
  code?: string;            // Error code (e.g., 'NETWORK_ERROR')
  field_errors?: Record<string, string[]>; // Validation errors
}
```

## Caching Strategy

- **Categories**: 5 minutes (rarely change)
- **Satellites**: 2 minutes (occasional updates)  
- **Positions**: 30 seconds (frequently updated)
- **Favorites**: 2 minutes (user-specific)
- **Historical Queries**: 1 minute (status updates)

## Performance Optimizations

- ✅ Smart query invalidation
- ✅ Background refetching for live data
- ✅ Optimistic updates for mutations
- ✅ Request deduplication
- ✅ Automatic retry with exponential backoff
- ✅ Memory-efficient pagination

## Development Tools

- **React Query DevTools**: Inspect cache and network activity
- **TypeScript**: Full type safety and IntelliSense
- **Error Boundaries**: Graceful error handling
- **Loading States**: Built-in loading and error states