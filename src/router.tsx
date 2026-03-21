import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import Editor from './pages/Editor';
import { ProjectSettings } from './pages/ProjectSettings';

/**
 * App Router
 *
 * Defines the routing structure for SitePlanr:
 * - / → Dashboard (project list)
 * - /editor/:projectId → 3D Editor for specific project
 * - /settings/:projectId → Project settings/details editor
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard - Project list view */}
        <Route path="/" element={<DashboardPage />} />

        {/* Editor - 3D site configurator */}
        <Route path="/editor/:projectId" element={<Editor />} />

        {/* Project Settings - Details and metadata editor */}
        <Route path="/settings/:projectId" element={<ProjectSettings />} />

        {/* Fallback - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
