import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/app/layout/Layout';
import { Loader } from 'lucide-react';

// Lazy load pages for better code splitting
const ExplorerPage = lazy(() => import('@/pages/ExplorerPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

const FullPageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Loader className="h-8 w-8 animate-spin" />
  </div>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/explorer" replace />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add SatelliteDetail page route later: /satellites/:noradId */}
          <Route path="*" element={<Navigate to="/explorer" replace />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);