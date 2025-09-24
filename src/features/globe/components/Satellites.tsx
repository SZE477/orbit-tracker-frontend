import { usePositions } from '../../../shared/api/hooks/usePositionQueries';
import { useSatellites } from '../../../shared/api/hooks/useSatelliteQueries';
import { useCategories } from '../../../shared/api/hooks/useCategoryQueries';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Position, Satellite } from '../../../shared/api/types';

// Converts latitude and longitude to a 3D point on a sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const Satellites = () => {
  // Fetch recent positions for all satellites
  const { data: positionsData, isLoading: isLoadingPositions } = usePositions({
    page_size: 100, // Get more positions
    ordering: '-timestamp', // Get most recent first
  });

  // Fetch satellites data to get satellite info
  const { data: satellitesData, isLoading: isLoadingSatellites } = useSatellites();
  const { data: categoriesData } = useCategories();

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);

  // Process the position data to create satellite positions
  const satellitePositions = useMemo(() => {
    // If we have real position data, use it
    if (positionsData?.results && positionsData.results.length > 0 && satellitesData?.results) {
      // Group positions by satellite and get the most recent position for each
      const latestPositions = new Map<number, Position>();

      positionsData.results.forEach((position: Position) => {
        const existing = latestPositions.get(position.satellite);
        if (!existing || new Date(position.timestamp) > new Date(existing.timestamp)) {
          latestPositions.set(position.satellite, position);
        }
      });

      // Convert to array with satellite info
      return Array.from(latestPositions.values()).map(position => {
        const satellite = satellitesData.results.find((sat: Satellite) => sat.id === position.satellite);
        return {
          position,
          satellite,
        };
      }).filter(item => item.satellite); // Only include positions with valid satellite data
    }

    // Otherwise, create mock positions for demonstration
    if (satellitesData?.results && satellitesData.results.length > 0) {
      return satellitesData.results.slice(0, 5).map((satellite: Satellite, index: number) => {
        // Create mock positions for the first 5 satellites
        const mockPosition: Position = {
          id: index + 1,
          satellite: satellite.id,
          latitude: (Math.random() - 0.5) * 180, // Random latitude
          longitude: (Math.random() - 0.5) * 360, // Random longitude
          altitude_km: 400 + Math.random() * 600, // Random altitude between 400-1000km
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        return {
          position: mockPosition,
          satellite,
        };
      });
    }

    return [];
  }, [positionsData, satellitesData]);

  // Build a quick category color map
  const categoryColorMap = useMemo(() => {
    const map = new Map<number, string>();
    const categories = (categoriesData as any)?.results || [];
    categories.forEach((c: any) => map.set(c.id, c.color_hex || '#ff6b35'));
    return map;
  }, [categoriesData]);

  // Apply per-instance colors whenever the set changes
  useEffect(() => {
    if (!instancedMeshRef.current || !glowMeshRef.current || satellitePositions.length === 0) return;
    const color = new THREE.Color();
    satellitePositions.forEach((item, i) => {
      const rawCat = (item.satellite as any)?.category;
      const catId = typeof rawCat === 'number' ? rawCat : rawCat?.id;
      const hex = categoryColorMap.get(catId || 0) || '#ff6b35';
      color.set(hex);
      instancedMeshRef.current!.setColorAt(i, color);
      glowMeshRef.current!.setColorAt(i, color);
    });
    instancedMeshRef.current.instanceColor && (instancedMeshRef.current.instanceColor.needsUpdate = true);
    glowMeshRef.current.instanceColor && (glowMeshRef.current.instanceColor.needsUpdate = true);
  }, [satellitePositions, categoryColorMap]);

  useFrame(({ clock }) => {
    if (!instancedMeshRef.current || !glowMeshRef.current || satellitePositions.length === 0) return;

    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    satellitePositions.forEach((item, i) => {
      const { latitude, longitude, altitude_km } = item.position;
      const earthRadius = 2; // Earth's radius in scene units
      const altitudeScale = 0.0005; // Visible altitude scaling
      const radius = earthRadius + Math.max(altitude_km * altitudeScale, 0.05);

      const position = latLonToVector3(latitude, longitude, radius);

      // Core point
      dummy.position.copy(position);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);

      // Glow (slightly larger, pulsing)
      const pulse = 1.6 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 0.35));
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      glowMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    glowMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const isLoading = isLoadingPositions || isLoadingSatellites;

  if (isLoading || satellitePositions.length === 0) return null;

  return (
    <>
      {/* Glow layer (additive, semi-transparent) */}
      <instancedMesh ref={glowMeshRef} args={[undefined, undefined, satellitePositions.length]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial vertexColors transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>

      {/* Core point */}
      <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, satellitePositions.length]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial vertexColors toneMapped={false} />
      </instancedMesh>
    </>
  );
};