import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/shared/components/Toast';
import { AuthProvider } from '@/shared/contexts/AuthContext';

// Mock data generators
export const createMockSatellite = (overrides = {}) => ({
  id: 1,
  name: 'Test Satellite',
  norad_id: 12345,
  satellite_type: 'communication',
  is_active: true,
  country: 'USA',
  launch_date: '2020-01-01',
  inclination: 51.6,
  eccentricity: 0.0001,
  mean_motion: 15.5,
  raan: 45.0,
  arg_perigee: 90.0,
  mean_anomaly: 180.0,
  ...overrides,
});

export const createMockSatelliteList = (count = 5) => ({
  count,
  next: null,
  previous: null,
  results: Array.from({ length: count }, (_, i) =>
    createMockSatellite({ id: i + 1, name: `Satellite ${i + 1}` })
  ),
});

export const createMockPass = (overrides = {}) => ({
  id: 1,
  satellite: createMockSatellite(),
  start_time: '2024-01-01T12:00:00Z',
  end_time: '2024-01-01T12:10:00Z',
  max_elevation: 45.5,
  max_elevation_time: '2024-01-01T12:05:00Z',
  direction: 'NE',
  magnitude: -2.5,
  is_visible: true,
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  profile: {
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
      country: 'USA',
    },
    timezone: 'America/New_York',
    preferred_units: 'metric' as const,
  },
  ...overrides,
});

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
  user?: any;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    initialEntries = ['/'],
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    user = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message = 'API Error', status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message);
      (error as any).status = status;
      reject(error);
    }, delay);
  });
};

// Test helpers for user interactions
export const waitForLoadingToFinish = async () => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {
    expect(document.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
  });
};

export const expectElementToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectElementToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(text);
};

// Mock store state helpers
export const createMockStoreState = (overrides = {}) => ({
  preferences: {
    theme: 'dark',
    units: 'metric',
    language: 'en',
    autoRotateGlobe: false,
    showOrbitPaths: true,
    showSatelliteLabels: true,
    performanceMode: 'auto',
  },
  view: {
    selectedSatelliteId: null,
    cameraPosition: [0, 0, 6] as [number, number, number],
    cameraTarget: [0, 0, 0] as [number, number, number],
    globeRotation: [0, 0, 0] as [number, number, number],
    zoomLevel: 1,
  },
  ui: {
    sidebarOpen: true,
    sidebarWidth: 320,
    panelsVisible: {
      satelliteList: true,
      satelliteDetail: false,
      passPrediction: false,
      settings: false,
    },
    modalsOpen: {
      auth: false,
      settings: false,
      about: false,
    },
    loading: {
      satellites: false,
      globe: false,
      passes: false,
    },
  },
  ...overrides,
});

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const expectRenderTimeToBeUnder = async (renderFn: () => void, maxTime: number) => {
  const renderTime = await measureRenderTime(renderFn);
  expect(renderTime).toBeLessThan(maxTime);
};

// Accessibility testing helpers
export const expectElementToBeAccessible = async (element: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);
  
  const results = await axe(element);
  expect(results).toHaveNoViolations();
};

// Custom matchers
export const customMatchers = {
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
};
