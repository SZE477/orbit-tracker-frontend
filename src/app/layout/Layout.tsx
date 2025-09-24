import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/features/satellites/components/Sidebar';

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