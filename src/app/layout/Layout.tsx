import { Outlet } from 'react-router-dom';
import React from 'react';

// Temporary stub to avoid missing import error
const Sidebar: React.FC = () => (
  <aside className="w-64 shrink-0 border-r border-border">
    <div className="p-4 text-sm text-muted-foreground">Sidebar component not found.</div>
  </aside>
);

export const Layout = () => {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};