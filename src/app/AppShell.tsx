import React, { useEffect } from 'react';
import GlobeScene from '../features/globe/GlobeScene';
import SatelliteList from '../features/satellites/SatelliteList';

const AppShell: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'p') {
        console.log('Play/Pause toggled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <aside className="w-96 shrink-0 border-r border-border bg-card/70 backdrop-blur-sm supports-[backdrop-filter]:bg-card/60 flex flex-col">
        <div className="p-5 pb-3">
          <h1 className="text-lg font-semibold tracking-wide text-primary">Satellite Tracker</h1>
            <p className="mt-1 text-xs text-muted-foreground/80 uppercase tracking-[0.2em]">Mission Control</p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
          <SatelliteList />
        </div>
        <div className="p-4 border-t border-border text-[10px] text-muted-foreground/60 tracking-wide uppercase">
          v1.0 • Live
        </div>
      </aside>
      <main className="flex-1 relative">
        <GlobeScene />
      </main>
    </div>
  );
};

export default AppShell;