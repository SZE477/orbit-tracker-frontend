import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_API_BASE: 'http://localhost:8000/api',
  VITE_WS_BASE: 'ws://localhost:8000/ws',
  VITE_MOCK_API: 'true',
  NODE_ENV: 'test',
  DEV: false,
  PROD: false,
}));

// Mock Three.js for testing
vi.mock('three', () => ({
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  })),
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  Vector3: vi.fn(() => ({
    x: 0,
    y: 0,
    z: 0,
    length: vi.fn(() => 1),
    normalize: vi.fn(),
  })),
  Mesh: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  TextureLoader: vi.fn(() => ({
    load: vi.fn((url, onLoad) => {
      // Simulate successful texture loading
      if (onLoad) onLoad({ colorSpace: 'srgb' });
    }),
  })),
  DirectionalLight: vi.fn(),
  AmbientLight: vi.fn(),
  Color: vi.fn(),
}));

// Mock React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: { length: vi.fn(() => 5) } },
    gl: {
      info: {
        render: { triangles: 1000, calls: 10 },
        memory: { geometries: 5, textures: 3 },
      },
    },
  })),
  useLoader: vi.fn(() => ({ colorSpace: 'srgb' })),
  extend: vi.fn(),
}));

// Mock React Three Drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Stars: () => <div data-testid="stars" />,
  Environment: () => <div data-testid="environment" />,
  PerformanceMonitor: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AdaptiveDpr: () => null,
  AdaptiveEvents: () => null,
  Preload: () => null,
}));

// Mock Zustand store
vi.mock('@/shared/store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    selectedSatelliteId: null,
    setSelectedSatelliteId: vi.fn(),
    preferences: {
      theme: 'dark',
      units: 'metric',
      showOrbitPaths: true,
    },
    ui: {
      sidebarOpen: true,
      sidebarWidth: 320,
    },
  })),
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Global test utilities
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock WebGL context
const mockWebGLContext = {
  getExtension: vi.fn(),
  getParameter: vi.fn(),
  createShader: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  createProgram: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  createBuffer: vi.fn(),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  drawArrays: vi.fn(),
  viewport: vi.fn(),
  clearColor: vi.fn(),
  clear: vi.fn(),
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockWebGLContext);
