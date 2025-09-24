import React, { useEffect, useRef, Suspense } from 'react';
import { useFrame, useThree, useLoader, extend } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Satellites } from './components/Satellites';
import {
  ACESFilmicToneMapping,
  TextureLoader,
  SRGBColorSpace,
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
  Group,
  Color,
  AmbientLight,
  DirectionalLight
} from 'three';

// Extend THREE namespace for R3F
extend({ 
  Mesh, 
  SphereGeometry, 
  MeshStandardMaterial, 
  Group, 
  Color, 
  AmbientLight, 
  DirectionalLight 
});

// Earth component with texture loading
const Earth: React.FC = () => {
  const earthRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  
  // Load day texture with fallback
  let dayTexture = null;
  try {
    dayTexture = useLoader(TextureLoader, '/earth-textures/2k_earth_daymap.jpg');
  } catch {
    // Fallback to no texture
    dayTexture = null;
  }
  
  // Configure texture color spaces
  useEffect(() => {
    if (dayTexture) {
      dayTexture.colorSpace = SRGBColorSpace;
    }
  }, [dayTexture]);

  // Rotate Earth slowly
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.01;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={dayTexture}
          color={dayTexture ? 0xffffff : 0x4a90e2}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Simplified clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.005, 64, 64]} />
        <meshStandardMaterial
          color={0xffffff}
          transparent
          opacity={0.15}
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};

export const GlobeScene: React.FC = () => {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    gl.shadowMap.enabled = true;
  }, [gl]);

  return (
    <>
      {/* Dark space background */}
      <color attach="background" args={['#050810']} />
      
      {/* Lighting setup for realistic Earth */}
      <ambientLight intensity={0.15} color="#404080" />
      <directionalLight 
        position={[10, 0, 5]} 
        intensity={2.2}
        color="#fff8e1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Environment lighting for subtle reflections */}
      <Environment preset="city" background={false} />
      
      {/* Beautiful star field */}
      <Stars 
        radius={100} 
        depth={50} 
        count={4000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Earth with progressive loading */}
      <Suspense fallback={
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial color="#4a90e2" roughness={0.7} />
        </mesh>
      }>
        <Earth />
      </Suspense>

      {/* Satellites */}
      <Suspense fallback={null}>
        <Satellites />
      </Suspense>
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
    </>
  );
};

export default GlobeScene;