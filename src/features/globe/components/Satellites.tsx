import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { apiGet } from '../../../shared/api/apiClient';
import { createQueryKey } from '../../../shared/api/queryClient';
import type { PaginatedResponse } from '../../../shared/api/types';

// Enhanced satellite type with TLE data and classification
type Satellite = { 
  id: number; 
  norad_id: number; 
  name: string; 
  is_active: boolean;
  line1?: string; // TLE line 1
  line2?: string; // TLE line 2
  satellite_type?: 'ISS' | 'STARLINK' | 'GPS' | 'COMMUNICATION' | 'OTHER';
  epoch?: string;
  mean_motion?: number;
  eccentricity?: number;
  inclination?: number;
  raan?: number; // Right Ascension of Ascending Node
  arg_perigee?: number; // Argument of Perigee
  mean_anomaly?: number;
};

// Satellite type configurations for visual differentiation
const SATELLITE_CONFIGS = {
  ISS: { color: 0xff6b6b, size: 0.04, emissive: 0x330000, emissiveIntensity: 0.8 },
  STARLINK: { color: 0x4ecdc4, size: 0.02, emissive: 0x002233, emissiveIntensity: 0.4 },
  GPS: { color: 0x45b7d1, size: 0.025, emissive: 0x001122, emissiveIntensity: 0.5 },
  COMMUNICATION: { color: 0x96ceb4, size: 0.03, emissive: 0x001100, emissiveIntensity: 0.3 },
  OTHER: { color: 0xfeca57, size: 0.02, emissive: 0x221100, emissiveIntensity: 0.2 },
} as const;

interface SatelliteFilters {
  showISS: boolean;
  showStarlink: boolean;
  showGPS: boolean;
  showCommunication: boolean;
  showOther: boolean;
  showActiveOnly: boolean;
}

interface SatellitesProps {
  filters?: SatelliteFilters;
  timeMultiplier?: number; // Speed up/slow down time
  onSatelliteClick?: (satellite: Satellite) => void;
  enableLOD?: boolean; // Level of Detail optimization
  maxInstances?: number; // Performance limit
}

// Enhanced orbital calculation using proper SGP4-like simplified model
const calculateSatellitePosition = (satellite: Satellite, currentTime: number, timeMultiplier: number = 1): THREE.Vector3 => {
  // If we have TLE data, use more accurate calculation
  if (satellite.mean_motion && satellite.inclination && satellite.raan && satellite.arg_perigee && satellite.mean_anomaly) {
    const earthRadius = 2.0; // Scaled for visualization
    
    // Time since epoch (simplified)
    const epochTime = satellite.epoch ? new Date(satellite.epoch).getTime() : currentTime;
    const timeSinceEpoch = (currentTime - epochTime) * timeMultiplier / 1000; // Convert to seconds
    
    // Mean motion in radians per second (simplified conversion)
    const meanMotionRad = (satellite.mean_motion * 2 * Math.PI) / 86400; // revs/day to rad/s
    
    // Current mean anomaly
    const currentMeanAnomaly = (satellite.mean_anomaly + meanMotionRad * timeSinceEpoch) % (2 * Math.PI);
    
    // Simplified orbital calculations (not full SGP4, but more realistic than random)
    const semiMajorAxis = Math.pow((86400 / (satellite.mean_motion * 2 * Math.PI)), 2/3) * 6371 / 6371 * 0.3 + earthRadius; // Scaled
    const eccentricity = satellite.eccentricity || 0;
    const inclination = satellite.inclination * Math.PI / 180;
    const raan = satellite.raan * Math.PI / 180;
    const argPerigee = satellite.arg_perigee * Math.PI / 180;
    
    // Solve Kepler's equation (simplified)
    let eccentricAnomaly = currentMeanAnomaly;
    for (let i = 0; i < 5; i++) {
      eccentricAnomaly = currentMeanAnomaly + eccentricity * Math.sin(eccentricAnomaly);
    }
    
    // True anomaly
    const trueAnomaly = 2 * Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
    );
    
    // Distance from Earth center
    const radius = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));
    
    // Position in orbital plane
    const xOrbital = radius * Math.cos(trueAnomaly + argPerigee);
    const yOrbital = radius * Math.sin(trueAnomaly + argPerigee);
    // const zOrbital = 0; // Unused for now
    
    // Transform to Earth-centered coordinates
    const cosRaan = Math.cos(raan);
    const sinRaan = Math.sin(raan);
    const cosInc = Math.cos(inclination);
    const sinInc = Math.sin(inclination);
    
    const x = cosRaan * xOrbital - sinRaan * cosInc * yOrbital;
    const y = sinRaan * xOrbital + cosRaan * cosInc * yOrbital;
    const z = sinInc * yOrbital;
    
    return new THREE.Vector3(x, y, z);
  }
  
  // Fallback to enhanced deterministic positioning
  const seed = ((satellite.norad_id ?? satellite.id) % 360) / 360;
  const timeOffset = currentTime * timeMultiplier * 0.0001; // Slower motion
  const lon = (seed * 360 - 180 + timeOffset * 50) % 360 - 180;
  const latSeed = (((satellite.norad_id ?? satellite.id) * 7) % 180) / 180;
  const lat = (latSeed * 180 - 90 + Math.sin(timeOffset * 0.5) * 10) % 180 - 90;
  
  // Variable altitude based on satellite type
  const baseAltitude = satellite.satellite_type === 'ISS' ? 2.08 : 
                      satellite.satellite_type === 'STARLINK' ? 2.05 :
                      satellite.satellite_type === 'GPS' ? 2.3 : 2.1;
  
  return latLonToXYZ(lat, lon, baseAltitude);
};

