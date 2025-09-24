import React from 'react';
import { useSatellite, useSatelliteTle } from '../../shared/api/hooks/useSatelliteQueries';
import { useAppStore } from '../../shared/store/useAppStore';

const SatelliteDetail: React.FC = () => {
  const selectedSatelliteId = useAppStore((state) => state.selectedSatelliteId);
  const setSelectedSatelliteId = useAppStore((state) => state.setSelectedSatelliteId);

  // Fetch satellite details and TLE data
  const { 
    data: satellite, 
    isLoading: isLoadingSatellite, 
    isError: satelliteError 
  } = useSatellite(selectedSatelliteId || 0);

  const { 
    data: tle, 
    isLoading: isLoadingTle, 
    isError: tleError 
  } = useSatelliteTle(selectedSatelliteId || 0);

  const handleBack = () => {
    setSelectedSatelliteId(null);
  };

  if (!selectedSatelliteId) {
    return null;
  }

  if (isLoadingSatellite) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="sidebar-heading">Satellite Details</div>
          <button 
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </div>
        <div className="text-sm text-muted-foreground">Loading satellite details...</div>
      </div>
    );
  }

  if (satelliteError || !satellite) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="sidebar-heading">Satellite Details</div>
          <button 
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </div>
        <div className="text-sm text-destructive">
          Failed to load satellite details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="sidebar-heading">Satellite Details</div>
        <button 
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          ← Back
        </button>
      </div>

      {/* Satellite Name */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {satellite.name}
        </h3>
        <div className="text-sm text-muted-foreground">
          NORAD {satellite.norad_id}
        </div>
      </div>

      {/* Key Information */}
      <div className="space-y-4">
        <div>
          <div className="sidebar-heading">Basic Information</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Country:</span>
              <span className="text-sm font-medium">{satellite.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Launch Date:</span>
              <span className="text-sm font-medium">
                {new Date(satellite.launch_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={`text-sm font-medium ${
                satellite.is_active 
                  ? 'text-accent' 
                  : 'text-muted-foreground/70'
              }`}>
                {satellite.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Category Information */}
        {satellite.category && typeof satellite.category === 'object' && (
          <div>
            <div className="sidebar-heading">Category</div>
            <div className="text-sm font-medium">{satellite.category.name}</div>
          </div>
        )}

        {/* Description */}
        {satellite.description && (
          <div>
            <div className="sidebar-heading">Description</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {satellite.description}
            </div>
          </div>
        )}

        {/* Orbital Parameters */}
        {(satellite.orbit_class || satellite.orbit_type || satellite.orbit_period_minutes) && (
          <div>
            <div className="sidebar-heading">Orbital Parameters</div>
            <div className="space-y-2">
              {satellite.orbit_class && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Orbit Class:</span>
                  <span className="text-sm font-medium">{satellite.orbit_class}</span>
                </div>
              )}
              {satellite.orbit_type && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Orbit Type:</span>
                  <span className="text-sm font-medium">{satellite.orbit_type}</span>
                </div>
              )}
              {satellite.orbit_period_minutes && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Period:</span>
                  <span className="text-sm font-medium">{satellite.orbit_period_minutes} min</span>
                </div>
              )}
              {satellite.inclination_degrees && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Inclination:</span>
                  <span className="text-sm font-medium">{satellite.inclination_degrees}°</span>
                </div>
              )}
              {satellite.apogee_altitude_km && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Apogee:</span>
                  <span className="text-sm font-medium">{satellite.apogee_altitude_km} km</span>
                </div>
              )}
              {satellite.perigee_altitude_km && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Perigee:</span>
                  <span className="text-sm font-medium">{satellite.perigee_altitude_km} km</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TLE Data */}
        <div>
          <div className="sidebar-heading">TLE Data</div>
          {isLoadingTle && (
            <div className="text-sm text-muted-foreground">Loading TLE data...</div>
          )}
          {tleError && (
            <div className="text-sm text-destructive">Failed to load TLE data</div>
          )}
          {tle && (
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground/80 uppercase tracking-wide mb-1">
                  Line 1
                </div>
                <div className="text-xs font-mono bg-secondary/30 p-2 rounded border">
                  {tle.line1}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground/80 uppercase tracking-wide mb-1">
                  Line 2
                </div>
                <div className="text-xs font-mono bg-secondary/30 p-2 rounded border">
                  {tle.line2}
                </div>
              </div>
              <div className="text-xs text-muted-foreground/60">
                Last updated: {new Date(tle.epoch).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Physical Properties */}
        {satellite.mass_kg && (
          <div>
            <div className="sidebar-heading">Physical Properties</div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Mass:</span>
              <span className="text-sm font-medium">{satellite.mass_kg} kg</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteDetail;
