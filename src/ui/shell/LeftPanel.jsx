import React, { useState } from 'react';
import { useStore } from '../../store.js';
import { CATALOGUE } from '../../utils.js';
import { ITEM_VISUALS } from '../../scene/itemVisuals.js';

const CATEGORIES = [
  { label: 'Offices',  keys: ['office6m', 'office12m'] },
  { label: 'Welfare',  keys: ['toilet', 'ablution', 'lunch'] },
  { label: 'Storage',  keys: ['cont20', 'cont40'] },
];

function CategorySection({ category }) {
  const [open, setOpen] = useState(true);
  const placingType   = useStore(s => s.placingType);
  const setPlacingType = useStore(s => s.setPlacingType);
  const cancelPlacing  = useStore(s => s.cancelPlacing);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5
                   text-pf-steel hover:text-pf-sand transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wider">
          {category.label}
        </span>
        <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="space-y-0.5 pb-2">
          {category.keys.map(key => {
            const def    = CATALOGUE[key];
            const visual = ITEM_VISUALS[key];
            const active = placingType === key;

            return (
              <button
                key={key}
                onClick={() => active ? cancelPlacing() : setPlacingType(key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left
                  transition-colors border-l-2
                  ${active
                    ? 'border-pf-orange bg-pf-orange/10 text-pf-sand'
                    : 'border-transparent hover:border-pf-steel/40 hover:bg-pf-steel/10 text-pf-sand/70 hover:text-pf-sand'
                  }`}
              >
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0 border border-black/20"
                  style={{ backgroundColor: visual?.wallColor ?? '#4E6E81' }}
                />
                <span className="text-xs font-medium flex-1 truncate">{def?.label}</span>
                <span className="text-xs text-pf-steel flex-shrink-0">${def?.weekly}/wk</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LeftPanel() {
  const clearItems = useStore(s => s.clearItems);
  const items      = useStore(s => s.items);

  return (
    <div className="h-full flex flex-col bg-pf-graphite border-r border-pf-steel/20 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-pf-steel/20 flex-shrink-0">
        <p className="text-pf-sand text-xs font-semibold uppercase tracking-widest">
          Add Buildings
        </p>
        <p className="text-pf-steel text-xs mt-0.5">Click to enter place mode</p>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {CATEGORIES.map(cat => (
          <CategorySection key={cat.label} category={cat} />
        ))}
      </div>

      <div className="px-3 py-2 border-t border-pf-steel/20 flex-shrink-0 space-y-1.5">
        <p className="text-pf-steel/50 text-xs leading-relaxed">
          R rotate · C clone · Del delete · G grid
        </p>
        {items.length > 0 && (
          <button
            onClick={clearItems}
            className="w-full text-xs text-pf-steel/60 hover:text-pf-sand transition-colors py-1"
          >
            Clear all items
          </button>
        )}
      </div>
    </div>
  );
}
