import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import SatelliteList from './SatelliteList';

// Mock the API hooks to return test data
vi.mock('../../shared/api/hooks/useCategoryQueries', () => ({
  useCategories: () => ({
    data: {
      results: [
        { id: 1, name: 'ISS', slug: 'iss' },
        { id: 2, name: 'Weather', slug: 'weather' }
      ]
    },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../../shared/api/hooks/useSatelliteQueries', () => ({
  useSatellites: () => ({
    data: {
      results: [
        {
          id: 1,
          name: 'International Space Station',
          norad_id: 25544,
          country: 'USA',
          is_active: true,
        }
      ]
    },
    isLoading: false,
    isError: false,
  }),
}));

// Mock the store
vi.mock('../../shared/store/useAppStore', () => ({
  useAppStore: () => vi.fn(),
}));

describe('SatelliteList', () => {
  it('renders without QueryClient errors and displays data', async () => {
    render(<SatelliteList />);

    // Check that the search input is present
    expect(screen.getByPlaceholderText('Filter by name, NORAD ID...')).toBeInTheDocument();

    // Check that categories section is present
    expect(screen.getByText('Categories')).toBeInTheDocument();

    // Check that satellites section is present
    expect(screen.getByText('Satellites')).toBeInTheDocument();

    // Wait for mocked data to be rendered
    await waitFor(() => {
      expect(screen.getByText('ISS')).toBeInTheDocument();
      expect(screen.getByText('International Space Station')).toBeInTheDocument();
    });
  });
});