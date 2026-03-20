import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onMenuToggle?: (isOpen: boolean) => void;
  onSettingsClick?: () => void;
}

/**
 * Header Component
 *
 * Main application header with logo, title, navigation, and user controls.
 * Responsive design with mobile menu toggle.
 */
export const Header: React.FC<HeaderProps> = ({
  title = 'SitePlanr',
  onMenuToggle,
  onSettingsClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-neutral-0 border-b border-neutral-200 shadow-sm z-40 dark:bg-neutral-900 dark:border-neutral-800">
      <div className="h-16 px-lg flex items-center justify-between">
        {/* Left: Logo and Menu Toggle */}
        <div className="flex items-center gap-lg">
          {/* Menu Toggle - Mobile */}
          <button
            onClick={handleMenuToggle}
            className="lg:hidden p-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-neutral-900 dark:text-neutral-50" />
            ) : (
              <Menu size={24} className="text-neutral-900 dark:text-neutral-50" />
            )}
          </button>

          {/* Logo / Brand */}
          <div className="flex items-center gap-md">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-neutral-0 font-bold text-sm">SP</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-body_md font-semibold text-neutral-900 dark:text-neutral-50">
                {title}
              </h1>
              <p className="text-caption text-neutral-500 dark:text-neutral-400">
                Site Planning
              </p>
            </div>
          </div>
        </div>

        {/* Center: spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center gap-md">
          {/* Search - Desktop only */}
          <div className="hidden md:flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg px-md py-sm">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-body_sm text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 outline-none w-32"
            />
          </div>

          {/* Settings Button */}
          <button
            onClick={onSettingsClick}
            className="p-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          {/* User Profile - Optional */}
          <button
            className="hidden sm:flex items-center gap-sm p-xs rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-neutral-0 text-sm font-semibold">
              U
            </div>
            <span className="hidden md:block text-body_sm text-neutral-900 dark:text-neutral-50">
              User
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
