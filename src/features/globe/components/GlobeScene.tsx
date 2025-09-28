import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Earth } from './Earth';
import Satellites from './Satellites';

const GlobeScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <Stars radius={300} depth={50} count={10000} factor={7} saturation={0} fade speed={1} />
      
      <Earth />
      <Satellites />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={1.2}
        maxDistance={10}
        zoomSpeed={0.5}
      />
    </Canvas>
  );
};

export default GlobeScene;