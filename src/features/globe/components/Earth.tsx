import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null!);

  const [dayMap, , cloudsMap, normalMap] = useTexture([
    '/earth-textures/2k_earth_daymap.jpg',
    '/earth-textures/2k_earth_nightmap.jpg',
    '/earth-textures/2k_earth_clouds.jpg',
    '/earth-textures/2k_earth_normal_map.jpg',
    '/earth-textures/2k_earth_specular_map.jpg',
  ]);

  useFrame(({ clock }) => {
    // Rotate the Earth for a day/night cycle effect
    earthRef.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      {/* Add clouds layer */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={cloudsMap} transparent opacity={0.3} />
      </mesh>
    </>
  );
};