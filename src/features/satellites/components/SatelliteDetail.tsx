import React from 'react';
import { useSatellite } from '../../../shared/api/hooks/useSatelliteQueries';
import { useCategories } from '../../../shared/api/hooks/useCategoryQueries';
import { useAppStore } from '../../../shared/store/useAppStore';

export const SatelliteDetail: React.FC = () => {
  const selectedSatelliteId = useAppStore((state) => state.selectedSatelliteId);
  const setSelectedSatelliteId = useAppStore((state) => state.setSelectedSatelliteId);
  
  const { data: satellite, isLoading, isError } = useSatellite(selectedSatelliteId!);
  const { data: categoriesData } = useCategories();
  
  const categories = categoriesData?.results || [];
  const category = categories.find(cat => cat.id === satellite?.category);

  const handleBack = () => {
    setSelectedSatelliteId(null);
  };

  if (!selectedSatelliteId) return null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-300">Loading satellite details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !satellite) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-red-400">Failed to load satellite details</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Satellite Details</h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent"></div>
      </div>

      {/* Satellite Info Card */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {category && (
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color_hex }}
                ></div>
              )}
              <h2 className="text-xl font-bold text-slate-100">{satellite.name}</h2>
              <div className={`px-3 py-1 text-sm rounded-full border ${
                satellite.is_active 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {satellite.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            {category && (
              <p className="text-slate-400 text-sm">{category.display_name}</p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">NORAD ID</p>
            <p className="text-slate-200 font-mono">{satellite.norad_id}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Country</p>
            <p className="text-slate-200">{satellite.country}</p>
          </div>
          
          {satellite.launch_date && (
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Launch Date</p>
              <p className="text-slate-200">{new Date(satellite.launch_date).toLocaleDateString()}</p>
            </div>
          )}
          
          {satellite.tle_last_updated && (
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">TLE Updated</p>
              <p className="text-slate-200 text-sm">{new Date(satellite.tle_last_updated).toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Orbital Parameters */}
        {(satellite.apogee_km || satellite.perigee_km || satellite.orbital_period_min) && (
          <div className="pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Orbital Parameters</h4>
            <div className="grid grid-cols-2 gap-4">
              {satellite.apogee_km && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Apogee</p>
                  <p className="text-slate-200">{satellite.apogee_km} km</p>
                </div>
              )}
              
              {satellite.perigee_km && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Perigee</p>
                  <p className="text-slate-200">{satellite.perigee_km} km</p>
                </div>
              )}
              
              {satellite.orbital_period_min && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Orbital Period</p>
                  <p className="text-slate-200">{satellite.orbital_period_min} min</p>
                </div>
              )}
              
              {satellite.visual_magnitude && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Visual Magnitude</p>
                  <p className="text-slate-200">{satellite.visual_magnitude}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
