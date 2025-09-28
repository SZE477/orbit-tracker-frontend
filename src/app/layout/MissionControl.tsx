import React from 'react';
import { useAppStore } from '../../shared/store/useAppStore';
import SatelliteList from '../../features/satellites/SatelliteList';
import SatelliteDetail from '../../features/satellites/SatelliteDetail';

export const MissionControl: React.FC = () => {
  const selectedSatelliteId = useAppStore((state) => state.selectedSatelliteId);

  return (
    <div className="overlay open">
      <div className="panel">
        <div className="panel-header">
          <h2>Mission Control</h2>
        </div>

        {/* Conditionally render based on selected satellite */}
        {selectedSatelliteId ? (
          <SatelliteDetail />
        ) : (
          <SatelliteList />
        )}
      </div>
    </div>
  );
};