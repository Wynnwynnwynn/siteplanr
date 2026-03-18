import React from 'react';
import { useStore } from '../store.js';
import { CATALOGUE } from '../utils.js';

export function Toolbar() {
  const placingType = useStore(s => s.placingType);
  const selectedId = useStore(s => s.selectedId);
  const items = useStore(s => s.items);
  const gridStep = useStore(s => s.gridStep);
  const cancelPlacing = useStore(s => s.cancelPlacing);

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center gap-4 px-4 py-2 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-700 pointer-events-none z-10">
      <div className="pointer-events-auto flex items-center gap-2 min-w-0">
        {placingType ? (
          <>
            <span className="text-blue-400 text-sm font-semibold animate-pulse whitespace-nowrap">
              Placing: {CATALOGUE[placingType]?.label}
            </span>
            <button
              onClick={cancelPlacing}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors whitespace-nowrap"
            >
              Esc to cancel
            </button>
          </>
        ) : selectedItem ? (
          <span className="text-zinc-300 text-sm truncate">
            Selected:{' '}
            <strong className="text-white">{CATALOGUE[selectedItem.type]?.label}</strong>
            {' '}— R rotate · C clone · Del delete
          </span>
        ) : (
          <span className="text-zinc-500 text-sm whitespace-nowrap">
            Click a building to select · Drag to move
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4 text-sm text-zinc-400 flex-shrink-0">
        <span>
          Grid: <strong className="text-zinc-200">{gridStep}m</strong>
        </span>
        <span>{items.length} items</span>
      </div>
    </div>
  );
}
