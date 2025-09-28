import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { renderWithProviders, createMockSatelliteList, createMockStoreState } from '@/test/utils';
import { SatelliteList } from '../SatelliteList';
import { useAppStore } from '@/shared/store/useAppStore';

// Mock the hooks
vi.mock('@tanstack/react-query');
vi.mock('@/shared/store/useAppStore');

const mockUseQuery = vi.mocked(useQuery);
const mockUseAppStore = vi.mocked(useAppStore);

describe('SatelliteList', () => {
  const mockSetSelectedSatelliteId = vi.fn();
  const mockSatellites = createMockSatelliteList(3);

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAppStore.mockReturnValue({
      ...createMockStoreState(),
      setSelectedSatelliteId: mockSetSelectedSatelliteId,
    } as any);
  });

  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    expect(screen.getByText('Loading satellites...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    expect(screen.getByText('Failed to load satellites')).toBeInTheDocument();
  });

  it('renders satellite list', () => {
    mockUseQuery.mockReturnValue({
      data: mockSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    expect(screen.getByText('Satellite 1')).toBeInTheDocument();
    expect(screen.getByText('Satellite 2')).toBeInTheDocument();
    expect(screen.getByText('Satellite 3')).toBeInTheDocument();
  });

  it('displays satellite information correctly', () => {
    mockUseQuery.mockReturnValue({
      data: mockSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    // Check NORAD ID is displayed
    expect(screen.getByText('NORAD: 12345')).toBeInTheDocument();
    
    // Check status badges
    expect(screen.getAllByText('Active')).toHaveLength(3);
    
    // Check satellite type badges
    expect(screen.getAllByText('communication')).toHaveLength(3);
  });

  it('handles satellite selection', async () => {
    mockUseQuery.mockReturnValue({
      data: mockSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    const firstSatellite = screen.getByText('Satellite 1').closest('div[role="button"]');
    expect(firstSatellite).toBeInTheDocument();
    
    fireEvent.click(firstSatellite!);
    
    await waitFor(() => {
      expect(mockSetSelectedSatelliteId).toHaveBeenCalledWith(1);
    });
  });

  it('highlights selected satellite', () => {
    mockUseAppStore.mockReturnValue({
      ...createMockStoreState({ view: { selectedSatelliteId: 1 } }),
      setSelectedSatelliteId: mockSetSelectedSatelliteId,
    } as any);

    mockUseQuery.mockReturnValue({
      data: mockSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    const selectedSatellite = screen.getByText('Satellite 1').closest('div');
    expect(selectedSatellite).toHaveClass('bg-accent/20');
  });

  it('shows empty state when no satellites', () => {
    mockUseQuery.mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    expect(screen.getByText('No satellites found')).toBeInTheDocument();
  });

  it('displays correct satellite count', () => {
    mockUseQuery.mockReturnValue({
      data: mockSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    expect(screen.getByText('Tracking 3 satellites')).toBeInTheDocument();
  });

  it('shows status indicators correctly', () => {
    const mixedSatellites = {
      ...mockSatellites,
      results: [
        { ...mockSatellites.results[0], is_active: true },
        { ...mockSatellites.results[1], is_active: false },
      ],
    };

    mockUseQuery.mockReturnValue({
      data: mixedSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    mockUseQuery.mockReturnValue({
      data: mockSatellites,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithProviders(<SatelliteList />);
    
    const firstSatellite = screen.getByText('Satellite 1').closest('div[role="button"]');
    
    // Focus the element
    firstSatellite?.focus();
    
    // Press Enter
    fireEvent.keyDown(firstSatellite!, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockSetSelectedSatelliteId).toHaveBeenCalledWith(1);
    });
  });
});