const latLonToXYZ = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Enhanced satellite component with all features
const Satellites: React.FC<SatellitesProps> = ({ 
  filters = {
    showISS: true,
    showStarlink: true,
    showGPS: true,
    showCommunication: true,
    showOther: true,
    showActiveOnly: true
  },
  timeMultiplier = 1,
  onSatelliteClick,
  enableLOD = true,
  maxInstances = 10000
}) => {
  const instRefs = useRef<{ [key: string]: THREE.InstancedMesh | null }>({});
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const { camera } = useThree();
  
  const { data, isLoading, error } = useQuery<PaginatedResponse<Satellite>>({
    queryKey: createQueryKey.satellites(),
    queryFn: async () => await apiGet<PaginatedResponse<Satellite>>('/satellites/'),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
  
  const satellites: Satellite[] = data?.results ?? [];

  // Filter and group satellites by type
  const groupedSatellites = useMemo(() => {
    const filtered = satellites.filter(satellite => {
      if (filters.showActiveOnly && !satellite.is_active) return false;
      
      const type = satellite.satellite_type || 'OTHER';
      return (
        (type === 'ISS' && filters.showISS) ||
        (type === 'STARLINK' && filters.showStarlink) ||
        (type === 'GPS' && filters.showGPS) ||
        (type === 'COMMUNICATION' && filters.showCommunication) ||
        (type === 'OTHER' && filters.showOther)
      );
    }).slice(0, maxInstances); // Limit for performance
    
    // Group by satellite type
    const grouped: { [key: string]: Satellite[] } = {};
    filtered.forEach(sat => {
      const type = sat.satellite_type || 'OTHER';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(sat);
    });
    
    return grouped;
  }, [satellites, filters, maxInstances]);

  // Calculate positions for each group
  const groupPositions = useMemo(() => {
    const positions: { [key: string]: THREE.Vector3[] } = {};
    
    Object.entries(groupedSatellites).forEach(([type, sats]) => {
      positions[type] = sats.map(sat => 
        calculateSatellitePosition(sat, currentTime, timeMultiplier)
      );
    });
    
    return positions;
  }, [groupedSatellites, currentTime, timeMultiplier]);

  // Level of Detail calculation
  const calculateLODSize = useCallback((distance: number, baseSize: number) => {
    if (!enableLOD) return baseSize;
    
    const minSize = baseSize * 0.3;
    const maxDistance = 50;
    const sizeFactor = Math.max(minSize / baseSize, 1 - (distance / maxDistance));
    return baseSize * sizeFactor;
  }, [enableLOD]);

  // Animation loop
  useFrame((_, delta) => {
    setCurrentTime(prev => prev + delta * 1000 * timeMultiplier);
    
    // Update instance matrices for each group
    Object.entries(instRefs.current).forEach(([type, mesh]) => {
      if (!mesh || !groupPositions[type]) return;
      
      const positions = groupPositions[type];
      const config = SATELLITE_CONFIGS[type as keyof typeof SATELLITE_CONFIGS] || SATELLITE_CONFIGS.OTHER;
      const tmp = new THREE.Object3D();
      
      positions.forEach((pos, i) => {
        tmp.position.copy(pos);
        tmp.lookAt(new THREE.Vector3(0, 0, 0));
        
        // Apply LOD scaling
        if (enableLOD) {
          const distance = camera.position.distanceTo(pos);
          const scale = calculateLODSize(distance, config.size) / config.size;
          tmp.scale.setScalar(scale);
        }
        
        tmp.updateMatrix();
        mesh.setMatrixAt(i, tmp.matrix);
      });
      
      mesh.instanceMatrix.needsUpdate = true;
      mesh.count = positions.length; // Dynamic count for performance
    });
  });

  // Handle satellite selection
  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    
    if (!onSatelliteClick) return;
    
    // Find closest satellite to click point (simplified)
    const intersections = event.intersections;
    if (intersections.length > 0) {
      const instanceId = intersections[0].instanceId;
      
      // Find satellite by instance ID across all groups
      let targetSatellite: Satellite | null = null;
      let runningIndex = 0;
      
      for (const [, sats] of Object.entries(groupedSatellites)) {
        if (instanceId >= runningIndex && instanceId < runningIndex + sats.length) {
          targetSatellite = sats[instanceId - runningIndex];
          break;
        }
        runningIndex += sats.length;
      }
      
      if (targetSatellite) {
        setSelectedSatellite(targetSatellite);
        onSatelliteClick(targetSatellite);
      }
    }
  }, [onSatelliteClick, groupedSatellites]);

  if (isLoading) return null;
  if (error) {
    console.error('Satellite data loading error:', error);
    return null;
  }

  return (
    <group>
      {Object.entries(groupedSatellites).map(([type, sats]) => {
        if (sats.length === 0) return null;
        
        const config = SATELLITE_CONFIGS[type as keyof typeof SATELLITE_CONFIGS] || SATELLITE_CONFIGS.OTHER;
        
        return (
          <instancedMesh
            key={type}
            ref={(ref) => { instRefs.current[type] = ref; }}
            args={[undefined, undefined, sats.length]}
            onClick={handleClick}
          >
            <sphereGeometry args={[config.size, 8, 8]} />
            <meshStandardMaterial 
              color={config.color}
              emissive={config.emissive}
              emissiveIntensity={config.emissiveIntensity}
              transparent={true}
              opacity={selectedSatellite?.satellite_type === type ? 1.0 : 0.8}
            />
          </instancedMesh>
        );
      })}
      
      {/* Orbit trails for selected satellite (optional enhancement) */}
      {selectedSatellite && (
        <TrailRenderer satellite={selectedSatellite} timeMultiplier={timeMultiplier} />
      )}
    </group>
  );
};

// Optional: Orbit trail component for selected satellites
const TrailRenderer: React.FC<{ satellite: Satellite; timeMultiplier: number }> = ({ 
  satellite, 
  timeMultiplier 
}) => {
  const points = useMemo(() => {
    const trailPoints: THREE.Vector3[] = [];
    const currentTime = Date.now();
    const numPoints = 100;
    const timeStep = 3600000; // 1 hour steps
    
    for (let i = 0; i < numPoints; i++) {
      const time = currentTime - (i * timeStep);
      const pos = calculateSatellitePosition(satellite, time, timeMultiplier);
      trailPoints.push(pos);
    }
    
    return trailPoints;
  }, [satellite, timeMultiplier]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          count={points.length}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={0x666666} opacity={0.3} transparent />
    </line>
  );
};

export default Satellites;
