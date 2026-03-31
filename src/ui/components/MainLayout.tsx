import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';

interface MainLayoutProps {
  children?: React.ReactNode;
  title?: string;
  onSettingsClick?: () => void;
  sidebarItems?: any[];
  itemCount?: number;
  gridSize?: number;
  isGridVisible?: boolean;
}

/**
 * MainLayout Component
 *
 * Main application layout wrapper that coordinates:
 * - Fixed header at top
 * - Collapsible sidebar
 * - Main content area (centered)
 * - Fixed status bar at bottom
 *
 * Responsive design with mobile-friendly sidebar drawer.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'SitePlanr',
  onSettingsClick,
  sidebarItems,
  itemCount = 0,
  gridSize = 1,
  isGridVisible = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [gridToggle, setGridToggle] = useState(isGridVisible);

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header - Fixed */}
      <Header
        title={title}
        onMenuToggle={setIsSidebarOpen}
        onSettingsClick={onSettingsClick}
      />

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden pt-16 pb-10">
        {/* Sidebar - Collapsible */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          items={sidebarItems}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {/* Status Bar - Fixed */}
      <StatusBar
        itemCount={itemCount}
        gridSize={gridSize}
        isGridVisible={gridToggle}
        onGridToggle={() => setGridToggle(!gridToggle)}
      />
    </div>
  );
};

export default MainLayout;
