import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GlobeScene } from './features/globe/GlobeScene';
import { MissionControl } from './app/layout/MissionControl';
import { useAppStore } from './store/store';

function App() {
  const toggleDrawer = useAppStore((state) => state.toggleDrawer);

  return (
    <>
      <div className="canvas-container">
        <Canvas
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
          camera={{ 
            fov: 45, 
            near: 0.1, 
            far: 1000, 
            position: [0, 0, 6.5] 
          }}
          shadows
        >
          <GlobeScene />
        </Canvas>
      </div>
      <div className="appbar">
        <button className="menu-button" onClick={toggleDrawer}>
          ☰
        </button>
        <h1 className="app-title">Orbit Tracker</h1>
      </div>
      <MissionControl />
    </>
  );
}

export default App;
