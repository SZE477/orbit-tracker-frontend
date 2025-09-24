import React, { useEffect, useRef, Suspense } from 'react';
import { useFrame, useThree, useLoader, extend } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { 
  ACESFilmicToneMapping,
  TextureLoader,
  SRGBColorSpace,
  LinearSRGBColorSpace,
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

// Complete Earth component with all textures
const RealisticEarth: React.FC = () => {
  const earthRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  
  // Load all Earth textures
  const [
    dayTexture,
    nightTexture,
    normalTexture,
    roughnessTexture,
    cloudsTexture
  ] = useLoader(TextureLoader, [
    '/earth-textures/2k_earth_daymap.jpg',
    '/earth-textures/2k_earth_nightmap.jpg',
    '/earth-textures/2k_earth_normal_map.jpg',
    '/earth-textures/2k_earth_roughness.jpg',
    '/earth-textures/2k_earth_clouds.png'
  ]);

  // Configure texture color spaces - CRITICAL for realistic rendering
  useEffect(() => {
    // Color textures (day/night/clouds) use sRGB color space
    dayTexture.colorSpace = SRGBColorSpace;
    nightTexture.colorSpace = SRGBColorSpace;
    cloudsTexture.colorSpace = SRGBColorSpace;
    
    // Data textures (normal/roughness/specular) use linear color space
    normalTexture.colorSpace = LinearSRGBColorSpace;
    roughnessTexture.colorSpace = LinearSRGBColorSpace;
  }, [dayTexture, nightTexture, normalTexture, roughnessTexture, cloudsTexture]);

  // Rotate Earth realistically
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.005; // Earth rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.007; // Clouds move faster
    }
  });

  return (
    <group>
      {/* Main Earth sphere with all textures */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={dayTexture}
          normalMap={normalTexture}
          roughnessMap={roughnessTexture}
          emissiveMap={nightTexture}
          emissiveIntensity={0.6}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.005, 128, 128]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          alphaMap={cloudsTexture}
          depthWrite={false}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};

// Fallback simple Earth for when textures don't load
const SimpleEarth: React.FC = () => {
  const earthRef = useRef<Mesh>(null);
  
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 128, 128]} />
      <meshStandardMaterial
        color="#4a90e2"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
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
      {/* Deep space background */}
      <color attach="background" args={['#020308']} />
      
      {/* Physically-based lighting setup */}
      <ambientLight intensity={0.1} color="#404080" />
      <directionalLight 
        position={[10, 0, 5]} 
        intensity={3.0}
        color="#fff8e1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Environment lighting for realistic reflections */}
      <Environment preset="city" background={false} />
      
      {/* Beautiful star field */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Earth with progressive texture loading */}
      <Suspense fallback={<SimpleEarth />}>
        <RealisticEarth />
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
        rotateSpeed={0.4}
        zoomSpeed={0.6}
      />
    </>
  );
};