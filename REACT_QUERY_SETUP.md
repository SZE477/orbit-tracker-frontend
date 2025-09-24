# React Query Setup - Complete Fix

## Problem
The console was showing 'No QueryClient set, use QueryClientProvider to set one' error thrown from SatelliteList/useCategories (custom hooks) and MissionControl components.

## Root Cause
The main.tsx entry point was not wrapped with QueryClientProvider, even though:
- @tanstack/react-query v5 was properly installed
- A well-configured QueryClient existed in `src/shared/api/queryClient.ts`
- Custom hooks were correctly using useQuery from @tanstack/react-query

## Solution Implemented

### 1. Updated main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/api/queryClient';
import { QueryDevtools } from './shared/api/devtools';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <QueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

### 2. Existing queryClient.ts (Already Well-Configured)
The project already had an excellent QueryClient configuration at `src/shared/api/queryClient.ts`:

```ts
export const queryClient = createQueryClient();

const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: (failureCount: number, error: Error) => {
    const apiError = error as unknown as APIError;
    if (apiError.code && apiError.code.startsWith('4')) {
      return false;
    }
    return failureCount < 3;
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: 'always' as const,
};
```

### 3. Updated test-utils.tsx
```tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

const AllProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 4. Created devtools.tsx (Optional)
```tsx
import React from 'react';

export const QueryDevtools: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  // Simplified for now - can be enhanced later
  return null;
};
```

### 5. Updated vitest.config.ts
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## Verification

### Tests Pass
```bash
npx vitest run src/features/satellites/SatelliteList.test.tsx
# ✓ SatelliteList > renders without QueryClient errors and displays data
```

### Application Runs Without Errors
- No more "No QueryClient set" console errors
- SatelliteList component renders correctly
- useCategories and useSatellites hooks work properly
- MissionControl component functions without errors

## Package.json Notes for Monorepo

If this project becomes part of a monorepo, ensure:

```json
{
  "peerDependencies": {
    "@tanstack/react-query": "^5.51.1"
  }
}
```

And in the root package.json:
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.51.1"
  },
  "workspaces": {
    "nohoist": ["**/react", "**/react-dom", "**/@tanstack/react-query"]
  }
}
```

This prevents multiple instances of React Query that could cause provider mismatch errors.

## Key Benefits

1. **Single QueryClient Instance**: One QueryClient shared across the entire app
2. **Proper Error Handling**: Smart retry logic that doesn't retry 4xx errors
3. **Optimal Caching**: 5-minute stale time, 10-minute garbage collection
4. **Test-Friendly**: Separate test QueryClient with no retries
5. **Development Ready**: Devtools integration (can be enhanced)
6. **TypeScript Support**: Full type safety maintained

The error is now completely resolved and the application has a robust React Query setup.
