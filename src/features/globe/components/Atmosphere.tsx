import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Atmospheric glow effect using a custom shader
 */
export const Atmosphere: React.FC = () => {
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Custom atmosphere shader
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Fresnel effect for atmospheric glow
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
          
          // Add some subtle animation
          float pulse = sin(time * 0.5) * 0.1 + 0.9;
          
          // Create the glow effect
          float intensity = pow(fresnel, 2.0) * pulse;
          
          gl_FragColor = vec4(color, intensity * 0.6);
        }
      `,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0.3, 0.6, 1.0) }, // Blue atmospheric color
      },
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Animate the atmosphere
  useFrame((state) => {
    if (atmosphereRef.current) {
      atmosphereMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={atmosphereMaterial} />
    </mesh>
  );
};

/**
 * Enhanced Earth component with better materials and lighting
 */
export const EnhancedEarth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Create enhanced materials
  const earthMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x6B93D6,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Load textures if available
    const loader = new THREE.TextureLoader();
    
    // Day texture
    loader.load('/earth-textures/2k_earth_daymap.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
    });

    // Normal map for surface detail
    loader.load('/earth-textures/2k_earth_normal_map.jpg', (texture) => {
      material.normalMap = texture;
      material.normalScale = new THREE.Vector2(0.5, 0.5);
      material.needsUpdate = true;
    });

    // Specular map for ocean reflections
    loader.load('/earth-textures/2k_earth_specular_map.jpg', (texture) => {
      material.roughnessMap = texture;
      material.needsUpdate = true;
    });

    return material;
  }, []);

  const cloudsMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.4,
      alphaTest: 0.1,
    });

    // Load cloud texture
    const loader = new THREE.TextureLoader();
    loader.load('/earth-textures/2k_earth_clouds.jpg', (texture) => {
      material.alphaMap = texture;
      material.needsUpdate = true;
    });

    return material;
  }, []);

  // Rotate Earth and clouds
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.02; // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.025; // Slightly faster cloud rotation
    }
  });

  return (
    <group>
      {/* Earth surface */}
      <mesh ref={earthRef} receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={earthMaterial} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={cloudsMaterial} />
      </mesh>

      {/* Atmospheric glow */}
      <Atmosphere />
    </group>
  );
};

/**
 * Level of Detail (LOD) Earth component
 * Switches between high and low detail based on camera distance
 */
export const LODEarth: React.FC = () => {
  const { camera } = useFrame((state) => state);
  const [detail, setDetail] = React.useState<'high' | 'low'>('high');

  useFrame(() => {
    const distance = camera.position.length();
    const newDetail = distance > 8 ? 'low' : 'high';
    if (newDetail !== detail) {
      setDetail(newDetail);
    }
  });

  const segments = detail === 'high' ? 64 : 32;

  return (
    <group>
      <mesh receiveShadow>
        <sphereGeometry args={[1, segments, segments]} />
        <meshStandardMaterial
          color={0x6B93D6}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <Atmosphere />
    </group>
  );
};
