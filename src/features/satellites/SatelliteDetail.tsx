import React from 'react';
import { useSatellite } from '@/shared/api/hooks/useSatelliteQueries';
import { useAppStore } from '@/shared/store/useAppStore';

const SatelliteDetail: React.FC = () => {
  const selectedId = useAppStore((s) => s.selectedSatelliteId);
  const { data, isLoading, error } = useSatellite(selectedId ?? 0);

  if (!selectedId) {
    return <div className="p-4 text-sm text-muted-foreground">Select a satellite to view details.</div>;
  }
  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">Loading details…</div>;
  if (error) return <div className="p-4 text-sm text-destructive">Failed to load details.</div>;

  const sat = data;
  if (!sat) return null;

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold">{sat.name}</h3>
      <div className="text-sm text-muted-foreground">NORAD: {sat.norad_id ?? '—'}</div>
      <div className="text-sm">Active: {sat.is_active ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default SatelliteDetail;
