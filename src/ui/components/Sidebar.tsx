import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Home,
  Settings as SettingsIcon,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
  isActive?: boolean;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: NavItem[];
  onNavigate?: (itemId: string) => void;
}

const defaultItems: NavItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    icon: <Home size={20} />,
    href: '#/projects',
    isActive: true,
  },
  {
    id: 'files',
    label: 'Files',
    icon: <Folder size={20} />,
    href: '#/files',
    children: [
      { id: 'files-recent', label: 'Recent', icon: <FileText size={16} />, href: '#/files/recent' },
      { id: 'files-all', label: 'All Files', icon: <FileText size={16} />, href: '#/files/all' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon size={20} />,
    href: '#/settings',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: <HelpCircle size={20} />,
    href: '#/help',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  items = defaultItems,
  onNavigate,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpand(item.id);
    }
    item.onClick?.();
    onNavigate?.(item.id);
    // Close mobile sidebar after navigation
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`
            w-full flex items-center gap-md px-lg py-md rounded-md transition-colors
            ${
              item.isActive
                ? 'bg-primary-100 dark:bg-primary-900 text-primary font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-50'
            }
          `}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span className="flex-1 text-left text-body_md">{item.label}</span>
          {hasChildren && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
        </button>

        {/* Child Items */}
        {hasChildren && isExpanded && (
          <div className="mt-xs">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-16 lg:top-0 left-0 h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] w-64
          bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800
          overflow-y-auto transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="flex flex-col gap-xs p-md">
          {items.map((item) => renderNavItem(item))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-md border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <button className="w-full text-left text-caption text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
            Keyboard Shortcuts
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
