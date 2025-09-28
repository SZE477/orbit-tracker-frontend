import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitPathProps {
  satellite: {
    id: number;
    name: string;
    inclination?: number;
    eccentricity?: number;
    mean_motion?: number;
    raan?: number; // Right Ascension of Ascending Node
    arg_perigee?: number; // Argument of Perigee
    mean_anomaly?: number;
  };
  visible?: boolean;
  color?: string;
  opacity?: number;
  segments?: number;
  earthRadius?: number;
}

/**
 * Calculate orbital position using simplified Keplerian elements
 */
const calculateOrbitPosition = (
  meanAnomaly: number,
  eccentricity: number,
  semiMajorAxis: number,
  inclination: number,
  raan: number,
  argPerigee: number
): THREE.Vector3 => {
  // Convert degrees to radians
  const incRad = (inclination * Math.PI) / 180;
  const raanRad = (raan * Math.PI) / 180;
  const argPerigeeRad = (argPerigee * Math.PI) / 180;
  const meanAnomalyRad = (meanAnomaly * Math.PI) / 180;

  // Solve Kepler's equation (simplified - using mean anomaly as approximation)
  const eccentricAnomaly = meanAnomalyRad + eccentricity * Math.sin(meanAnomalyRad);
  
  // True anomaly
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
  );

  // Distance from Earth center
  const radius = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));

  // Position in orbital plane
  const x_orbital = radius * Math.cos(trueAnomaly);
  const y_orbital = radius * Math.sin(trueAnomaly);
  const z_orbital = 0;

  // Rotation matrices for orbital elements
  const cosRaan = Math.cos(raanRad);
  const sinRaan = Math.sin(raanRad);
  const cosInc = Math.cos(incRad);
  const sinInc = Math.sin(incRad);
  const cosArg = Math.cos(argPerigeeRad);
  const sinArg = Math.sin(argPerigeeRad);

  // Transform to Earth-centered coordinates
  const x = (cosRaan * cosArg - sinRaan * sinArg * cosInc) * x_orbital +
            (-cosRaan * sinArg - sinRaan * cosArg * cosInc) * y_orbital;
  
  const y = (sinRaan * cosArg + cosRaan * sinArg * cosInc) * x_orbital +
            (-sinRaan * sinArg + cosRaan * cosArg * cosInc) * y_orbital;
  
  const z = (sinInc * sinArg) * x_orbital + (sinInc * cosArg) * y_orbital;

  return new THREE.Vector3(x, y, z);
};

export const OrbitPath: React.FC<OrbitPathProps> = ({
  satellite,
  visible = true,
  color = '#00aaff',
  opacity = 0.6,
  segments = 128,
  earthRadius = 1,
}) => {
  const lineRef = useRef<THREE.Line>(null);

  // Calculate orbit path points
  const orbitPoints = useMemo(() => {
    if (!satellite.mean_motion || !satellite.inclination) {
      return [];
    }

    // Calculate semi-major axis from mean motion
    // mean_motion is in revolutions per day
    const meanMotionRadPerSec = (satellite.mean_motion * 2 * Math.PI) / (24 * 3600);
    const mu = 3.986004418e14; // Earth's gravitational parameter (m³/s²)
    const semiMajorAxisMeters = Math.pow(mu / (meanMotionRadPerSec * meanMotionRadPerSec), 1/3);
    const semiMajorAxis = (semiMajorAxisMeters / 6371000) * earthRadius; // Convert to Earth radii, then scale

    const points: THREE.Vector3[] = [];
    const eccentricity = satellite.eccentricity || 0;
    const inclination = satellite.inclination || 0;
    const raan = satellite.raan || 0;
    const argPerigee = satellite.arg_perigee || 0;

    // Generate orbit points
    for (let i = 0; i <= segments; i++) {
      const meanAnomaly = (i / segments) * 360; // degrees
      const position = calculateOrbitPosition(
        meanAnomaly,
        eccentricity,
        semiMajorAxis,
        inclination,
        raan,
        argPerigee
      );
      points.push(position);
    }

    return points;
  }, [satellite, segments, earthRadius]);

  // Create line geometry from points
  const geometry = useMemo(() => {
    if (orbitPoints.length === 0) return null;
    
    const geometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    return geometry;
  }, [orbitPoints]);

  // Animate the orbit path
  useFrame((state) => {
    if (lineRef.current && visible) {
      // Subtle rotation to show orbital motion
      lineRef.current.rotation.y += 0.001;
    }
  });

  if (!visible || !geometry || orbitPoints.length === 0) {
    return null;
  }

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial
        attach="material"
        color={color}
        opacity={opacity}
        transparent
        linewidth={2}
      />
    </line>
  );
};

/**
 * Component to render multiple orbit paths
 */
interface OrbitPathsProps {
  satellites: Array<{
    id: number;
    name: string;
    inclination?: number;
    eccentricity?: number;
    mean_motion?: number;
    raan?: number;
    arg_perigee?: number;
    mean_anomaly?: number;
    satellite_type?: string;
  }>;
  selectedSatelliteId?: number | null;
  showAllOrbits?: boolean;
}

export const OrbitPaths: React.FC<OrbitPathsProps> = ({
  satellites,
  selectedSatelliteId,
  showAllOrbits = false,
}) => {
  const getOrbitColor = (satelliteType?: string) => {
    switch (satelliteType?.toLowerCase()) {
      case 'communication': return '#00ff88';
      case 'navigation': return '#ff8800';
      case 'research': return '#8800ff';
      case 'military': return '#ff0088';
      default: return '#00aaff';
    }
  };

  return (
    <group>
      {satellites.map((satellite) => {
        const isSelected = selectedSatelliteId === satellite.id;
        const shouldShow = showAllOrbits || isSelected;
        
        if (!shouldShow) return null;

        return (
          <OrbitPath
            key={satellite.id}
            satellite={satellite}
            visible={shouldShow}
            color={getOrbitColor(satellite.satellite_type)}
            opacity={isSelected ? 0.8 : 0.3}
          />
        );
      })}
    </group>
  );
};
