import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onStartPlacing?: () => void;
}

/**
 * Empty State Component
 *
 * Shown when no items have been placed on the site.
 * Encourages users to get started with clear instructions.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ onStartPlacing }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pf-graphite/95 to-pf-graphite/85 z-10 pointer-events-none">
      <div className="text-center pointer-events-auto max-w-md px-8">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-lg bg-pf-orange/20 flex items-center justify-center">
            <Plus className="w-8 h-8 text-pf-orange" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-pf-white mb-3">
          Welcome to Your Site Plan
        </h2>

        {/* Description */}
        <p className="text-pf-silver mb-8 text-sm leading-relaxed">
          Start by selecting an item from the left panel, then click on the site
          to place it. You can move, rotate, and edit items as needed.
        </p>

        {/* Hints */}
        <div className="space-y-3 text-left bg-pf-steel/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-pf-orange font-bold text-lg flex-shrink-0">1</span>
            <p className="text-pf-silver text-sm">Browse the catalog on the left</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-pf-orange font-bold text-lg flex-shrink-0">2</span>
            <p className="text-pf-silver text-sm">Click to select an item type</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-pf-orange font-bold text-lg flex-shrink-0">3</span>
            <p className="text-pf-silver text-sm">Click on the site to place it</p>
          </div>
        </div>

        {/* Tip */}
        <p className="text-xs text-pf-steel">
          💡 Tip: Use the right panel to adjust properties and dimensions
        </p>
      </div>
    </div>
  );
};
