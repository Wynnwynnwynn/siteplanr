import React, { useRef, useEffect } from 'react';

export function Dropdown({ trigger, children, align = 'left' }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-3 py-2 rounded text-xs font-medium
                   text-pf-sand hover:bg-pf-steel/20 transition-colors"
      >
        {trigger}
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1 bg-pf-graphite border border-pf-steel/30 rounded shadow-lg
            z-40 py-1 min-w-48
            ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
