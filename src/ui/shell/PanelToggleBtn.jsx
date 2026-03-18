import React from 'react';

/**
 * Collapse/expand toggle button shown on the edge of a collapsible panel.
 * side: 'left' | 'right' | 'bottom'
 * isOpen: current state
 * onClick: call panelRef.current.collapse() or .expand()
 */
export function PanelToggleBtn({ side, isOpen, onClick }) {
  const arrows = {
    left:   isOpen ? '‹' : '›',
    right:  isOpen ? '›' : '‹',
    bottom: isOpen ? '˅' : '˄',
  };

  const posClass = {
    left:   'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-20',
    right:  'absolute left-0  top-1/2 -translate-y-1/2 -translate-x-full z-20',
    bottom: 'absolute top-0  left-1/2 -translate-x-1/2 -translate-y-full z-20',
  };

  return (
    <button
      onClick={onClick}
      title={isOpen ? 'Collapse panel' : 'Expand panel'}
      className={`${posClass[side]} flex items-center justify-center
        w-5 h-8 rounded-sm
        bg-pf-navy border border-pf-steel/40
        text-pf-steel hover:text-pf-sand hover:bg-pf-steel/20
        text-xs font-bold transition-colors select-none`}
    >
      {arrows[side]}
    </button>
  );
}
