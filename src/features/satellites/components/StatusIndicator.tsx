import React from 'react';
import { usePositions } from '../../../shared/api/hooks/usePositionQueries';
import { useSatellites } from '../../../shared/api/hooks/useSatelliteQueries';

export const StatusIndicator: React.FC = () => {
  const { data: positionsData, isLoading: isLoadingPositions } = usePositions({
    page_size: 10,
  });
  const { data: satellitesData, isLoading: isLoadingSatellites } = useSatellites();

  const hasRealPositions = positionsData?.results && positionsData.results.length > 0;
  const satelliteCount = satellitesData?.results?.length || 0;
  const isLoading = isLoadingPositions || isLoadingSatellites;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-slate-400">Loading satellite data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${hasRealPositions ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
        <span className="text-xs text-slate-300">
          {hasRealPositions ? 'Live satellite tracking' : 'Demo mode - mock positions'}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span>📡</span>
          <span>{satelliteCount} satellites</span>
        </span>
        <span className="flex items-center gap-1">
          <span>🌍</span>
          <span>{hasRealPositions ? positionsData.results.length : Math.min(satelliteCount, 5)} positions</span>
        </span>
      </div>
    </div>
  );
};
