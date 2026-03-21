import React from 'react';

export function MenuItem({ label, onClick, danger, disabled, subtitle }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm
        transition-colors text-left
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : danger
            ? 'text-red-400 hover:bg-red-900/20'
            : 'text-pf-sand hover:bg-pf-steel/20'
        }`}
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{label}</span>
        {subtitle && <span className="text-xs text-pf-steel">{subtitle}</span>}
      </div>
    </button>
  );
}

export function MenuDivider() {
  return <div className="h-px bg-pf-steel/20 my-1" />;
}

export function MenuLabel({ children }) {
  return (
    <div className="px-3 py-1.5 text-xs uppercase tracking-wider text-pf-steel font-semibold">
      {children}
    </div>
  );
}
