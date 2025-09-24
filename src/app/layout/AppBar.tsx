import React from 'react';
import { useSidebarStore } from '../../store/uiStore';

export const AppBar: React.FC = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <div className="appbar">
      <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
        Menu
      </button>
      <h1>Orbit Tracker</h1>
    </div>
  );
};