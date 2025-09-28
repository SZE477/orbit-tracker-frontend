import React from 'react';
import { useSatellites } from '@/shared/api/hooks/useSatelliteQueries';
import { useAppStore } from '@/shared/store/useAppStore';

const SatelliteList: React.FC = () => {
  const { data, isLoading, error } = useSatellites();
  const setSelectedSatelliteId = useAppStore((s) => s.setSelectedSatelliteId);

  if (isLoading) return <div className="p-2 text-sm text-muted-foreground">Loading satellites…</div>;
  if (error) return <div className="p-2 text-sm text-destructive">Failed to load satellites</div>;

  const satellites = data?.results ?? [];

  return (
    <ul className="space-y-1">
      {satellites.map((sat) => (
        <li key={sat.id}>
          <button
            className="w-full text-left px-2 py-1 rounded hover:bg-accent"
            onClick={() => setSelectedSatelliteId(sat.id)}
          >
            {sat.name}
          </button>
        </li>
      ))}
      {satellites.length === 0 && (
        <li className="p-2 text-sm text-muted-foreground">No satellites found.</li>
      )}
    </ul>
  );
};

export default SatelliteList;
