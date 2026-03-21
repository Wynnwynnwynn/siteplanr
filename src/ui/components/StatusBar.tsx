import React from 'react';
import { Grid, Eye, Lock, Settings } from 'lucide-react';

interface StatusBarProps {
  itemCount?: number;
  gridSize?: number;
  onGridToggle?: () => void;
  onGridSizeChange?: (size: number) => void;
  isGridVisible?: boolean;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
  version?: string;
}

/**
 * StatusBar Component
 *
 * Bottom status bar showing context-specific information like item count,
 * grid settings, connection status, and version info.
 */
export const StatusBar: React.FC<StatusBarProps> = ({
  itemCount = 0,
  gridSize = 1,
  onGridToggle,
  onGridSizeChange,
  isGridVisible = true,
  connectionStatus = 'connected',
  version = 'v0.1.0',
}) => {
  const statusColor =
    connectionStatus === 'connected'
      ? 'text-success'
      : connectionStatus === 'connecting'
        ? 'text-warning'
        : 'text-error';

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 h-10 flex items-center justify-between px-lg gap-md text-caption text-neutral-600 dark:text-neutral-400">
      {/* Left: Item Count */}
      <div className="flex items-center gap-sm">
        <span>
          Items: <strong className="text-neutral-900 dark:text-neutral-50">{itemCount}</strong>
        </span>
      </div>

      {/* Center: Grid Controls */}
      <div className="hidden sm:flex items-center gap-md">
        {/* Grid Toggle */}
        <button
          onClick={onGridToggle}
          className={`
            p-xs rounded transition-colors flex items-center gap-xs
            ${
              isGridVisible
                ? 'bg-primary-100 dark:bg-primary-900 text-primary'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }
          `}
          title="Toggle grid display"
        >
          <Grid size={14} />
          <span className="hidden md:inline">Grid</span>
        </button>

        {/* Grid Size */}
        {isGridVisible && (
          <div className="flex items-center gap-xs">
            <label htmlFor="gridSize" className="text-neutral-500 dark:text-neutral-400">
              Size:
            </label>
            <input
              id="gridSize"
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={gridSize}
              onChange={(e) => onGridSizeChange?.(parseFloat(e.target.value))}
              className="w-12 px-xs py-xs text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 rounded border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span>m</span>
          </div>
        )}
      </div>

      {/* Right: Status and Version */}
      <div className="flex items-center gap-md ml-auto">
        {/* Connection Status */}
        <div className="flex items-center gap-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-success'
                : connectionStatus === 'connecting'
                  ? 'bg-warning animate-pulse'
                  : 'bg-error'
            }`}
          />
          <span className={statusColor}>
            {connectionStatus === 'connected'
              ? 'Connected'
              : connectionStatus === 'connecting'
                ? 'Connecting...'
                : 'Disconnected'}
          </span>
        </div>

        {/* Version */}
        <span className="hidden md:inline text-neutral-500 dark:text-neutral-400 px-sm border-l border-neutral-300 dark:border-neutral-700">
          {version}
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;
