import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import Editor from './pages/Editor';

/**
 * App Router
 *
 * Defines the routing structure for SitePlanr:
 * - / → Dashboard (project list)
 * - /editor/:projectId → 3D Editor for specific project
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard - Project list view */}
        <Route path="/" element={<DashboardPage />} />

        {/* Editor - 3D site configurator */}
        <Route path="/editor/:projectId" element={<Editor />} />

        {/* Fallback - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
