import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Spinner from '../components/ui/Spinner';

// Lazy load every page for code splitting
const Dashboard    = lazy(() => import('../pages/Dashboard'));
const Query        = lazy(() => import('../pages/Query'));
const ProductSearch = lazy(() => import('../pages/ProductSearch'));
const ImageSearch  = lazy(() => import('../pages/ImageSearch'));
const Explorer     = lazy(() => import('../pages/Explorer'));
const NotFound     = lazy(() => import('../pages/NotFound'));

// Full-screen fallback shown during lazy chunk loading
function PageLoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-app)',
    }}>
      <Spinner size="lg" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* All routes share the AppLayout (Sidebar + Navbar) */}
        <Route element={<AppLayout />}>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/query"        element={<Query />} />
          <Route path="/search"       element={<ProductSearch />} />
          <Route path="/image-search" element={<ImageSearch />} />
          <Route path="/explorer"     element={<Explorer />} />
        </Route>

        {/* 404 - no sidebar layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
